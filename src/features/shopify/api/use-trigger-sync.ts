import { useMutation, useQueryClient } from "@tanstack/react-query";
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
