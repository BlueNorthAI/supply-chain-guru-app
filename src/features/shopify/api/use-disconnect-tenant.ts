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
