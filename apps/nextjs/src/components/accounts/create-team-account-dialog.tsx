"use client";

import React from "react";
import { createTeamAccountInput } from "@init/api/team/team-schema";
import { Button } from "@init/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@init/ui/dialog";
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

export const CreateTeamAccountDialog = ({
  children,
}: React.PropsWithChildren) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
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

        <CreateOrganizationAccountForm onClose={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

const CreateOrganizationAccountForm = (props: { onClose: () => void }) => {
  const createTeamAccount = api.team.createTeamAccount.useMutation({
    onSuccess: () => {
      toast.success("Team created successfully");
      props.onClose();
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
            <Button
              variant="outline"
              type="button"
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
};
