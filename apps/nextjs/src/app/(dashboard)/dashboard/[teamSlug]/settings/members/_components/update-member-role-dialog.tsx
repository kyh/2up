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
import { MembershipRoleSelector } from "../membership-role-selector";
import { RolesDataProvider } from "./roles-data-provider";

type Role = string;

type UpdateMemberRoleDialogProps = {
  teamAccountId: string;
  userId: string;
  userRole: Role;
  userRoleHierarchy: number;
} & React.ComponentPropsWithoutRef<typeof Dialog>;

export const UpdateMemberRoleDialog = ({
  userId,
  teamAccountId,
  userRole,
  userRoleHierarchy,
  ...props
}: UpdateMemberRoleDialogProps) => (
  <Dialog {...props}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Update Member's Role</DialogTitle>
        <DialogDescription>
          Change the role of the selected member. The role determines the
          permissions of the member.
        </DialogDescription>
      </DialogHeader>
      <RolesDataProvider maxRoleHierarchy={userRoleHierarchy}>
        {(data) => (
          <UpdateMemberForm
            userId={userId}
            teamAccountId={teamAccountId}
            userRole={userRole}
            roles={data}
            onSuccess={() => props.onOpenChange?.(false)}
          />
        )}
      </RolesDataProvider>
    </DialogContent>
  </Dialog>
);

const UpdateMemberForm = ({
  userId,
  userRole,
  teamAccountId,
  onSuccess,
  roles,
}: {
  userId: string;
  userRole: Role;
  teamAccountId: string;
  roles: Role[];
  onSuccess?: () => void;
}) => {
  const updateMemberRole = api.account.updateMemberRole.useMutation({
    onSuccess: () => {
      onSuccess?.();
      toast.success("Role updated successfully");
    },
    onError: () =>
      toast.error(
        "We encountered an error updating the role of the selected member. Please try again.",
      ),
  });

  const onSubmit = ({ role }: { role: Role }) => {
    updateMemberRole.mutate({
      accountId: teamAccountId,
      userId,
      role,
    });
  };

  const form = useForm({
    schema: role.refine((data) => data.role !== userRole, {
      message: "Role must be different from the current one",
      path: ["role"],
    }),
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
                  <MembershipRoleSelector
                    roles={roles}
                    currentUserRole={userRole}
                    value={field.value}
                    onChange={(newRole) => form.setValue("role", newRole)}
                  />
                </FormControl>
                <FormDescription>Pick a role for this member.</FormDescription>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <Button loading={updateMemberRole.isPending}>Update Role</Button>
      </form>
    </Form>
  );
};
