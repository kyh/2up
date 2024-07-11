"use client";

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
  useForm,
} from "@init/ui/form";
import { toast } from "@init/ui/toast";

import { api } from "@/trpc/react";
import { MembershipRoleSelector } from "../../../../[account]/members/_components/membership-role-selector";
import { RolesDataProvider } from "./roles-data-provider";

type Role = string;

export const UpdateMemberRoleDialog = ({
  isOpen,
  setIsOpen,
  userId,
  teamAccountId,
  userRole,
  userRoleHierarchy,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  userId: string;
  teamAccountId: string;
  userRole: Role;
  userRoleHierarchy: number;
}) => (
  <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
            setIsOpen={setIsOpen}
            userId={userId}
            teamAccountId={teamAccountId}
            userRole={userRole}
            roles={data}
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
  setIsOpen,
  roles,
}: React.PropsWithChildren<{
  userId: string;
  userRole: Role;
  teamAccountId: string;
  setIsOpen: (isOpen: boolean) => void;
  roles: Role[];
}>) => {
  const updateMemberRole = api.team.updateMemberRole.useMutation({
    onSuccess: () => {
      setIsOpen(false);
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
        className="flex flex-col space-y-6"
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

        <Button disabled={updateMemberRole.isPending}>Update Role</Button>
      </form>
    </Form>
  );
};
