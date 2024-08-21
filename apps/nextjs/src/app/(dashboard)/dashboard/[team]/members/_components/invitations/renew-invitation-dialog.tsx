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

type RenewInvitationDialogProps = {
  invitationId: string;
  email: string;
} & React.ComponentPropsWithoutRef<typeof AlertDialog>;

export const RenewInvitationDialog = ({
  invitationId,
  email,
  ...props
}: RenewInvitationDialogProps) => (
  <AlertDialog {...props}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Renew Invitation</AlertDialogTitle>
        <AlertDialogDescription>
          You are about to renew the invitation to {email}. The user will be
          able to join the team.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <RenewInvitationForm
        onSuccess={() => props.onOpenChange?.(false)}
        invitationId={invitationId}
      />
    </AlertDialogContent>
  </AlertDialog>
);

const RenewInvitationForm = ({
  invitationId,
  onSuccess,
}: {
  invitationId: string;
  onSuccess?: () => void;
}) => {
  const renewInvitation = api.account.renewInvitation.useMutation({
    onSuccess: () => {
      onSuccess?.();
      toast.success("Invite renewed successfully");
    },
    onError: () =>
      toast.error(
        "We encountered an error renewing the invitation. Please try again.",
      ),
  });

  const inInvitationRenewed = () => {
    renewInvitation.mutate({ invitationId });
  };

  return (
    <form action={inInvitationRenewed}>
      <div className="flex flex-col space-y-6">
        <p className="text-sm text-muted-foreground">
          Are you sure you want to continue?
        </p>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button loading={renewInvitation.isPending}>Renew Invitation</Button>
        </AlertDialogFooter>
      </div>
    </form>
  );
};
