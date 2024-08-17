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
  useForm,
} from "@init/ui/form";
import { Input } from "@init/ui/input";
import { toast } from "@init/ui/toast";

import type { RouterOutputs } from "@init/api";
import type { UpdateTeamAccountNameInput } from "@init/api/account/team-account-schema";
import { api } from "@/trpc/react";

export const UpdateTeamAccountNameForm = ({
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
      name: account.name,
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
    <div className="space-y-8">
      <Form {...form}>
        <form
          className="flex flex-col space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            name="name"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input required placeholder="" {...field} />
                  </FormControl>
                </FormItem>
              );
            }}
          />
          <div>
            <Button
              className="w-full md:w-auto"
              disabled={updateTeamAccountName.isPending}
            >
              Update Team
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
