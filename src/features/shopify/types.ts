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
