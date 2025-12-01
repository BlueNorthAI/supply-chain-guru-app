import { AlertCircle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const errorMessages: Record<string, string> = {
  invalid_state: "The authorization request expired or was tampered with. Please try again.",
  state_expired: "The authorization session expired. Please try connecting again.",
  shop_mismatch: "The shop domain doesn't match the original request.",
  invalid_hmac: "The response from Shopify couldn't be verified.",
  token_exchange_failed: "Failed to complete authorization with Shopify.",
  shop_info_failed: "Connected successfully but couldn't fetch store details.",
  access_denied: "You cancelled the authorization or access was denied.",
  default: "An unexpected error occurred. Please try again.",
};

export default function ErrorPage({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  const errorCode = searchParams.code || "default";
  const errorMessage = errorMessages[errorCode] || errorMessages.default;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Connection Failed
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{errorMessage}</p>
          <Button asChild className="w-full">
            <Link href="/">Return to Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
