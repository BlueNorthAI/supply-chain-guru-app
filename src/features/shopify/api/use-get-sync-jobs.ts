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
  limit = 20,
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
