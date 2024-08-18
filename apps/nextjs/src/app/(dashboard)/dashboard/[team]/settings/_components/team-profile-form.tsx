"use client";

import { useRouter } from "next/navigation";
import { updateTeamAccountNameInput } from "@init/api/account/team-account-schema";
import { Button } from "@init/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@init/ui/form";
import { Input } from "@init/ui/input";
import { toast } from "@init/ui/toast";

import type { RouterOutputs } from "@init/api";
import type { UpdateTeamAccountNameInput } from "@init/api/account/team-account-schema";
import { api } from "@/trpc/react";

export const TeamProfileForm = ({
  account,
}: {
  account: NonNullable<RouterOutputs["account"]["teamWorkspace"]["account"]>;
}) => {
  const router = useRouter();
  const updateTeamAccountName = api.account.updateTeamAccountName.useMutation({
    onSuccess: (data) => {
      router.replace(`/dashboard/${data.slug}/settings`);
    },
  });
  const form = useForm({
    schema: updateTeamAccountNameInput,
    defaultValues: {
      name: account.name ?? "",
    },
  });

  const onSubmit = (data: UpdateTeamAccountNameInput) => {
    const promise = updateTeamAccountName.mutateAsync({
      slug: account.slug,
      name: data.name,
    });
    toast.promise(promise, {
      loading: "Updating Team name...",
      success: "Team name successfully updated",
      error: "Could not update Team name. Please try again.",
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
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input required {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <footer className="flex justify-end">
          <Button type="submit" loading={updateTeamAccountName.isPending}>
            Update Team
          </Button>
        </footer>
      </form>
    </Form>
  );
};
