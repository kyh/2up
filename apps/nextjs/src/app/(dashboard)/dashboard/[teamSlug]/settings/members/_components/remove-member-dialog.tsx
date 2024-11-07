"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@init/ui/alert-dialog";
import { Button } from "@init/ui/button";
import { toast } from "@init/ui/toast";

import { api } from "@/trpc/react";

type RemoveMemberDialogProps = {
  teamAccountId: string;
  userId: string;
} & React.ComponentPropsWithoutRef<typeof AlertDialog>;

export const RemoveMemberDialog = ({
  teamAccountId,
  userId,
  ...props
}: RemoveMemberDialogProps) => (
  <AlertDialog {...props}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>You are removing this user</AlertDialogTitle>
        <AlertDialogDescription>
          Remove this member from the team. They will no longer have access to
          the team.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <RemoveMemberForm
        accountId={teamAccountId}
        userId={userId}
        onSuccess={() => props.onOpenChange?.(false)}
      />
    </AlertDialogContent>
  </AlertDialog>
);

const RemoveMemberForm = ({
  accountId,
  userId,
  onSuccess,
}: {
  accountId: string;
  userId: string;
  onSuccess?: () => void;
}) => {
  const removeMember = api.account.removeMember.useMutation({
    onSuccess: () => {
      onSuccess?.();
      toast.success("Member removed successfully");
    },
    onError: () =>
      toast.error("Sorry, we encountered an error. Please try again"),
  });

  const onMemberRemoved = () => {
    removeMember.mutate({ accountId, userId });
  };

  return (
    <form action={onMemberRemoved}>
      <div className="flex flex-col gap-6">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to continue?
        </p>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button variant="destructive" loading={removeMember.isPending}>
            Remove User from Team
          </Button>
        </AlertDialogFooter>
      </div>
    </form>
  );
};
