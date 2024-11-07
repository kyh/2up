"use client";

import { useEffect, useState } from "react";
import { impersonateUserInput } from "@init/api/admin/admin-schema";
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

import { api } from "@/trpc/react";

type AdminImpersonateUserDialogProps = {
  userId: string;
} & React.ComponentPropsWithoutRef<typeof AlertDialog>;

export const AdminImpersonateUserDialog = ({
  userId,
  ...props
}: AdminImpersonateUserDialogProps) => {
  const impersonateUserAction = api.admin.impersonateUser.useMutation();
  const form = useForm({
    schema: impersonateUserInput,
    defaultValues: {
      userId,
    },
  });

  const [tokens, setTokens] = useState<{
    accessToken: string;
    refreshToken: string;
  }>();

  if (tokens) {
    return <ImpersonateUserAuthSetter tokens={tokens} />;
  }

  return (
    <AlertDialog {...props}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Impersonate User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to impersonate this user? You will be logged
            in as this user. To stop impersonating, log out.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form
            className="flex flex-col gap-8"
            onSubmit={form.handleSubmit(async (data) => {
              await impersonateUserAction.mutateAsync(data).then((tokens) => {
                setTokens(tokens);
              });
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
                    Are you sure you want to impersonate this user?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button type="submit" loading={impersonateUserAction.isPending}>
                Impersonate User
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const ImpersonateUserAuthSetter = ({
  tokens,
}: React.PropsWithChildren<{
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}>) => {
  const setSessionAction = api.auth.setSession.useMutation();

  useEffect(() => {
    setSessionAction
      .mutateAsync(tokens)
      .then(() => {
        // use a hard refresh to avoid hitting cached pages
        window.location.replace("/dashboard");
      })
      .catch((error) => {
        console.error(error);
      });
  }, [setSessionAction, tokens]);

  return null;
};
