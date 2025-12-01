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
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to initialize OAuth");
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
