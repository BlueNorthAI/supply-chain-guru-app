"use client";

import { Store, RefreshCw, Trash2, ExternalLink } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetTenants } from "../api/use-get-tenants";
import { useDisconnectTenant } from "../api/use-disconnect-tenant";
import { useTriggerSync } from "../api/use-trigger-sync";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import type { ShopifyTenant } from "../types";

const statusColors = {
  active: "bg-green-500",
  inactive: "bg-gray-500",
  error: "bg-red-500",
  pending: "bg-yellow-500",
};

export const ConnectedShopsList = () => {
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useGetTenants({ workspaceId });
  const { mutate: disconnect, isPending: isDisconnecting } = useDisconnectTenant({ workspaceId });
  const { mutate: triggerSync, isPending: isSyncing } = useTriggerSync({ workspaceId });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  const tenants = data?.tenants || [];

  if (tenants.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Store className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No stores connected yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {tenants.map((tenant: ShopifyTenant) => (
        <Card key={tenant.$id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-medium">
              {tenant.shopName}
            </CardTitle>
            <Badge variant="outline" className="flex items-center gap-1">
              <span className={`h-2 w-2 rounded-full ${statusColors[tenant.status]}`} />
              {tenant.status}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{tenant.shopDomain}</p>
                <p className="text-xs text-muted-foreground">
                  Last synced: {tenant.lastSyncAt
                    ? new Date(tenant.lastSyncAt).toLocaleString()
                    : "Never"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => triggerSync({ tenantId: tenant.$id, jobType: "full" })}
                  disabled={isSyncing}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Sync
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                >
                  <a
                    href={`https://${tenant.shopDomain}/admin`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Admin
                  </a>
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => disconnect(tenant.$id)}
                  disabled={isDisconnecting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
