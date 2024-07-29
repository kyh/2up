"use client";

import { useRouter } from "next/navigation";
import { createTeamAccountInput } from "@init/api/account/team-account-schema";
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

import { api } from "@/trpc/react";

export const CreateTeamAccountForm = () => {
  const router = useRouter();

  const createTeamAccount = api.account.createTeamAccount.useMutation({
    onSuccess: (res) => {
      toast.success("Team created successfully");
      router.push(`/dashboard/${res.slug}`);
    },
    onError: () =>
      toast.error(
        "We encountered an error creating your team. Please try again.",
      ),
  });

  const form = useForm({
    schema: createTeamAccountInput,
    defaultValues: {
      name: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          createTeamAccount.mutate(data);
        })}
      >
        <div className="flex flex-col space-y-4">
          <FormField
            name="name"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>
                  <FormControl>
                    <Input
                      required
                      minLength={2}
                      maxLength={50}
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Your team name should be unique and descriptive
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <div className="flex justify-end space-x-2">
            <Button loading={createTeamAccount.isPending}>Create Team</Button>
          </div>
        </div>
      </form>
    </Form>
  );
};
