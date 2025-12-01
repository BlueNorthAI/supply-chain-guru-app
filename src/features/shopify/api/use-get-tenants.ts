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
