"use client";

import {
  createTeamInvitationsInput,
  teamMemberRoles,
} from "@init/api/team/team-schema";
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
  useFieldArray,
  useForm,
} from "@init/ui/form";
import { Input } from "@init/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@init/ui/select";
import { toast } from "@init/ui/toast";
import { Tooltip, TooltipContent, TooltipTrigger } from "@init/ui/tooltip";
import { PlusIcon, XIcon } from "lucide-react";

import type { CreateTeamInvitationsInput } from "@init/api/team/team-schema";
import { api } from "@/trpc/react";

/**
 * The maximum number of invites that can be sent at once.
 * Useful to avoid spamming the server with too large payloads
 */
const MAX_INVITES = 5;

type InviteMembersDialogProps = {
  teamId: string;
};

export const InviteMembersDialog = ({ teamId }: InviteMembersDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="mr-2 w-4" />
          <span>Invite Members</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Members to your Team</DialogTitle>
          <DialogDescription>
            Invite members to your team by entering their email and role.
          </DialogDescription>
        </DialogHeader>
        <InviteMembersForm teamId={teamId} />
      </DialogContent>
    </Dialog>
  );
};

type InviteMembersFormProps = {
  teamId: string;
};

export const InviteMembersForm = ({ teamId }: InviteMembersFormProps) => {
  const createInvitations = api.team.createInvitations.useMutation();

  const form = useForm({
    schema: createTeamInvitationsInput,
    defaultValues: {
      teamInvitations: [createEmptyInviteModel(teamId)],
    },
  });

  const fieldArray = useFieldArray({
    name: "teamInvitations",
    control: form.control,
  });

  const onSubmit = (data: CreateTeamInvitationsInput) => {
    const promise = createInvitations.mutateAsync(data);
    toast.promise(promise, {
      loading: "Sending invites...",
      success: "Profile successfully updated",
      error: "Could not update profile. Please try again.",
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-2">
          {fieldArray.fields.map((field, index) => {
            const emailInputName = `teamInvitations.${index}.email` as const;
            const roleInputName = `teamInvitations.${index}.role` as const;

            return (
              <div key={field.id} className="flex items-end gap-2">
                <FormField
                  name={emailInputName}
                  render={({ field }) => {
                    return (
                      <FormItem className="w-7/12">
                        {index === 0 && <FormLabel>Email</FormLabel>}
                        <FormControl>
                          <Input
                            placeholder="member@email.com"
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
                <FormField
                  name={roleInputName}
                  render={({ field }) => {
                    return (
                      <FormItem className="w-4/12">
                        {index === 0 && <FormLabel>Role</FormLabel>}
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={(newRole) =>
                              form.setValue(field.name, newRole)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {teamMemberRoles.map((role) => (
                                <SelectItem
                                  className="text-sm capitalize"
                                  key={role}
                                  value={role}
                                >
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <div className="flex w-[40px] justify-end">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        disabled={fieldArray.fields.length <= 1}
                        aria-label="Remove invite"
                        onClick={() => {
                          fieldArray.remove(index);
                          form.clearErrors(emailInputName);
                        }}
                      >
                        <XIcon className="h-4 lg:h-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Remove invite</TooltipContent>
                  </Tooltip>
                </div>
              </div>
            );
          })}
          {fieldArray.fields.length < MAX_INVITES && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={createInvitations.isPending}
              onClick={() => fieldArray.append(createEmptyInviteModel(teamId))}
            >
              <PlusIcon className="mr-1 h-3" />
              <span>Add another one</span>
            </Button>
          )}
        </div>
        <Button
          className="mt-5 w-full"
          type="submit"
          loading={createInvitations.isPending}
        >
          Send Invites
        </Button>
      </form>
    </Form>
  );
};

const createEmptyInviteModel = (teamId: string) => ({
  teamId,
  email: "",
  role: "member",
});
