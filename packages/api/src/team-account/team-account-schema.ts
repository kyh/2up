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

export const createTeamAccountInput = z.object({
  name: z.string(),
});

export const updateTeamAccountNameInput = z.object({
  slug: z.string(),
  name: z.string(),
});

export const deleteTeamAccountInput = z.object({
  accountId: z.string(),
});

export const leaveTeamAccountInput = z.object({
  accountId: z.string(),
});

export const membersInput = z.object({
  slug: z.string(),
});

export const invitationsInput = z.object({
  slug: z.string(),
});

export const removeMemberInput = z.object({
  accountId: z.string(),
  userId: z.string(),
});

export const updateMemberRoleInput = role.extend({
  accountId: z.string().uuid(),
  userId: z.string().uuid(),
});

export const transferOwnershipInput = z.object({
  userId: z.string().uuid(),
  confirmation: z.custom((value) => value === confirmationString),
  accountId: z.string().uuid(),
});

export const sendInvitationsInput = z.object({
  invitations: invite.array().min(1).max(5),
  accountSlug: z.string(),
});

export const updateInvitationInput = z.object({
  invitationId: z.number(),
  role: z.string().min(1),
});

export const renewInvitationInput = z.object({
  invitationId: z.number().int(),
});

export const deleteInvitationInput = z.object({
  invitationId: z.number().int(),
});
