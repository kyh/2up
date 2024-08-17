"use client";

import { updateAccountNameInput } from "@init/api/account/personal-account-schema";
import { Button } from "@init/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@init/ui/form";
import { Input } from "@init/ui/input";
import { toast } from "@init/ui/toast";

import type { RouterOutputs } from "@init/api";
import type { UpdateAccountNameInput } from "@init/api/account/personal-account-schema";
import { api } from "@/trpc/react";

export const ProfileForm = ({
  account,
}: {
  account: RouterOutputs["account"]["userWorkspace"]["account"];
}) => {
  const updateAccountName = api.account.updateAccountName.useMutation();
  const form = useForm({
    schema: updateAccountNameInput,
    defaultValues: {
      name: account.name ?? "",
    },
  });

  const onSubmit = (data: UpdateAccountNameInput) => {
    const promise = updateAccountName.mutateAsync(data);
    toast.promise(promise, {
      loading: "Updating profile...",
      success: "Profile successfully updated",
      error: "Could not update profile. Please try again.",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="col-span-full flex items-center gap-x-8">
          <img
            src={account.pictureUrl ?? ""}
            alt=""
            className="h-24 w-24 flex-none rounded-lg bg-background object-cover"
          />
          <div>
            <Button variant="secondary">Change avatar</Button>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              JPG, GIF or PNG. 1MB max.
            </p>
          </div>
        </div>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your name" {...field} />
              </FormControl>
              <FormDescription>
                This is the name that will be displayed on your profile and in
                emails.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input placeholder="Email" disabled />
          </FormControl>
        </FormItem>
        <footer className="flex justify-end">
          <Button type="submit">Update Profile</Button>
        </footer>
      </form>
    </Form>
  );
};
