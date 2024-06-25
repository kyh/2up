"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
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
import { Input } from "@init/ui/input";
import { Spinner } from "@init/ui/spinner";
import { toast } from "@init/ui/toast";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { api } from "@/trpc/react";

export function TeamAccountDangerZone({
  account,
  primaryOwnerUserId,
}: React.PropsWithChildren<{
  account: {
    name: string;
    id: string;
  };

  primaryOwnerUserId: string;
}>) {
  const { data: user } = api.account.me.useQuery();

  if (!user) {
    return (
      <div className={"flex flex-col items-center justify-center p-4"}>
        <Spinner />
      </div>
    );
  }

  // Only the primary owner can delete the team account
  const userIsPrimaryOwner = user.id === primaryOwnerUserId;

  if (userIsPrimaryOwner) {
    return <DeleteTeamContainer account={account} />;
  }

  // A primary owner can't leave the team account
  // but other members can
  return <LeaveTeamContainer account={account} />;
}

function DeleteTeamContainer(props: {
  account: {
    name: string;
    id: string;
  };
}) {
  return (
    <div className={"flex flex-col space-y-4"}>
      <div className={"flex flex-col space-y-1"}>
        <span className={"font-medium"}>Delete Team</span>

        <p className={"text-sm text-muted-foreground"}>
          You are about to delete the team {props.account.name}. This action
          cannot be undone.
        </p>
      </div>

      <div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button type={"button"} variant={"destructive"}>
              Delete Team
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent onEscapeKeyDown={(e) => e.preventDefault()}>
            <AlertDialogHeader>
              <AlertDialogTitle>Deleting team</AlertDialogTitle>

              <AlertDialogDescription>
                You are about to delete the team {props.account.name}. This
                action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <DeleteTeamConfirmationForm
              name={props.account.name}
              id={props.account.id}
            />
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

function DeleteTeamConfirmationForm({
  name,
  id,
}: {
  name: string;
  id: string;
}) {
  const deleteTeamAccount = api.teamAccount.deleteTeamAccount.useMutation({
    onSuccess: () => {
      toast.success("Team deleted successfully");
    },
    onError: () =>
      toast.error(
        "There was an error deleting the team. Please try again later.",
      ),
  });

  const form = useForm({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(
      z.object({
        name: z.string().refine((value) => value === name, {
          message: "Name does not match",
          path: ["name"],
        }),
      }),
    ),
    defaultValues: {
      name: "",
    },
  });

  return (
    <Form {...form}>
      <form
        className={"flex flex-col space-y-4"}
        onSubmit={() => {
          deleteTeamAccount.mutate({ accountId: id });
        }}
      >
        <div className={"flex flex-col space-y-2"}>
          <div
            className={
              "border-2 border-red-500 p-4 text-sm text-red-500" +
              " my-4 flex flex-col space-y-2"
            }
          >
            <div>
              You are deleting the team {name}. This action cannot be undone.
            </div>

            <div className={"text-sm"}>Are you sure you want to continue?</div>
          </div>

          <input type="hidden" value={id} name={"accountId"} />

          <FormField
            render={({ field }) => (
              <FormItem>
                <FormLabel>Team Name</FormLabel>

                <FormControl>
                  <Input
                    required
                    type={"text"}
                    autoComplete={"off"}
                    className={"w-full"}
                    placeholder={""}
                    pattern={name}
                    {...field}
                  />
                </FormControl>

                <FormDescription>
                  Type the name of the team to confirm
                </FormDescription>

                <FormMessage />
              </FormItem>
            )}
            name={"confirm"}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>

          <Button
            disabled={deleteTeamAccount.isPending}
            variant={"destructive"}
          >
            Delete Team
          </Button>
        </AlertDialogFooter>
      </form>
    </Form>
  );
}

function LeaveTeamContainer(props: {
  account: {
    name: string;
    id: string;
  };
}) {
  const leaveTeamAccount = api.teamAccount.leaveTeamAccount.useMutation({
    onSuccess: () => {
      toast.success("Team left successfully");
    },
    onError: () =>
      toast.error(
        "There was an error leaving the team. Please try again later.",
      ),
  });

  const form = useForm({
    resolver: zodResolver(
      z.object({
        confirmation: z.string().refine((value) => value === "LEAVE", {
          message: "Confirmation required to leave team",
          path: ["confirmation"],
        }),
      }),
    ),
    defaultValues: {
      confirmation: "",
    },
  });

  return (
    <div className={"flex flex-col space-y-4"}>
      <p className={"text-sm text-muted-foreground"}>
        Click the button below to leave the team. Remember, you will no longer
        have access to it and will need to be re-invited to join
      </p>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <div>
            <Button type={"button"} variant={"destructive"}>
              Leave Team
            </Button>
          </div>
        </AlertDialogTrigger>

        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Leaving Team</AlertDialogTitle>

            <AlertDialogDescription>
              You are about to leave this team. You will no longer have access
              to it.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <Form {...form}>
            <form
              className={"flex flex-col space-y-4"}
              onSubmit={() => {
                leaveTeamAccount.mutate({ accountId: props.account.id });
              }}
            >
              <FormField
                name={"confirmation"}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>
                        Please type LEAVE to confirm leaving the team.
                      </FormLabel>

                      <FormControl>
                        <Input
                          type="text"
                          className="w-full"
                          autoComplete={"off"}
                          placeholder=""
                          pattern="LEAVE"
                          required
                          {...field}
                        />
                      </FormControl>

                      <FormDescription>
                        By leaving the team, you will no longer have access to
                        it.
                      </FormDescription>

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <Button
                  disabled={leaveTeamAccount.isPending}
                  variant={"destructive"}
                >
                  Leave Team
                </Button>
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
