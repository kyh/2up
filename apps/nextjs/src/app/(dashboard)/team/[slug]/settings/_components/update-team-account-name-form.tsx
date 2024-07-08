"use client";

import { useRouter } from "next/navigation";
import { updateTeamAccountNameInput } from "@init/api/team/team-schema";
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

import { api } from "@/trpc/react";

export const UpdateTeamAccountNameForm = (props: {
  account: {
    name: string;
    slug: string;
  };
}) => {
  const router = useRouter();
  const updateTeamAccountName = api.team.updateTeamAccountName.useMutation();
  const form = useForm({
    schema: updateTeamAccountNameInput.omit({ slug: true }),
    defaultValues: {
      name: props.account.name,
    },
  });

  return (
    <div className="space-y-8">
      <Form {...form}>
        <form
          className="flex flex-col space-y-4"
          onSubmit={form.handleSubmit((data) => {
            const promise = updateTeamAccountName
              .mutateAsync({
                slug: props.account.slug,
                name: data.name,
              })
              .then((data) => {
                router.replace(`/team/${data.slug}/settings`);
              });
            toast.promise(promise, {
              loading: "Updating Team name...",
              success: "Team name successfully updated",
              error: "Could not update Team name. Please try again.",
            });
          })}
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
