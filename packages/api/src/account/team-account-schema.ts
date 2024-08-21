import { z } from "zod";

const confirmationString = "TRANSFER";

const invite = z.object({
  email: z.string().email(),
  role: z.string().min(1).max(100),
});

export const inviteMembers = z
  .object({
    invitations: invite.array().min(1).max(5),
  })
  .refine(
    (data) => {
      const emails = data.invitations.map((member) =>
        member.email.toLowerCase(),
      );

      const uniqueEmails = new Set(emails);

      return emails.length === uniqueEmails.size;
    },
    {
      message: "Duplicate emails are not allowed",
      path: ["invitations"],
    },
  );

export const role = z.object({
  role: z.string().min(1),
});

export const teamWorkspaceInput = z.object({
  slug: z.string(),
});
export type TeamWorkspaceInput = z.infer<typeof teamWorkspaceInput>;

export const createTeamAccountInput = z.object({
  name: z.string(),
});
export type CreateTeamAccountInput = z.infer<typeof createTeamAccountInput>;

export const updateTeamAccountNameInput = z.object({
  slug: z.string(),
  name: z.string(),
});
export type UpdateTeamAccountNameInput = z.infer<
  typeof updateTeamAccountNameInput
>;

export const deleteTeamAccountInput = z.object({
  accountId: z.string(),
});
export type DeleteTeamAccountInput = z.infer<typeof deleteTeamAccountInput>;

export const leaveTeamAccountInput = z.object({
  accountId: z.string(),
});
export type LeaveTeamAccountInput = z.infer<typeof leaveTeamAccountInput>;

export const membersInput = z.object({
  slug: z.string(),
});
export type MembersInput = z.infer<typeof membersInput>;

export const invitationsInput = z.object({
  slug: z.string(),
});
export type InvitationsInput = z.infer<typeof invitationsInput>;

export const removeMemberInput = z.object({
  accountId: z.string(),
  userId: z.string(),
});
export type RemoveMemberInput = z.infer<typeof removeMemberInput>;

export const updateMemberRoleInput = role.extend({
  accountId: z.string().uuid(),
  userId: z.string().uuid(),
});
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleInput>;

export const transferOwnershipInput = z.object({
  userId: z.string().uuid(),
  confirmation: z.custom((value) => value === confirmationString),
  accountId: z.string().uuid(),
});
export type TransferOwnershipInput = z.infer<typeof transferOwnershipInput>;

export const sendInvitationsInput = z.object({
  invitations: invite.array().min(1).max(5),
  accountSlug: z.string(),
});
export type SendInvitationsInput = z.infer<typeof sendInvitationsInput>;

export const updateInvitationInput = z.object({
  invitationId: z.string().uuid(),
  role: z.string().min(1),
});
export type UpdateInvitationInput = z.infer<typeof updateInvitationInput>;

export const renewInvitationInput = z.object({
  invitationId: z.string().uuid(),
});
export type RenewInvitationInput = z.infer<typeof renewInvitationInput>;

export const deleteInvitationInput = z.object({
  invitationId: z.string().uuid(),
});
export type DeleteInvitationInput = z.infer<typeof deleteInvitationInput>;
