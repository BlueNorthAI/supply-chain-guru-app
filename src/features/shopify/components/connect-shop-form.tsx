"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useInitOAuth } from "../api/use-init-oauth";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

const formSchema = z.object({
  shopDomain: z
    .string()
    .min(1, "Shop domain is required")
    .regex(
      /^[a-zA-Z0-9][a-zA-Z0-9-]*$/,
      "Enter your shop name (e.g., 'mystore' or 'mystore.myshopify.com')"
    ),
});

export const ConnectShopForm = () => {
  const workspaceId = useWorkspaceId();
  const { mutate, isPending } = useInitOAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shopDomain: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(
      {
        json: {
          shopDomain: values.shopDomain,
          workspaceId,
        },
      },
      {
        onError: (error) => {
          toast.error(error.message || "Failed to connect store");
        },
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connect Shopify Store</CardTitle>
        <CardDescription>
          Enter your Shopify store domain to connect and start syncing data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="shopDomain"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Store Domain</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      <Input
                        {...field}
                        placeholder="mystore"
                        disabled={isPending}
                        className="rounded-r-none"
                      />
                      <span className="bg-muted px-3 py-2 border border-l-0 rounded-r-md text-muted-foreground">
                        .myshopify.com
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Connecting..." : "Connect Store"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
