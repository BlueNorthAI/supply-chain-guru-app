// import { InferResponseType } from "hono";
// import { useQuery } from "@tanstack/react-query";

// import { client } from "@/lib/rpc";

// interface UseGetWorkspaceReceivingProps {
//   workspaceId: string;
// }

// export type WorkspaceReceivingResponseType = InferResponseType<typeof client.api.workspaces[":workspaceId"]

// export const useGetWorkspaceReceiving = ({
//   workspaceId,
// }: UseGetWorkspaceReceivingProps) => {
//   const query = useQuery({
//     queryKey: ["workspace-receiving", workspaceId],
//     queryFn: async () => {
//       const response = await client.api.workspaces[":workspaceId"].$get({
//         param: { workspaceId },
//       });

//       if (!response.ok) {
//         throw new Error("Failed to fetch workspace receiving");
//       }

//       const { data } = await response.json();

//       return data;
//     },
//   });

//   return query;
// };
