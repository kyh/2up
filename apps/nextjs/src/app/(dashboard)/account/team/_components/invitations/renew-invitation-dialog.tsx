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

export function RenewInvitationDialog({
  isOpen,
  setIsOpen,
  invitationId,
  email,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  invitationId: number;
  email: string;
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Renew Invitation</AlertDialogTitle>

          <AlertDialogDescription>
            You are about to renew the invitation to {email}. The user will be
            able to join the team.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <RenewInvitationForm
          setIsOpen={setIsOpen}
          invitationId={invitationId}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}

function RenewInvitationForm({
  invitationId,
  setIsOpen,
}: {
  invitationId: number;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const utils = api.useUtils();
  const renewInvitation = api.team.renewInvitation.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      toast.success("Invite renewed successfully");
      utils.team.invitations.invalidate();
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
      <div className={"flex flex-col space-y-6"}>
        <p className={"text-sm text-muted-foreground"}>
          Are you sure you want to continue?
        </p>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button disabled={renewInvitation.isPending}>Renew Invitation</Button>
        </AlertDialogFooter>
      </div>
    </form>
  );
}
