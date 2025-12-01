import { ConnectShopForm } from "@/features/shopify/components/connect-shop-form";
import { ConnectedShopsList } from "@/features/shopify/components/connected-shops-list";

export default function ShopifyIntegrationPage() {
  return (
    <div className="container py-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Shopify Integration</h1>
        <p className="text-muted-foreground">
          Connect your Shopify stores to sync inventory and order data
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <ConnectShopForm />
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Connected Stores</h2>
          <ConnectedShopsList />
        </div>
      </div>
    </div>
  );
}
