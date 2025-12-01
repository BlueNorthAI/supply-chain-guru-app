import { SHOPIFY_API_VERSION } from "../constants";
import type { ShopInfo } from "../types";

export function createShopifyClient(shopDomain: string, accessToken: string) {
  const baseUrl = `https://${shopDomain}/admin/api/${SHOPIFY_API_VERSION}`;

  async function request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`);
    }

    return response.json();
  }

  return {
    request,

    async getShop(): Promise<{ shop: ShopInfo }> {
      return request("/shop.json");
    },

    async getProducts(params?: { limit?: number; cursor?: string }) {
      const searchParams = new URLSearchParams();
      if (params?.limit) searchParams.set("limit", String(params.limit));
      if (params?.cursor) searchParams.set("page_info", params.cursor);

      return request(`/products.json?${searchParams}`);
    },

    async getInventoryLevels(locationIds: string[]) {
      const ids = locationIds.join(",");
      return request(`/inventory_levels.json?location_ids=${ids}`);
    },

    async getLocations() {
      return request("/locations.json");
    },

    async getOrders(params?: {
      status?: string;
      limit?: number;
      cursor?: string;
    }) {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.set("status", params.status);
      if (params?.limit) searchParams.set("limit", String(params.limit));
      if (params?.cursor) searchParams.set("page_info", params.cursor);

      return request(`/orders.json?${searchParams}`);
    },
  };
}

export async function fetchShopInfo(
  shopDomain: string,
  accessToken: string
): Promise<ShopInfo | null> {
  try {
    const client = createShopifyClient(shopDomain, accessToken);
    const { shop } = await client.getShop();
    return shop;
  } catch (error) {
    console.error("Failed to fetch shop info:", error);
    return null;
  }
}
