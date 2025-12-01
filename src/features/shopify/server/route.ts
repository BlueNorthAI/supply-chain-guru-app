import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ID, Query } from "node-appwrite";
import crypto from "crypto";

import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, SHOPIFY_TENANTS_ID, SHOPIFY_OAUTH_STATES_ID, SHOPIFY_SYNC_JOBS_ID } from "@/config";
import { getMember } from "@/features/members/utils";

import {
  initOAuthSchema,
  callbackQuerySchema,
  getTenantSchema,
  triggerSyncSchema,
  getSyncJobsSchema,
} from "../schemas";
import { encryptToken } from "../lib/encryption";
import { verifyHmac } from "../lib/hmac";
import { fetchShopInfo } from "../lib/shopify-client";
import { SHOPIFY_SCOPES, SHOPIFY_OAUTH_STATE_TTL } from "../constants";

const app = new Hono()
  // Initialize OAuth flow
  .post(
    "/auth/init",
    sessionMiddleware,
    zValidator("json", initOAuthSchema),
    async (c) => {
      try {
        const user = c.get("user");
        const databases = c.get("databases");
        const { shopDomain, workspaceId } = c.req.valid("json");

        console.log("OAuth init request:", { shopDomain, workspaceId, userId: user.$id });

        // Verify user is member of workspace
        const member = await getMember({
          databases,
          workspaceId,
          userId: user.$id,
        });

        if (!member) {
          console.log("Unauthorized: User is not a member of workspace");
          return c.json({ error: "Unauthorized" }, 401);
        }

        console.log("User is member of workspace:", member.role);

        // Check if shop is already connected to this workspace
        const existingTenants = await databases.listDocuments(
          DATABASE_ID,
          SHOPIFY_TENANTS_ID,
          [
            Query.equal("shopDomain", shopDomain),
            Query.equal("workspaceId", workspaceId),
          ]
        );

        if (existingTenants.total > 0) {
          console.log("Shop already connected");
          return c.json({ error: "Shop is already connected to this workspace" }, 400);
        }

        // Generate state and nonce for CSRF protection
        // State is used in OAuth flow - keep it at 32 chars to fit Appwrite's 36 char limit
        const state = crypto.randomBytes(16).toString("hex"); // 32 chars
        const nonce = crypto.randomBytes(16).toString("hex");

        console.log("Creating OAuth state document...");

        // Store OAuth state
        await databases.createDocument(
          DATABASE_ID,
          SHOPIFY_OAUTH_STATES_ID,
          state,
          {
            workspaceId,
            userId: user.$id,
            shopDomain,
            nonce,
            expiresAt: new Date(Date.now() + SHOPIFY_OAUTH_STATE_TTL).toISOString(),
          }
        );

        console.log("OAuth state created successfully");

        // Build authorization URL
        const scopes = SHOPIFY_SCOPES.join(",");
        const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/shopify/callback`;

        const authUrl = new URL(`https://${shopDomain}/admin/oauth/authorize`);
        authUrl.searchParams.set("client_id", process.env.SHOPIFY_API_KEY!);
        authUrl.searchParams.set("scope", scopes);
        authUrl.searchParams.set("redirect_uri", redirectUri);
        authUrl.searchParams.set("state", state);

        console.log("Generated auth URL:", authUrl.toString());

        return c.json({ data: { authUrl: authUrl.toString() } });
      } catch (error: any) {
        console.error("OAuth init error:", error);
        console.error("Error stack:", error.stack);
        return c.json({ error: error.message || "Failed to initialize OAuth" }, 500);
      }
    }
  )

  // OAuth callback handler
  .get(
    "/callback",
    zValidator("query", callbackQuerySchema),
    async (c) => {
      const { code, shop, state, hmac } = c.req.valid("query");

      // Create admin client for this operation (no session required)
      const { Client, Databases } = await import("node-appwrite");
      const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
        .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT!)
        .setKey(process.env.NEXT_APPWRITE_KEY!);

      const databases = new Databases(client);

      // Validate state
      let oauthState;
      try {
        oauthState = await databases.getDocument(
          DATABASE_ID,
          SHOPIFY_OAUTH_STATES_ID,
          state
        );
      } catch {
        return c.redirect(`/error?code=invalid_state`);
      }

      // Check if state is expired
      if (new Date(oauthState.expiresAt) < new Date()) {
        await databases.deleteDocument(DATABASE_ID, SHOPIFY_OAUTH_STATES_ID, state);
        return c.redirect(`/error?code=state_expired`);
      }

      // Verify shop domain matches
      if (oauthState.shopDomain !== shop) {
        return c.redirect(`/error?code=shop_mismatch`);
      }

      // Verify HMAC
      const queryParams = c.req.query();
      if (!verifyHmac(queryParams, process.env.SHOPIFY_API_SECRET!)) {
        return c.redirect(`/error?code=invalid_hmac`);
      }

      // Exchange code for access token
      const tokenResponse = await fetch(
        `https://${shop}/admin/oauth/access_token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            client_id: process.env.SHOPIFY_API_KEY,
            client_secret: process.env.SHOPIFY_API_SECRET,
            code,
          }),
        }
      );

      if (!tokenResponse.ok) {
        return c.redirect(`/error?code=token_exchange_failed`);
      }

      const tokenData = await tokenResponse.json();
      const { access_token, scope } = tokenData;

      // Fetch shop information
      const shopInfo = await fetchShopInfo(shop, access_token);

      if (!shopInfo) {
        return c.redirect(`/error?code=shop_info_failed`);
      }

      // Encrypt access token
      const encryptedToken = encryptToken(
        access_token,
        process.env.SHOPIFY_ENCRYPTION_KEY!
      );

      // Create tenant record
      await databases.createDocument(
        DATABASE_ID,
        SHOPIFY_TENANTS_ID,
        ID.unique(),
        {
          workspaceId: oauthState.workspaceId,
          userId: oauthState.userId,
          shopDomain: shop,
          shopId: String(shopInfo.id),
          shopName: shopInfo.name,
          shopEmail: shopInfo.email,
          shopCurrency: shopInfo.currency,
          shopTimezone: shopInfo.iana_timezone,
          accessToken: encryptedToken,
          scopes: scope,
          status: "active",
          installedAt: new Date().toISOString(),
          lastSyncAt: null,
          syncEnabled: true,
          errorMessage: null,
          planName: shopInfo.plan_name,
          shopifyPlanDisplayName: shopInfo.plan_display_name,
        }
      );

      // Clean up OAuth state
      await databases.deleteDocument(DATABASE_ID, SHOPIFY_OAUTH_STATES_ID, state);

      // Redirect to success page
      return c.redirect(
        `/workspaces/${oauthState.workspaceId}/integrations/shopify?success=true`
      );
    }
  )

  // List connected tenants
  .get(
    "/tenants",
    sessionMiddleware,
    zValidator("query", getTenantSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { workspaceId } = c.req.valid("query");

      // Verify membership
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const tenants = await databases.listDocuments(
        DATABASE_ID,
        SHOPIFY_TENANTS_ID,
        [
          Query.equal("workspaceId", workspaceId),
          Query.orderDesc("$createdAt"),
        ]
      );

      // Remove sensitive data from response
      const sanitizedTenants = tenants.documents.map((tenant) => ({
        ...tenant,
        accessToken: undefined, // Never expose token to client
      }));

      return c.json({ data: { tenants: sanitizedTenants } });
    }
  )

  // Get single tenant
  .get(
    "/tenants/:tenantId",
    sessionMiddleware,
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { tenantId } = c.req.param();

      const tenant = await databases.getDocument(
        DATABASE_ID,
        SHOPIFY_TENANTS_ID,
        tenantId
      );

      // Verify membership
      const member = await getMember({
        databases,
        workspaceId: tenant.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      return c.json({
        data: {
          ...tenant,
          accessToken: undefined,
        },
      });
    }
  )

  // Disconnect tenant
  .delete(
    "/tenants/:tenantId",
    sessionMiddleware,
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { tenantId } = c.req.param();

      const tenant = await databases.getDocument(
        DATABASE_ID,
        SHOPIFY_TENANTS_ID,
        tenantId
      );

      // Verify membership (only admins can disconnect)
      const member = await getMember({
        databases,
        workspaceId: tenant.workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== "ADMIN") {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // TODO: Optionally revoke token on Shopify side

      await databases.deleteDocument(
        DATABASE_ID,
        SHOPIFY_TENANTS_ID,
        tenantId
      );

      return c.json({ data: { success: true } });
    }
  )

  // Trigger sync job
  .post(
    "/tenants/:tenantId/sync",
    sessionMiddleware,
    zValidator("json", triggerSyncSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { tenantId } = c.req.param();
      const { jobType } = c.req.valid("json");

      const tenant = await databases.getDocument(
        DATABASE_ID,
        SHOPIFY_TENANTS_ID,
        tenantId
      );

      // Verify membership
      const member = await getMember({
        databases,
        workspaceId: tenant.workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Check for existing running job
      const runningJobs = await databases.listDocuments(
        DATABASE_ID,
        SHOPIFY_SYNC_JOBS_ID,
        [
          Query.equal("tenantId", tenantId),
          Query.equal("status", "running"),
        ]
      );

      if (runningJobs.total > 0) {
        return c.json({ error: "A sync job is already running" }, 400);
      }

      // Create sync job
      const syncJob = await databases.createDocument(
        DATABASE_ID,
        SHOPIFY_SYNC_JOBS_ID,
        ID.unique(),
        {
          tenantId,
          workspaceId: tenant.workspaceId,
          jobType,
          triggerType: "manual",
          status: "pending",
          progress: 0,
          startedAt: null,
          completedAt: null,
          recordsProcessed: 0,
          recordsFailed: 0,
          errorLog: null,
          cursor: null,
          pageInfo: null,
        }
      );

      // TODO: Trigger background job processing
      // This could use a queue like BullMQ, Inngest, or Vercel Edge Config

      return c.json({ data: { syncJob } });
    }
  )

  // List sync jobs
  .get(
    "/sync-jobs",
    sessionMiddleware,
    zValidator("query", getSyncJobsSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { workspaceId, tenantId, status, limit } = c.req.valid("query");

      // Verify membership
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const queries = [
        Query.equal("workspaceId", workspaceId),
        Query.orderDesc("$createdAt"),
        Query.limit(limit),
      ];

      if (tenantId) {
        queries.push(Query.equal("tenantId", tenantId));
      }

      if (status) {
        queries.push(Query.equal("status", status));
      }

      const syncJobs = await databases.listDocuments(
        DATABASE_ID,
        SHOPIFY_SYNC_JOBS_ID,
        queries
      );

      return c.json({ data: { syncJobs: syncJobs.documents } });
    }
  );

export default app;
