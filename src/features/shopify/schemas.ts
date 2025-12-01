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
