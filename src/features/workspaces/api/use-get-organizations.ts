import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

export const useGetOrganizations = (workspaceId: string) => {
  const query = useQuery({
    queryKey: ["organizations", workspaceId],
    queryFn: async () => {
      const response = await client.api.organizations.$get({
        query: { workspaceId }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch organizations");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
