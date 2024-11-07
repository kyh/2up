"use client";

import { role } from "@init/api/account/team-account-schema";
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
  useForm,
} from "@init/ui/form";
import { toast } from "@init/ui/toast";

import { api } from "@/trpc/react";
import { RolesDataProvider } from "../members/roles-data-provider";
import { MembershipRoleSelector } from "../membership-role-selector";

type Role = string;

type UpdateInvitationDialogProps = {
  invitationId: string;
  userRole: Role;
  userRoleHierarchy: number;
} & React.ComponentPropsWithoutRef<typeof Dialog>;

export const UpdateInvitationDialog = ({
  invitationId,
  userRole,
  userRoleHierarchy,
  ...props
}: UpdateInvitationDialogProps) => (
  <Dialog {...props}>
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
        onSuccess={() => props.onOpenChange?.(false)}
      />
    </DialogContent>
  </Dialog>
);

const UpdateInvitationForm = ({
  invitationId,
  userRole,
  userRoleHierarchy,
  onSuccess,
}: {
  invitationId: string;
  userRole: Role;
  userRoleHierarchy: number;
  onSuccess?: () => void;
}) => {
  const updateInvitation = api.account.updateInvitation.useMutation({
    onSuccess: () => {
      onSuccess?.();
      toast.success("Invite updated successfully");
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
    schema: role.refine(
      (data) => {
        return data.role !== userRole;
      },
      {
        message: "Role must be different from the current one",
        path: ["role"],
      },
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
        className="flex flex-col gap-6"
      >
        <FormField
          name="role"
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
        <Button type="submit" loading={updateInvitation.isPending}>
          Update Role
        </Button>
      </form>
    </Form>
  );
};
