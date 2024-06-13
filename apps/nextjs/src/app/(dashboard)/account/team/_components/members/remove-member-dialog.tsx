"use client";

import { useRouter } from "next/navigation";
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

export function RemoveMemberDialog({
  isOpen,
  setIsOpen,
  teamAccountId,
  userId,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  teamAccountId: string;
  userId: string;
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>You are removing this user</AlertDialogTitle>

          <AlertDialogDescription>
            Remove this member from the team. They will no longer have access to
            the team.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <RemoveMemberForm
          setIsOpen={setIsOpen}
          accountId={teamAccountId}
          userId={userId}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}

function RemoveMemberForm({
  accountId,
  userId,
  setIsOpen,
}: {
  accountId: string;
  userId: string;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const router = useRouter();
  const removeMember = api.teamAccount.removeMember.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      toast.success("Member removed successfully");
      router.refresh();
    },
    onError: () =>
      toast.error("Sorry, we encountered an error. Please try again"),
  });

  const onMemberRemoved = () => {
    removeMember.mutate({ accountId, userId });
  };

  return (
    <form action={onMemberRemoved}>
      <div className={"flex flex-col space-y-6"}>
        <p className={"text-sm text-muted-foreground"}>
          Are you sure you want to continue?
        </p>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button variant={"destructive"} disabled={removeMember.isPending}>
            Remove User from Team
          </Button>
        </AlertDialogFooter>
      </div>
    </form>
  );
}
