"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { inviteMembers } from "@init/api/team-account/team-account-schema";
import { Button } from "@init/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@init/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@init/ui/form";
import { If } from "@init/ui/if";
import { Input } from "@init/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@init/ui/tooltip";
import { Cross1Icon, PlusIcon } from "@radix-ui/react-icons";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";

import { api } from "@/trpc/react";
import { MembershipRoleSelector } from "../membership-role-selector";
import { RolesDataProvider } from "./roles-data-provider";

type InviteModel = ReturnType<typeof createEmptyInviteModel>;

type Role = string;

/**
 * The maximum number of invites that can be sent at once.
 * Useful to avoid spamming the server with too large payloads
 */
const MAX_INVITES = 5;

export function InviteMembersDialogContainer({
  accountSlug,
  userRoleHierarchy,
}: {
  accountSlug: string;
  userRoleHierarchy: number;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const createInvitations = api.teamAccount.sendInvitations.useMutation();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} modal>
      <DialogTrigger asChild>
        <Button size={"sm"}>
          <PlusIcon className={"mr-2 w-4"} />
          <span>Invite Members</span>
        </Button>
      </DialogTrigger>

      <DialogContent onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Invite Members to your Team</DialogTitle>

          <DialogDescription>
            Invite members to your team by entering their email and role.
          </DialogDescription>
        </DialogHeader>

        <RolesDataProvider maxRoleHierarchy={userRoleHierarchy}>
          {(roles) => (
            <InviteMembersForm
              pending={createInvitations.isPending}
              roles={roles}
              onSubmit={(data) => {
                const promise = createInvitations.mutateAsync({
                  accountSlug,
                  invitations: data.invitations,
                });

                toast.promise(promise, {
                  loading: "Inviting members...",
                  success: "Members invited successfully",
                  error:
                    "Sorry, members could not be invited. Please try again.",
                });

                setIsOpen(false);
              }}
            />
          )}
        </RolesDataProvider>
      </DialogContent>
    </Dialog>
  );
}

function InviteMembersForm({
  onSubmit,
  roles,
  pending,
}: {
  onSubmit: (data: { invitations: InviteModel[] }) => void;
  pending: boolean;
  roles: string[];
}) {
  const form = useForm({
    resolver: zodResolver(inviteMembers),
    shouldUseNativeValidation: true,
    reValidateMode: "onSubmit",
    defaultValues: {
      invitations: [createEmptyInviteModel()],
    },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "invitations",
  });

  return (
    <Form {...form}>
      <form
        className={"flex flex-col space-y-8"}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col space-y-4">
          {fieldArray.fields.map((field, index) => {
            const isFirst = index === 0;

            const emailInputName = `invitations.${index}.email` as const;
            const roleInputName = `invitations.${index}.role` as const;

            return (
              <div key={field.id}>
                <div className={"flex items-end space-x-0.5 md:space-x-2"}>
                  <div className={"w-7/12"}>
                    <FormField
                      name={emailInputName}
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <If condition={isFirst}>
                              <FormLabel>Email</FormLabel>
                            </If>

                            <FormControl>
                              <Input
                                placeholder={"member@email.com"}
                                type="email"
                                required
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>

                  <div className={"w-4/12"}>
                    <FormField
                      name={roleInputName}
                      render={({ field }) => {
                        return (
                          <FormItem>
                            <If condition={isFirst}>
                              <FormLabel>Role</FormLabel>
                            </If>

                            <FormControl>
                              <MembershipRoleSelector
                                roles={roles}
                                value={field.value}
                                onChange={(role) => {
                                  form.setValue(field.name, role);
                                }}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>

                  <div className={"flex w-[40px] justify-end"}>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant={"ghost"}
                            size={"icon"}
                            type={"button"}
                            disabled={fieldArray.fields.length <= 1}
                            aria-label={"Remove invite"}
                            onClick={() => {
                              fieldArray.remove(index);
                              form.clearErrors(emailInputName);
                            }}
                          >
                            <Cross1Icon className={"h-4 lg:h-5"} />
                          </Button>
                        </TooltipTrigger>

                        <TooltipContent>Remove invite</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            );
          })}

          <If condition={fieldArray.fields.length < MAX_INVITES}>
            <div>
              <Button
                type={"button"}
                variant={"link"}
                size={"sm"}
                disabled={pending}
                onClick={() => {
                  fieldArray.append(createEmptyInviteModel());
                }}
              >
                <PlusIcon className={"mr-1 h-3"} />

                <span>Add another one</span>
              </Button>
            </div>
          </If>
        </div>

        <Button type={"submit"} disabled={pending}>
          {pending ? "Inviting members..." : "Send Invites"}
        </Button>
      </form>
    </Form>
  );
}

function createEmptyInviteModel() {
  return { email: "", role: "member" as Role };
}
