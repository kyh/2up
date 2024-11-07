"use client";

import { transferOwnershipInput } from "@init/api/account/team-account-schema";
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
  useForm,
} from "@init/ui/form";
import { Input } from "@init/ui/input";
import { toast } from "@init/ui/toast";

import { api } from "@/trpc/react";

type TransferOwnershipDialogProps = {
  accountId: string;
  userId: string;
  targetDisplayName: string;
} & React.ComponentPropsWithoutRef<typeof AlertDialog>;

export const TransferOwnershipDialog = ({
  targetDisplayName,
  accountId,
  userId,
  ...props
}: TransferOwnershipDialogProps) => (
  <AlertDialog {...props}>
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
        onSuccess={() => props.onOpenChange?.(false)}
      />
    </AlertDialogContent>
  </AlertDialog>
);

const TransferOrganizationOwnershipForm = ({
  accountId,
  userId,
  targetDisplayName,
  onSuccess,
}: {
  userId: string;
  accountId: string;
  targetDisplayName: string;
  onSuccess?: () => void;
}) => {
  const transferOwnership = api.account.transferOwnership.useMutation({
    onSuccess: () => {
      onSuccess?.();
      toast.success("Ownership transfered successfully");
    },
    onError: () =>
      toast.error("Sorry, we couldn't transfer ownership of your team."),
  });

  const form = useForm({
    schema: transferOwnershipInput,
    defaultValues: {
      confirmation: "",
      accountId,
      userId,
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 text-sm"
        onSubmit={form.handleSubmit((data) => {
          transferOwnership.mutate(data);
        })}
      >
        <p>
          You are transferring ownership of the selected team to{" "}
          <b>{targetDisplayName}</b>.
        </p>
        <FormField
          name="confirmation"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>
                  Please type TRANSFER to confirm the transfer of ownership.
                </FormLabel>
                <FormControl>
                  <Input autoComplete="off" type="text" required {...field} />
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
          <p className="text-muted-foreground">
            Are you sure you want to continue?
          </p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            type="submit"
            variant="destructive"
            loading={transferOwnership.isPending}
          >
            Transfer Ownership
          </Button>
        </AlertDialogFooter>
      </form>
    </Form>
  );
};
