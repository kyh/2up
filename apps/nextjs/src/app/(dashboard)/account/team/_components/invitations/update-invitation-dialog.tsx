"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { role } from "@init/api/team/team-schema";
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
import { toast } from "@init/ui/toast";
import { useForm } from "react-hook-form";

import { api } from "@/trpc/react";
import { RolesDataProvider } from "../members/roles-data-provider";
import { MembershipRoleSelector } from "../membership-role-selector";

type Role = string;

export function UpdateInvitationDialog({
  isOpen,
  setIsOpen,
  invitationId,
  userRole,
  userRoleHierarchy,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  invitationId: number;
  userRole: Role;
  userRoleHierarchy: number;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Member's Role</DialogTitle>

          <DialogDescription>
            Change the role of the selected member. The role determines the
            permissions of the member.
          </DialogDescription>
        </DialogHeader>

        <UpdateInvitationForm
          invitationId={invitationId}
          userRole={userRole}
          userRoleHierarchy={userRoleHierarchy}
          setIsOpen={setIsOpen}
        />
      </DialogContent>
    </Dialog>
  );
}

function UpdateInvitationForm({
  invitationId,
  userRole,
  userRoleHierarchy,
  setIsOpen,
}: React.PropsWithChildren<{
  invitationId: number;
  userRole: Role;
  userRoleHierarchy: number;
  setIsOpen: (isOpen: boolean) => void;
}>) {
  const utils = api.useUtils();
  const updateInvitation = api.team.updateInvitation.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      toast.success("Invite updated successfully");
      utils.team.invitations.invalidate();
    },
    onError: () =>
      toast.error(
        "We encountered an error renewing the invitation. Please try again.",
      ),
  });

  const onSubmit = ({ role }: { role: Role }) => {
    updateInvitation.mutate({
      invitationId,
      role,
    });
  };

  const form = useForm({
    resolver: zodResolver(
      role.refine(
        (data) => {
          return data.role !== userRole;
        },
        {
          message: "Role must be different from the current one",
          path: ["role"],
        },
      ),
    ),
    reValidateMode: "onChange",
    mode: "onChange",
    defaultValues: {
      role: userRole,
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={"flex flex-col space-y-6"}
      >
        <FormField
          name={"role"}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Role</FormLabel>

                <FormControl>
                  <RolesDataProvider maxRoleHierarchy={userRoleHierarchy}>
                    {(roles) => (
                      <MembershipRoleSelector
                        roles={roles}
                        currentUserRole={userRole}
                        value={field.value}
                        onChange={(newRole) =>
                          form.setValue(field.name, newRole)
                        }
                      />
                    )}
                  </RolesDataProvider>
                </FormControl>

                <FormDescription>Pick a role for this member.</FormDescription>

                <FormMessage />
              </FormItem>
            );
          }}
        />

        <Button type={"submit"} disabled={updateInvitation.isPending}>
          Update Role
        </Button>
      </form>
    </Form>
  );
}
