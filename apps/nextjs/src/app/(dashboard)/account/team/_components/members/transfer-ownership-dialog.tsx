"use client";

import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { transferOwnershipInput } from "@init/api/team-account/team-account-schema";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@init/ui/form";
import { If } from "@init/ui/if";
import { Input } from "@init/ui/input";
import { toast } from "@init/ui/toast";
import { useForm } from "react-hook-form";

import { api } from "@/trpc/react";

export function TransferOwnershipDialog({
  isOpen,
  setIsOpen,
  targetDisplayName,
  accountId,
  userId,
}: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  accountId: string;
  userId: string;
  targetDisplayName: string;
}) {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Transfer Ownership</AlertDialogTitle>

          <AlertDialogDescription>
            Transfer ownership of the team to another member.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <TransferOrganizationOwnershipForm
          accountId={accountId}
          userId={userId}
          targetDisplayName={targetDisplayName}
          setIsOpen={setIsOpen}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}

function TransferOrganizationOwnershipForm({
  accountId,
  userId,
  targetDisplayName,
  setIsOpen,
}: {
  userId: string;
  accountId: string;
  targetDisplayName: string;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const router = useRouter();
  const transferOwnership = api.teamAccount.transferOwnership.useMutation({
    onSuccess: () => {
      setIsOpen(false);
      toast.success("Ownership transfered successfully");
      router.refresh();
    },
    onError: () =>
      toast.error("Sorry, we couldn't transfer ownership of your team."),
  });

  const form = useForm({
    resolver: zodResolver(transferOwnershipInput),
    defaultValues: {
      confirmation: "",
      accountId,
      userId,
    },
  });

  return (
    <Form {...form}>
      <form
        className={"flex flex-col space-y-4 text-sm"}
        onSubmit={form.handleSubmit((data) => {
          transferOwnership.mutate(data);
        })}
      >
        <p>
          You are transferring ownership of the selected team to{" "}
          <b>{targetDisplayName}</b>.
        </p>

        <FormField
          name={"confirmation"}
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>
                  Please type TRANSFER to confirm the transfer of ownership.
                </FormLabel>

                <FormControl>
                  <Input
                    autoComplete={"off"}
                    type={"text"}
                    required
                    {...field}
                  />
                </FormControl>

                <FormDescription>
                  By transferring ownership, you will no longer be the primary
                  owner of the team.
                </FormDescription>

                <FormMessage />
              </FormItem>
            );
          }}
        />

        <div>
          <p className={"text-muted-foreground"}>
            Are you sure you want to continue?
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button
            type={"submit"}
            variant={"destructive"}
            disabled={transferOwnership.isPending}
          >
            <If
              condition={transferOwnership.isPending}
              fallback={"Transfer Ownership"}
            >
              Transferring ownership...
            </If>
          </Button>
        </AlertDialogFooter>
      </form>
    </Form>
  );
}
