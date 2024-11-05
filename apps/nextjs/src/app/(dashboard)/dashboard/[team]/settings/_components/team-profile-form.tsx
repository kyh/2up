"use client";

import { useRouter } from "next/navigation";
import { updateTeamInput } from "@init/api/team/team-schema";
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
import type { UpdateTeamInput } from "@init/api/team/team-schema";
import { api } from "@/trpc/react";

type TeamProfileFormProps = {
  team: NonNullable<RouterOutputs["team"]["getTeam"]["team"]>;
};

export const TeamProfileForm = ({ team }: TeamProfileFormProps) => {
  const router = useRouter();

  const updateTeam = api.team.updateTeam.useMutation({
    onSuccess: ({ team }) => {
      if (!team) return;
      router.replace(`/dashboard/${team.slug}/settings`);
    },
  });

  const form = useForm({
    schema: updateTeamInput,
    defaultValues: {
      id: team.id,
      name: team.name,
      slug: team.slug,
    },
  });

  const onSubmit = (data: UpdateTeamInput) => {
    const promise = updateTeam.mutateAsync(data);
    toast.promise(promise, {
      loading: "Updating team...",
      success: "Team successfully updated",
      error: "Could not update team. Please try again.",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team URL</FormLabel>
              <FormControl>
                <div className="flex rounded-lg shadow-sm shadow-black/[.04]">
                  <span className="-z-10 inline-flex items-center rounded-s-lg border border-input bg-background px-3 text-sm text-muted-foreground">
                    https://init.kyh.io/dashboard/
                  </span>
                  <Input
                    className="-ms-px rounded-s-none shadow-none"
                    required
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <footer className="flex justify-end">
          <Button type="submit" loading={updateTeam.isPending}>
            Update Team
          </Button>
        </footer>
      </form>
    </Form>
  );
};
