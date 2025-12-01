# Shopify Integration Guide for Supply Chain Guru

This document provides a comprehensive guide for implementing Shopify OAuth integration with your Supply Chain Guru application.

---

## Table of Contents
1. [Shopify Partner App Configuration](#1-shopify-partner-app-configuration)
2. [Database Schema Design for Appwrite](#2-database-schema-design-for-appwrite)
3. [OAuth Flow Architecture](#3-oauth-flow-architecture)
4. [Feature Module Structure](#4-feature-module-structure)
5. [Client Onboarding Experience](#5-client-onboarding-experience)

---

## 1. Shopify Partner App Configuration

### App Type Selection

For your use case (OAuth-based inventory analytics without embedding), use an **Unlisted Public App**:

| App Type | OAuth Support | Embedding Required | Distribution |
|----------|---------------|-------------------|--------------|
| **Custom App (Admin)** | No - manual token only | N/A | Single store |
| **Public App (Listed)** | Yes | Optional | App Store |
| **Public App (Unlisted)** | Yes | No | Direct install link |

**Recommendation**: Create an **Unlisted Public App** in the Partner Dashboard. This gives you:
- Full OAuth flow for seamless onboarding
- No embedding required (your analytics lives in Supply Chain Guru)
- No App Store listing or review process
- Direct install link to share with clients
- Support for unlimited merchants

### Required OAuth Scopes

For inventory analytics (products, inventory, orders, locations), request these scopes:

```
# Core Inventory & Analytics Scopes
read_products           # Product catalog data
read_inventory          # Inventory levels across locations
read_locations          # Warehouse/fulfillment locations
read_orders             # Order history and analytics
read_fulfillments       # Fulfillment status tracking

# Optional - Enhanced Analytics
read_analytics          # Store analytics (Public apps only)
read_reports            # Store reports access
read_shipping           # Shipping rates and carriers
read_product_listings   # Products published to sales channels
```

**Minimal Scope Set for MVP:**
```
read_products,read_inventory,read_locations,read_orders
```

### Redirect URLs Configuration

Configure these URLs in your Shopify Partner Dashboard:

#### Development Environment
```
# OAuth Callback URL
https://localhost:3000/api/shopify/callback

# App URL (embedded app frame)
https://localhost:3000/api/shopify/auth

# GDPR Mandatory Webhooks (required for public apps)
https://localhost:3000/api/shopify/webhooks/customer-data-request
https://localhost:3000/api/shopify/webhooks/customer-data-erasure
https://localhost:3000/api/shopify/webhooks/shop-data-erasure
```

#### Production Environment
```
# OAuth Callback URL
https://your-domain.com/api/shopify/callback

# App URL
https://your-domain.com/api/shopify/auth

# GDPR Webhooks
https://your-domain.com/api/shopify/webhooks/customer-data-request
https://your-domain.com/api/shopify/webhooks/customer-data-erasure
https://your-domain.com/api/shopify/webhooks/shop-data-erasure
```

### Partner Dashboard Setup Steps

1. **Create Partner Account** (if you don't have one)
   - Go to https://partners.shopify.com
   - Sign up (free)

2. **Create App in Partner Dashboard**
   - Navigate to **Apps** → **Create App**
   - Select **"Create app manually"**

3. **Configure App Settings**
   ```
   App name: Supply Chain Guru
   App URL: https://your-domain.com/api/shopify/auth
   Allowed redirection URL(s):
     - https://localhost:3000/api/shopify/callback
     - https://your-domain.com/api/shopify/callback
   ```

4. **Configure as Non-Embedded (Important!)**

   In your app settings or when initializing, ensure the app is NOT embedded:
   - In Partner Dashboard: App Setup → Embedded app → **Disable**
   - Or if using `@shopify/shopify-app-express`: set `embedded: false`

   Since you're building analytics in your own app, you don't need Shopify Admin embedding.

5. **Set Distribution to Unlisted**
   - Go to **Distribution** settings
   - Select **"Single-merchant install link"** or leave unlisted
   - This gives you a direct install URL like:
     ```
     https://admin.shopify.com/oauth/install?client_id=YOUR_API_KEY
     ```

6. **Get API Credentials**
   - Copy **API Key** (Client ID)
   - Copy **API Secret Key** (Client Secret)

7. **Environment Variables**
   Add to your `.env.local`:
   ```env
   # Shopify OAuth Configuration
   SHOPIFY_API_KEY=your_api_key_here
   SHOPIFY_API_SECRET=your_api_secret_here
   SHOPIFY_SCOPES=read_products,read_inventory,read_locations,read_orders
   SHOPIFY_API_VERSION=2024-01

   # For token encryption
   SHOPIFY_ENCRYPTION_KEY=32-byte-hex-string-for-aes-256
   ```

---

## 2. Database Schema Design for Appwrite

### Collection Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     APPWRITE COLLECTIONS                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────┐    ┌─────────────────┐                    │
│  │    tenants      │    │     users       │                    │
│  │  (Shopify Shops)│    │ (existing auth) │                    │
│  └────────┬────────┘    └────────┬────────┘                    │
│           │                      │                              │
│           │    workspaceId       │    userId                    │
│           ▼                      ▼                              │
│  ┌─────────────────────────────────────────┐                   │
│  │              sync_jobs                   │                   │
│  │     (Data synchronization tracking)      │                   │
│  └─────────────────────────────────────────┘                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Collection 1: `shopify_tenants`

Stores connected Shopify stores with encrypted credentials.

```typescript
// Environment variable to add:
// NEXT_PUBLIC_APPWRITE_SHOPIFY_TENANTS_ID=shopify-tenants-key

interface ShopifyTenant {
  // Document ID: Auto-generated by Appwrite
  $id: string;
  $createdAt: string;
  $updatedAt: string;

  // Relationships
  workspaceId: string;           // Links to your workspace
  userId: string;                // User who connected the store

  // Shop Identity
  shopDomain: string;            // mystore.myshopify.com
  shopId: string;                // Shopify's numeric shop ID
  shopName: string;              // Display name
  shopEmail: string;             // Shop owner email
  shopCurrency: string;          // USD, EUR, etc.
  shopTimezone: string;          // America/New_York

  // OAuth Credentials (encrypted)
  accessToken: string;           // Encrypted access token
  scopes: string;                // Granted scopes (comma-separated)

  // Status & Metadata
  status: 'active' | 'inactive' | 'error' | 'pending';
  installedAt: string;           // ISO timestamp
  lastSyncAt: string | null;     // Last successful sync
  syncEnabled: boolean;          // Auto-sync toggle
  errorMessage: string | null;   // Last error if status=error

  // Plan/Billing (optional for future)
  planName: string | null;       // Shopify plan name
  shopifyPlanDisplayName: string | null;
}
```

**Appwrite Attributes:**

| Attribute | Type | Size | Required | Default |
|-----------|------|------|----------|---------|
| workspaceId | string | 36 | Yes | - |
| userId | string | 36 | Yes | - |
| shopDomain | string | 255 | Yes | - |
| shopId | string | 50 | Yes | - |
| shopName | string | 255 | Yes | - |
| shopEmail | string | 255 | No | null |
| shopCurrency | string | 10 | No | 'USD' |
| shopTimezone | string | 100 | No | null |
| accessToken | string | 1000 | Yes | - |
| scopes | string | 1000 | Yes | - |
| status | enum | - | Yes | 'pending' |
| installedAt | datetime | - | Yes | - |
| lastSyncAt | datetime | - | No | null |
| syncEnabled | boolean | - | Yes | true |
| errorMessage | string | 2000 | No | null |
| planName | string | 100 | No | null |
| shopifyPlanDisplayName | string | 100 | No | null |

**Indexes:**

| Index Name | Type | Attributes | Order |
|------------|------|------------|-------|
| workspace_idx | key | workspaceId | ASC |
| user_idx | key | userId | ASC |
| shop_domain_idx | unique | shopDomain | ASC |
| status_idx | key | status | ASC |
| workspace_status_idx | key | workspaceId, status | ASC, ASC |

### Collection 2: `shopify_sync_jobs`

Tracks data synchronization jobs and history.

```typescript
// Environment variable:
// NEXT_PUBLIC_APPWRITE_SHOPIFY_SYNC_JOBS_ID=shopify-sync-jobs-key

interface ShopifySyncJob {
  $id: string;
  $createdAt: string;
  $updatedAt: string;

  // Relationships
  tenantId: string;              // Reference to shopify_tenants
  workspaceId: string;           // For workspace-scoped queries

  // Job Configuration
  jobType: 'products' | 'inventory' | 'orders' | 'locations' | 'full';
  triggerType: 'manual' | 'scheduled' | 'webhook';

  // Status Tracking
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;              // 0-100 percentage

  // Timing
  startedAt: string | null;
  completedAt: string | null;

  // Results
  recordsProcessed: number;
  recordsFailed: number;
  errorLog: string | null;       // JSON array of errors

  // Pagination State (for resumable syncs)
  cursor: string | null;         // Shopify pagination cursor
  pageInfo: string | null;       // JSON with hasNextPage, etc.
}
```

**Appwrite Attributes:**

| Attribute | Type | Size | Required | Default |
|-----------|------|------|----------|---------|
| tenantId | string | 36 | Yes | - |
| workspaceId | string | 36 | Yes | - |
| jobType | enum | - | Yes | - |
| triggerType | enum | - | Yes | 'manual' |
| status | enum | - | Yes | 'pending' |
| progress | integer | - | Yes | 0 |
| startedAt | datetime | - | No | null |
| completedAt | datetime | - | No | null |
| recordsProcessed | integer | - | Yes | 0 |
| recordsFailed | integer | - | Yes | 0 |
| errorLog | string | 10000 | No | null |
| cursor | string | 500 | No | null |
| pageInfo | string | 1000 | No | null |

**Indexes:**

| Index Name | Type | Attributes | Order |
|------------|------|------------|-------|
| tenant_idx | key | tenantId | ASC |
| workspace_idx | key | workspaceId | ASC |
| status_idx | key | status | ASC |
| tenant_status_idx | key | tenantId, status | ASC, ASC |
| created_idx | key | $createdAt | DESC |

### Collection 3: `shopify_oauth_states`

Temporary storage for OAuth state validation (CSRF protection).

```typescript
// Environment variable:
// NEXT_PUBLIC_APPWRITE_SHOPIFY_OAUTH_STATES_ID=shopify-oauth-states-key

interface ShopifyOAuthState {
  $id: string;                   // The state parameter itself
  $createdAt: string;

  workspaceId: string;
  userId: string;
  shopDomain: string;
  nonce: string;                 // Additional security nonce
  expiresAt: string;             // TTL for cleanup
}
```

**Appwrite Attributes:**

| Attribute | Type | Size | Required | Default |
|-----------|------|------|----------|---------|
| workspaceId | string | 36 | Yes | - |
| userId | string | 36 | Yes | - |
| shopDomain | string | 255 | Yes | - |
| nonce | string | 64 | Yes | - |
| expiresAt | datetime | - | Yes | - |

**Indexes:**

| Index Name | Type | Attributes | Order |
|------------|------|------------|-------|
| expires_idx | key | expiresAt | ASC |

### Environment Variables Summary

Add these to your `.env.local`:

```env
# Shopify Collection IDs
NEXT_PUBLIC_APPWRITE_SHOPIFY_TENANTS_ID=shopify-tenants-key
NEXT_PUBLIC_APPWRITE_SHOPIFY_SYNC_JOBS_ID=shopify-sync-jobs-key
NEXT_PUBLIC_APPWRITE_SHOPIFY_OAUTH_STATES_ID=shopify-oauth-states-key
```

Add to `src/config.ts`:

```typescript
export const SHOPIFY_TENANTS_ID = process.env.NEXT_PUBLIC_APPWRITE_SHOPIFY_TENANTS_ID!;
export const SHOPIFY_SYNC_JOBS_ID = process.env.NEXT_PUBLIC_APPWRITE_SHOPIFY_SYNC_JOBS_ID!;
export const SHOPIFY_OAUTH_STATES_ID = process.env.NEXT_PUBLIC_APPWRITE_SHOPIFY_OAUTH_STATES_ID!;
```

---

## 3. OAuth Flow Architecture

### Complete OAuth Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SHOPIFY OAUTH 2.0 FLOW                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────┐     ┌──────────────┐     ┌─────────────┐     ┌─────────────────┐
│  User    │     │  Next.js     │     │  Hono API   │     │    Shopify      │
│ Browser  │     │  Frontend    │     │  Backend    │     │    OAuth        │
└────┬─────┘     └──────┬───────┘     └──────┬──────┘     └────────┬────────┘
     │                  │                    │                     │
     │  1. Click "Connect Shopify"           │                     │
     │─────────────────>│                    │                     │
     │                  │                    │                     │
     │                  │  2. POST /api/shopify/auth/init          │
     │                  │      { shopDomain, workspaceId }         │
     │                  │───────────────────>│                     │
     │                  │                    │                     │
     │                  │                    │  3. Generate state  │
     │                  │                    │     Store in DB     │
     │                  │                    │     Build auth URL  │
     │                  │                    │                     │
     │                  │  4. Return { authUrl }                   │
     │                  │<───────────────────│                     │
     │                  │                    │                     │
     │  5. Redirect to Shopify               │                     │
     │<─────────────────│                    │                     │
     │                  │                    │                     │
     │  6. User authorizes app on Shopify    │                     │
     │─────────────────────────────────────────────────────────────>
     │                  │                    │                     │
     │  7. Redirect to callback with code & state                  │
     │<─────────────────────────────────────────────────────────────
     │                  │                    │                     │
     │  8. GET /api/shopify/callback?code=X&state=Y&shop=Z         │
     │─────────────────────────────────────>│                     │
     │                  │                    │                     │
     │                  │                    │  9. Validate state  │
     │                  │                    │     Verify HMAC     │
     │                  │                    │                     │
     │                  │                    │  10. Exchange code  │
     │                  │                    │      for token      │
     │                  │                    │────────────────────>│
     │                  │                    │                     │
     │                  │                    │  11. Return access  │
     │                  │                    │      token          │
     │                  │                    │<────────────────────│
     │                  │                    │                     │
     │                  │                    │  12. Fetch shop info│
     │                  │                    │────────────────────>│
     │                  │                    │                     │
     │                  │                    │  13. Shop details   │
     │                  │                    │<────────────────────│
     │                  │                    │                     │
     │                  │                    │  14. Encrypt token  │
     │                  │                    │      Save tenant    │
     │                  │                    │      to Appwrite    │
     │                  │                    │                     │
     │  15. Redirect to success page         │                     │
     │<─────────────────────────────────────│                     │
     │                  │                    │                     │
     │  16. Show connected store             │                     │
     │─────────────────>│                    │                     │
     │                  │  17. GET /api/shopify/tenants             │
     │                  │───────────────────>│                     │
     │                  │                    │                     │
     │                  │  18. Return tenant list                  │
     │                  │<───────────────────│                     │
     │                  │                    │                     │
     │  19. Display stores                   │                     │
     │<─────────────────│                    │                     │
```

### API Endpoint Mapping

Following your existing Hono pattern in `src/app/api/[[...route]]/route.ts`:

```typescript
// Add to main route.ts
import shopify from "@/features/shopify/server/route";

const routes = app
  .route("/auth", auth)
  .route("/shopify", shopify)  // <-- Add this
  // ... other routes
```

### Endpoint Structure

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/shopify/auth/init` | Start OAuth flow | sessionMiddleware |
| GET | `/api/shopify/callback` | OAuth callback | Public (validates state) |
| GET | `/api/shopify/tenants` | List connected stores | sessionMiddleware |
| GET | `/api/shopify/tenants/:id` | Get single store | sessionMiddleware |
| DELETE | `/api/shopify/tenants/:id` | Disconnect store | sessionMiddleware |
| POST | `/api/shopify/tenants/:id/sync` | Trigger sync job | sessionMiddleware |
| GET | `/api/shopify/sync-jobs` | List sync jobs | sessionMiddleware |
| POST | `/api/shopify/webhooks/*` | GDPR webhooks | HMAC validation |

### Security Considerations

```typescript
// HMAC Validation for Webhooks
import crypto from 'crypto';

function verifyShopifyWebhook(
  body: string,
  hmacHeader: string,
  secret: string
): boolean {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(body, 'utf8')
    .digest('base64');

  return crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(hmacHeader)
  );
}

// Token Encryption/Decryption
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

export function encryptToken(token: string, key: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    ALGORITHM,
    Buffer.from(key, 'hex'),
    iv
  );

  let encrypted = cipher.update(token, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  // Format: iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decryptToken(encrypted: string, key: string): string {
  const [ivHex, authTagHex, encryptedData] = encrypted.split(':');

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    Buffer.from(key, 'hex'),
    Buffer.from(ivHex, 'hex')
  );

  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

### Error Handling Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING STATES                        │
└─────────────────────────────────────────────────────────────────┘

OAuth Errors:
├── Invalid State → Redirect to /error?code=invalid_state
├── Access Denied → Redirect to /error?code=access_denied
├── Invalid Shop → Redirect to /error?code=invalid_shop
└── Token Exchange Failed → Redirect to /error?code=token_error

API Errors:
├── 401 Unauthorized → Token expired/invalid
├── 403 Forbidden → Insufficient scopes
├── 429 Rate Limited → Retry with backoff
└── 5xx Server Error → Retry or fail gracefully

Sync Errors:
├── Token Invalid → Update tenant status to 'error'
├── Shop Inactive → Update tenant status to 'inactive'
└── Partial Failure → Continue sync, log failed records
```

---

## 4. Feature Module Structure

Following your existing pattern, create this structure:

```
src/features/shopify/
├── server/
│   ├── route.ts              # Main Hono router for /api/shopify/*
│   └── webhooks.ts           # GDPR webhook handlers
├── api/
│   ├── use-init-oauth.ts     # Mutation: Start OAuth flow
│   ├── use-get-tenants.ts    # Query: List connected stores
│   ├── use-get-tenant.ts     # Query: Get single store
│   ├── use-disconnect-tenant.ts # Mutation: Remove store
│   ├── use-trigger-sync.ts   # Mutation: Start sync job
│   └── use-get-sync-jobs.ts  # Query: List sync jobs
├── components/
│   ├── connect-shop-card.tsx     # Card with connect button
│   ├── shop-connect-form.tsx     # Form to enter shop domain
│   ├── connected-shops-list.tsx  # List of connected stores
│   ├── shop-card.tsx             # Individual shop display
│   ├── sync-status-badge.tsx     # Sync status indicator
│   ├── sync-jobs-table.tsx       # Sync history table
│   └── disconnect-shop-modal.tsx # Confirmation modal
├── hooks/
│   ├── use-connect-shop-modal.ts # Modal state management
│   └── use-tenant-id.ts          # Extract tenant ID from URL
├── lib/
│   ├── shopify-client.ts     # Shopify API client wrapper
│   ├── encryption.ts         # Token encryption utilities
│   └── hmac.ts               # HMAC validation utilities
├── types.ts                  # TypeScript interfaces
├── schemas.ts                # Zod validation schemas
└── constants.ts              # Shopify-related constants
```

### File Contents

#### `src/features/shopify/constants.ts`

```typescript
export const SHOPIFY_API_VERSION = "2024-01";

export const SHOPIFY_SCOPES = [
  "read_products",
  "read_inventory",
  "read_locations",
  "read_orders",
] as const;

export const SHOPIFY_OAUTH_STATE_TTL = 10 * 60 * 1000; // 10 minutes

export const TENANT_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  ERROR: "error",
  PENDING: "pending",
} as const;

export const SYNC_JOB_STATUS = {
  PENDING: "pending",
  RUNNING: "running",
  COMPLETED: "completed",
  FAILED: "failed",
  CANCELLED: "cancelled",
} as const;

export const SYNC_JOB_TYPE = {
  PRODUCTS: "products",
  INVENTORY: "inventory",
  ORDERS: "orders",
  LOCATIONS: "locations",
  FULL: "full",
} as const;
```

#### `src/features/shopify/types.ts`

```typescript
import { Models } from "node-appwrite";

export type TenantStatus = "active" | "inactive" | "error" | "pending";
export type SyncJobStatus = "pending" | "running" | "completed" | "failed" | "cancelled";
export type SyncJobType = "products" | "inventory" | "orders" | "locations" | "full";
export type TriggerType = "manual" | "scheduled" | "webhook";

export type ShopifyTenant = Models.Document & {
  workspaceId: string;
  userId: string;
  shopDomain: string;
  shopId: string;
  shopName: string;
  shopEmail: string | null;
  shopCurrency: string;
  shopTimezone: string | null;
  accessToken: string;
  scopes: string;
  status: TenantStatus;
  installedAt: string;
  lastSyncAt: string | null;
  syncEnabled: boolean;
  errorMessage: string | null;
  planName: string | null;
  shopifyPlanDisplayName: string | null;
};

export type ShopifySyncJob = Models.Document & {
  tenantId: string;
  workspaceId: string;
  jobType: SyncJobType;
  triggerType: TriggerType;
  status: SyncJobStatus;
  progress: number;
  startedAt: string | null;
  completedAt: string | null;
  recordsProcessed: number;
  recordsFailed: number;
  errorLog: string | null;
  cursor: string | null;
  pageInfo: string | null;
};

export type ShopifyOAuthState = Models.Document & {
  workspaceId: string;
  userId: string;
  shopDomain: string;
  nonce: string;
  expiresAt: string;
};

// API Response Types
export interface ShopInfo {
  id: number;
  name: string;
  email: string;
  domain: string;
  myshopify_domain: string;
  currency: string;
  iana_timezone: string;
  plan_name: string;
  plan_display_name: string;
}
```

#### `src/features/shopify/schemas.ts`

```typescript
import { z } from "zod";

export const initOAuthSchema = z.object({
  shopDomain: z
    .string()
    .min(1, "Shop domain is required")
    .transform((val) => {
      // Normalize shop domain
      let domain = val.toLowerCase().trim();
      // Remove protocol if present
      domain = domain.replace(/^https?:\/\//, "");
      // Remove trailing slash
      domain = domain.replace(/\/$/, "");
      // Add .myshopify.com if not present
      if (!domain.includes(".myshopify.com")) {
        domain = `${domain}.myshopify.com`;
      }
      return domain;
    }),
  workspaceId: z.string().min(1, "Workspace ID is required"),
});

export const callbackQuerySchema = z.object({
  code: z.string().min(1),
  shop: z.string().min(1),
  state: z.string().min(1),
  hmac: z.string().min(1),
  timestamp: z.string().optional(),
});

export const getTenantSchema = z.object({
  workspaceId: z.string().min(1),
});

export const triggerSyncSchema = z.object({
  jobType: z.enum(["products", "inventory", "orders", "locations", "full"]),
});

export const getSyncJobsSchema = z.object({
  workspaceId: z.string().min(1),
  tenantId: z.string().optional(),
  status: z.enum(["pending", "running", "completed", "failed", "cancelled"]).optional(),
  limit: z.coerce.number().min(1).max(100).default(20),
});
```

#### `src/features/shopify/server/route.ts`

```typescript
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
import { encryptToken, decryptToken } from "../lib/encryption";
import { verifyHmac } from "../lib/hmac";
import { createShopifyClient, fetchShopInfo } from "../lib/shopify-client";
import { SHOPIFY_SCOPES, SHOPIFY_API_VERSION, SHOPIFY_OAUTH_STATE_TTL } from "../constants";

const app = new Hono()
  // Initialize OAuth flow
  .post(
    "/auth/init",
    sessionMiddleware,
    zValidator("json", initOAuthSchema),
    async (c) => {
      const user = c.get("user");
      const databases = c.get("databases");
      const { shopDomain, workspaceId } = c.req.valid("json");

      // Verify user is member of workspace
      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member) {
        return c.json({ error: "Unauthorized" }, 401);
      }

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
        return c.json({ error: "Shop is already connected to this workspace" }, 400);
      }

      // Generate state and nonce for CSRF protection
      const state = crypto.randomBytes(32).toString("hex");
      const nonce = crypto.randomBytes(16).toString("hex");

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

      // Build authorization URL
      const scopes = SHOPIFY_SCOPES.join(",");
      const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/api/shopify/callback`;

      const authUrl = new URL(`https://${shopDomain}/admin/oauth/authorize`);
      authUrl.searchParams.set("client_id", process.env.SHOPIFY_API_KEY!);
      authUrl.searchParams.set("scope", scopes);
      authUrl.searchParams.set("redirect_uri", redirectUri);
      authUrl.searchParams.set("state", state);

      return c.json({ data: { authUrl: authUrl.toString() } });
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
```

#### `src/features/shopify/lib/encryption.ts`

```typescript
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;

export function encryptToken(token: string, keyHex: string): string {
  const key = Buffer.from(keyHex, "hex");
  const iv = crypto.randomBytes(IV_LENGTH);

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag();

  // Format: iv:authTag:encrypted
  return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
}

export function decryptToken(encryptedData: string, keyHex: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedData.split(":");

  const key = Buffer.from(keyHex, "hex");
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
```

#### `src/features/shopify/lib/hmac.ts`

```typescript
import crypto from "crypto";

export function verifyHmac(
  queryParams: Record<string, string>,
  secret: string
): boolean {
  const { hmac, ...params } = queryParams;

  if (!hmac) return false;

  // Sort parameters alphabetically and create query string
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  const calculatedHmac = crypto
    .createHmac("sha256", secret)
    .update(sortedParams)
    .digest("hex");

  // Use timing-safe comparison
  try {
    return crypto.timingSafeEqual(
      Buffer.from(hmac),
      Buffer.from(calculatedHmac)
    );
  } catch {
    return false;
  }
}

export function verifyWebhookHmac(
  body: string,
  hmacHeader: string,
  secret: string
): boolean {
  const calculatedHmac = crypto
    .createHmac("sha256", secret)
    .update(body, "utf8")
    .digest("base64");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(hmacHeader),
      Buffer.from(calculatedHmac)
    );
  } catch {
    return false;
  }
}
```

#### `src/features/shopify/lib/shopify-client.ts`

```typescript
import { SHOPIFY_API_VERSION } from "../constants";
import type { ShopInfo } from "../types";

export function createShopifyClient(shopDomain: string, accessToken: string) {
  const baseUrl = `https://${shopDomain}/admin/api/${SHOPIFY_API_VERSION}`;

  async function request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`);
    }

    return response.json();
  }

  return {
    request,

    async getShop(): Promise<{ shop: ShopInfo }> {
      return request("/shop.json");
    },

    async getProducts(params?: { limit?: number; cursor?: string }) {
      const searchParams = new URLSearchParams();
      if (params?.limit) searchParams.set("limit", String(params.limit));
      if (params?.cursor) searchParams.set("page_info", params.cursor);

      return request(`/products.json?${searchParams}`);
    },

    async getInventoryLevels(locationIds: string[]) {
      const ids = locationIds.join(",");
      return request(`/inventory_levels.json?location_ids=${ids}`);
    },

    async getLocations() {
      return request("/locations.json");
    },

    async getOrders(params?: {
      status?: string;
      limit?: number;
      cursor?: string
    }) {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.set("status", params.status);
      if (params?.limit) searchParams.set("limit", String(params.limit));
      if (params?.cursor) searchParams.set("page_info", params.cursor);

      return request(`/orders.json?${searchParams}`);
    },
  };
}

export async function fetchShopInfo(
  shopDomain: string,
  accessToken: string
): Promise<ShopInfo | null> {
  try {
    const client = createShopifyClient(shopDomain, accessToken);
    const { shop } = await client.getShop();
    return shop;
  } catch (error) {
    console.error("Failed to fetch shop info:", error);
    return null;
  }
}
```

#### `src/features/shopify/api/use-init-oauth.ts`

```typescript
import { useMutation } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<typeof client.api.shopify.auth.init["$post"]>;
type RequestType = InferRequestType<typeof client.api.shopify.auth.init["$post"]>;

export const useInitOAuth = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.shopify.auth.init["$post"]({ json });

      if (!response.ok) {
        throw new Error("Failed to initialize OAuth");
      }

      return await response.json();
    },
    onSuccess: (data) => {
      // Redirect to Shopify authorization
      if (data.data?.authUrl) {
        window.location.href = data.data.authUrl;
      }
    },
  });

  return mutation;
};
```

#### `src/features/shopify/api/use-get-tenants.ts`

```typescript
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

interface UseGetTenantsProps {
  workspaceId: string;
}

export const useGetTenants = ({ workspaceId }: UseGetTenantsProps) => {
  const query = useQuery({
    queryKey: ["shopify-tenants", workspaceId],
    queryFn: async () => {
      const response = await client.api.shopify.tenants.$get({
        query: { workspaceId },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch tenants");
      }

      const { data } = await response.json();
      return data;
    },
    enabled: !!workspaceId,
  });

  return query;
};
```

#### `src/features/shopify/api/use-disconnect-tenant.ts`

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

interface UseDisconnectTenantProps {
  workspaceId: string;
}

export const useDisconnectTenant = ({ workspaceId }: UseDisconnectTenantProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (tenantId: string) => {
      const response = await client.api.shopify.tenants[":tenantId"]["$delete"]({
        param: { tenantId },
      });

      if (!response.ok) {
        throw new Error("Failed to disconnect store");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Store disconnected successfully");
      queryClient.invalidateQueries({ queryKey: ["shopify-tenants", workspaceId] });
    },
    onError: () => {
      toast.error("Failed to disconnect store");
    },
  });

  return mutation;
};
```

#### `src/features/shopify/api/use-trigger-sync.ts`

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType } from "hono";
import { toast } from "sonner";

import { client } from "@/lib/rpc";
import type { SyncJobType } from "../types";

interface UseTriggerSyncProps {
  workspaceId: string;
}

export const useTriggerSync = ({ workspaceId }: UseTriggerSyncProps) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ tenantId, jobType }: { tenantId: string; jobType: SyncJobType }) => {
      const response = await client.api.shopify.tenants[":tenantId"].sync["$post"]({
        param: { tenantId },
        json: { jobType },
      });

      if (!response.ok) {
        throw new Error("Failed to trigger sync");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast.success("Sync job started");
      queryClient.invalidateQueries({ queryKey: ["shopify-sync-jobs", workspaceId] });
    },
    onError: () => {
      toast.error("Failed to start sync");
    },
  });

  return mutation;
};
```

#### `src/features/shopify/api/use-get-sync-jobs.ts`

```typescript
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";
import type { SyncJobStatus } from "../types";

interface UseGetSyncJobsProps {
  workspaceId: string;
  tenantId?: string;
  status?: SyncJobStatus;
  limit?: number;
}

export const useGetSyncJobs = ({
  workspaceId,
  tenantId,
  status,
  limit = 20
}: UseGetSyncJobsProps) => {
  const query = useQuery({
    queryKey: ["shopify-sync-jobs", workspaceId, tenantId, status],
    queryFn: async () => {
      const response = await client.api.shopify["sync-jobs"].$get({
        query: {
          workspaceId,
          tenantId,
          status,
          limit: String(limit),
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch sync jobs");
      }

      const { data } = await response.json();
      return data;
    },
    enabled: !!workspaceId,
    refetchInterval: 5000, // Poll every 5 seconds for running jobs
  });

  return query;
};
```

---

## Next Steps

After setting up this foundation:

1. **Create Appwrite Collections**
   - Use the Appwrite Console to create the three collections
   - Add all attributes and indexes as specified

2. **Generate Encryption Key**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Configure Shopify Partner Dashboard**
   - Create app and get API credentials
   - Set redirect URLs

4. **Add Environment Variables**
   - Add all Shopify-related env vars to `.env.local`

5. **Register Routes**
   - Add `shopify` route to main API router

6. **Build UI Components**
   - Create the React components for connecting stores

7. **Implement Background Sync**
   - Set up job queue for data synchronization

---

## 5. Client Onboarding Experience

### How Your Clients Connect Their Shopify Store

The OAuth flow provides a seamless experience for your clients:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     CLIENT ONBOARDING JOURNEY                               │
└─────────────────────────────────────────────────────────────────────────────┘

Step 1: Client logs into Supply Chain Guru
        ↓
Step 2: Navigates to Integrations → Shopify
        ↓
Step 3: Enters their store domain (e.g., "mystore" or "mystore.myshopify.com")
        ↓
Step 4: Clicks "Connect Store"
        ↓
Step 5: Redirected to Shopify login (if not logged in)
        ↓
Step 6: Sees permission request screen:
        ┌─────────────────────────────────────────┐
        │  Supply Chain Guru wants to access:     │
        │                                         │
        │  ✓ View products                        │
        │  ✓ View inventory                       │
        │  ✓ View orders                          │
        │  ✓ View locations                       │
        │                                         │
        │  [Install app]    [Cancel]              │
        └─────────────────────────────────────────┘
        ↓
Step 7: Clicks "Install app"
        ↓
Step 8: Redirected back to Supply Chain Guru
        ↓
Step 9: Store appears in connected stores list
        ↓
Step 10: Data sync begins automatically

Total time: ~30 seconds
```

### Alternative: Direct Install Link

You can also share a direct install link with clients:

```
https://admin.shopify.com/oauth/install?client_id=YOUR_API_KEY
```

When clients click this link:
1. They're prompted to log into Shopify (if needed)
2. They select which store to connect
3. They authorize the permissions
4. They're redirected to your callback URL

### UI Components for Onboarding

#### Connect Shop Form Component

```tsx
// src/features/shopify/components/connect-shop-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useInitOAuth } from "../api/use-init-oauth";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

const formSchema = z.object({
  shopDomain: z
    .string()
    .min(1, "Shop domain is required")
    .regex(
      /^[a-zA-Z0-9][a-zA-Z0-9-]*$/,
      "Enter your shop name (e.g., 'mystore' or 'mystore.myshopify.com')"
    ),
});

export const ConnectShopForm = () => {
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useInitOAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shopDomain: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate({
      json: {
        shopDomain: values.shopDomain,
        workspaceId,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Shopify Store</CardTitle>
        <CardDescription>
          Enter your Shopify store domain to connect and start syncing data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="shopDomain"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Domain</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input
                        {...field}
                        placeholder="mystore"
                        disabled={isPending}
                        className="rounded-r-none"
                      />
                      <span className="bg-muted px-3 py-2 border border-l-0 rounded-r-md text-muted-foreground">
                        .myshopify.com
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Connecting..." : "Connect Store"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
```

#### Connected Stores List Component

```tsx
// src/features/shopify/components/connected-shops-list.tsx
"use client";

import { Store, RefreshCw, Trash2, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetTenants } from "../api/use-get-tenants";
import { useDisconnectTenant } from "../api/use-disconnect-tenant";
import { useTriggerSync } from "../api/use-trigger-sync";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import type { ShopifyTenant } from "../types";

const statusColors = {
  active: "bg-green-500",
  inactive: "bg-gray-500",
  error: "bg-red-500",
  pending: "bg-yellow-500",
};

export const ConnectedShopsList = () => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetTenants({ workspaceId });
  const { mutate: disconnect, isPending: isDisconnecting } = useDisconnectTenant({ workspaceId });
  const { mutate: triggerSync, isPending: isSyncing } = useTriggerSync({ workspaceId });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  const tenants = data?.tenants || [];

  if (tenants.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Store className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No stores connected yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tenants.map((tenant: ShopifyTenant) => (
        <Card key={tenant.$id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              {tenant.shopName}
            </CardTitle>
            <Badge variant="outline" className="flex items-center gap-1">
              <span className={`h-2 w-2 rounded-full ${statusColors[tenant.status]}`} />
              {tenant.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{tenant.shopDomain}</p>
                <p className="text-xs text-muted-foreground">
                  Last synced: {tenant.lastSyncAt
                    ? new Date(tenant.lastSyncAt).toLocaleString()
                    : "Never"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => triggerSync({ tenantId: tenant.$id, jobType: "full" })}
                  disabled={isSyncing}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Sync
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a
                    href={`https://${tenant.shopDomain}/admin`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Admin
                  </a>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => disconnect(tenant.$id)}
                  disabled={isDisconnecting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
```

#### Integrations Page

```tsx
// src/app/(dashboard)/workspaces/[workspaceId]/integrations/shopify/page.tsx
import { ConnectShopForm } from "@/features/shopify/components/connect-shop-form";
import { ConnectedShopsList } from "@/features/shopify/components/connected-shops-list";

export default function ShopifyIntegrationPage() {
  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Shopify Integration</h1>
        <p className="text-muted-foreground">
          Connect your Shopify stores to sync inventory and order data
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <ConnectShopForm />
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Connected Stores</h2>
          <ConnectedShopsList />
        </div>
      </div>
    </div>
  );
}
```

### Error Handling Pages

Create an error page to handle OAuth failures:

```tsx
// src/app/error/page.tsx
import { AlertCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const errorMessages: Record<string, string> = {
  invalid_state: "The authorization request expired or was tampered with. Please try again.",
  state_expired: "The authorization session expired. Please try connecting again.",
  shop_mismatch: "The shop domain doesn't match the original request.",
  invalid_hmac: "The response from Shopify couldn't be verified.",
  token_exchange_failed: "Failed to complete authorization with Shopify.",
  shop_info_failed: "Connected successfully but couldn't fetch store details.",
  access_denied: "You cancelled the authorization or access was denied.",
  default: "An unexpected error occurred. Please try again.",
};

export default function ErrorPage({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  const errorCode = searchParams.code || "default";
  const errorMessage = errorMessages[errorCode] || errorMessages.default;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Connection Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{errorMessage}</p>
          <Button asChild className="w-full">
            <Link href="/">Return to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## Testing Checklist

- [ ] OAuth flow completes successfully
- [ ] State parameter prevents CSRF attacks
- [ ] HMAC validation works correctly
- [ ] Token encryption/decryption works
- [ ] Shop info is fetched and stored
- [ ] Multiple stores can be connected to same workspace
- [ ] Store disconnection works
- [ ] Sync jobs can be triggered
- [ ] Error states are handled gracefully
- [ ] Client sees clear permission request on Shopify
- [ ] Redirect back to app works correctly
- [ ] Success message shows after connection
