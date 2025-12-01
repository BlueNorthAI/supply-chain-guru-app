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
