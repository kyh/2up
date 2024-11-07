"use client";

import { deleteUserInput } from "@init/api/admin/admin-schema";
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

type AdminDeleteUserDialogProps = {
  userId: string;
} & React.ComponentPropsWithoutRef<typeof AlertDialog>;

export const AdminDeleteUserDialog = ({
  userId,
  ...props
}: AdminDeleteUserDialogProps) => {
  const deleteUserAction = api.admin.deleteUser.useMutation({
    onSuccess: () => toast.success("User deleted successfully"),
    onError: () => toast.error("Error deleting user record or auth record."),
  });

  const form = useForm({
    schema: deleteUserInput,
    defaultValues: {
      userId,
    },
  });

  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this user? All the data associated
            with this user will be permanently deleted. Any active subscriptions
            will be canceled.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-8"
            onSubmit={form.handleSubmit((data) => {
              return deleteUserAction.mutate(data);
            })}
          >
            <FormField
              name="confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Type <b>CONFIRM</b> to confirm
                  </FormLabel>
                  <FormControl>
                    <Input
                      required
                      pattern="CONFIRM"
                      placeholder="Type CONFIRM to confirm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Are you sure you want to do this? This action cannot be
                    undone.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                type="submit"
                variant="destructive"
                loading={deleteUserAction.isPending}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
