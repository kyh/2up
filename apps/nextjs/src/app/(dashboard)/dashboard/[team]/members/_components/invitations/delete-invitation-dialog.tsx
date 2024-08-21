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

type DeleteInvitationDialogProps = {
  invitationId: string;
} & React.ComponentPropsWithoutRef<typeof AlertDialog>;

export const DeleteInvitationDialog = ({
  invitationId,
  ...props
}: DeleteInvitationDialogProps) => (
  <AlertDialog {...props}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete Invitation</AlertDialogTitle>
        <AlertDialogDescription>
          You are about to delete the invitation. The user will no longer be
          able to join the team.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <DeleteInvitationForm
        onSuccess={() => props.onOpenChange?.(false)}
        invitationId={invitationId}
      />
    </AlertDialogContent>
  </AlertDialog>
);

const DeleteInvitationForm = ({
  invitationId,
  onSuccess,
}: {
  invitationId: string;
  onSuccess?: () => void;
}) => {
  const deleteInvitation = api.account.deleteInvitation.useMutation({
    onSuccess: () => {
      onSuccess?.();
      toast.success("Invite deleted successfully");
    },
    onError: () => toast.error("Invite not deleted. Please try again."),
  });

  const onInvitationRemoved = () => {
    deleteInvitation.mutate({ invitationId });
  };

  return (
    <form action={onInvitationRemoved}>
      <div className="flex flex-col space-y-6">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to continue?
        </p>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button
            type="submit"
            variant="destructive"
            disabled={deleteInvitation.isPending}
          >
            Delete Invitation
          </Button>
        </AlertDialogFooter>
      </div>
    </form>
  );
};
