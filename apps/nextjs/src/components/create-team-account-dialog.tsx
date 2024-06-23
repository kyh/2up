"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { createTeamAccountInput } from "@init/api/team-account/team-account-schema";
import { Button } from "@init/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@init/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@init/ui/form";
import { Input } from "@init/ui/input";
import { toast } from "@init/ui/toast";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "@/trpc/react";

export function CreateTeamAccountDialog(
  props: React.PropsWithChildren<{
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
  }>,
) {
  return (
    <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <DialogContent
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Create Team</DialogTitle>

          <DialogDescription>
            Create a new Team to manage your projects and members.
          </DialogDescription>
        </DialogHeader>

        <CreateOrganizationAccountForm onClose={() => props.setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}

function CreateOrganizationAccountForm(props: { onClose: () => void }) {
  const createTeamAccount = api.teamAccount.createTeamAccount.useMutation({
    onSuccess: () => {
      toast.success("Team created successfully");
    },
    onError: () =>
      toast.error(
        "We encountered an error creating your team. Please try again.",
      ),
  });

  const form = useForm<z.infer<typeof createTeamAccountInput>>({
    defaultValues: {
      name: "",
    },
    resolver: zodResolver(createTeamAccountInput),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          createTeamAccount.mutate(data);
        })}
      >
        <div className={"flex flex-col space-y-4"}>
          <FormField
            name={"name"}
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel>Team Name</FormLabel>

                  <FormControl>
                    <Input
                      required
                      minLength={2}
                      maxLength={50}
                      placeholder={""}
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

          <div className={"flex justify-end space-x-2"}>
            <Button
              variant={"outline"}
              type={"button"}
              disabled={createTeamAccount.isPending}
              onClick={props.onClose}
            >
              Cancel
            </Button>

            <Button disabled={createTeamAccount.isPending}>
              {createTeamAccount.isPending ? "Creating Team..." : "Create Team"}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
