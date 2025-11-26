"use client";

import { z } from "zod";
// import { useRef } from "react";
// import Image from "next/image";
// import { ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DottedSeparator } from "@/components/dotted-separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { createWorkspaceSchema } from "../schemas";
import { useCreateWorkspace } from "../api/use-create-workspace";
import { Select, SelectValue, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
// import { useGetAccounts } from "@/features/accounts/api/use-get-accounts";
interface CreateWorkspaceFormProps {
  onCancel?: () => void;
};

export const CreateWorkspaceForm = ({ onCancel }: CreateWorkspaceFormProps) => {
  const router = useRouter();
  const { mutate } = useCreateWorkspace();
  // const {
  //   data: accounts,
  // } = useGetAccounts({ workspaceId });
  // console.log(accounts, "data-accounts-UI");
  // <Select
  //   value={accountId}
  //   onValueChange={onChange}
  // // disabled={isLoadingAccounts}
  // // disabled={isLoadingAccounts || isLoadingSummary}
  // >
  //   <SelectTrigger
  //     className="lg:w-auto w-full h-9 rounded-md px-3 font-normal bg-blue-600 hover:bg-blue-700 border focus:ring-offset-0 focus:ring-transparent outline-none text-white focus:bg-blue-500 transition"
  //   >
  //     <SelectValue placeholder="Select account" />
  //   </SelectTrigger>
  //   <SelectContent>
  //     <SelectItem value="all">
  //       All accounts
  //     </SelectItem>
  //     {accounts?.documents?.map((account: { id: string; name: string }) => (
  //       <SelectItem key={account.id} value={account.id}>
  //         {account.name}
  //       </SelectItem>
  //     ))}
  //   </SelectContent>
  // </Select>
  // const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<z.infer<typeof createWorkspaceSchema>>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: "",
      orgId: "",
      businessUnitId: "",
      facilityId: "",
    },
  });

  const onSubmit = (values: z.infer<typeof createWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
      orgId: values.orgId,
      businessUnitId: values.businessUnitId,
      facilityId: values.facilityId,
    };

    mutate({ form: finalValues }, {
      onSuccess: ({ data }) => {
        form.reset();
        router.push(`/workspaces/${data.$id}`);
      }
    });
  };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     form.setValue("image", file);
  //   }
  // };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new workspace
        </CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Workspace Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter workspace name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="orgId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Organization
                    </FormLabel>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select organization" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RETL-01">RETL-01</SelectItem>
                          <SelectItem value="RETL-02">RETL-02</SelectItem>
                          <SelectItem value="RETL-03">RETL-03</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="businessUnitId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Business Unit
                    </FormLabel>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RETL-BU-1">RETL-BU-1</SelectItem>
                          <SelectItem value="RETL-BU-2">RETL-BU-2</SelectItem>
                          <SelectItem value="RETL-BU-3">RETL-BU-3</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="facilityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Facility
                    </FormLabel>
                    <FormControl>
                      <Select {...field} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select facility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="RETL-FAC-1">RETL-FAC-1</SelectItem>
                          <SelectItem value="RETL-FAC-2">RETL-FAC-2</SelectItem>
                          <SelectItem value="RETL-FAC-3">RETL-FAC-3</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DottedSeparator className="py-7" />
            <div className="flex items-center justify-between">
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={onCancel}
                className={cn(!onCancel && "invisible")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
              >
                Create Workspace
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};