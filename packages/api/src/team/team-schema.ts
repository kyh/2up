import { z } from "zod";

/**
 * Create
 */

/**
 * Create - teams
 */
export const createTeamInput = z.object({
  name: z.string(),
  slug: z.string().optional(),
});
export type CreateTeamInput = z.infer<typeof createTeamInput>;

export const createTeamsInput = z.object({ teams: z.array(createTeamInput) });
export type CreateTeamsInput = z.infer<typeof createTeamsInput>;

/**
 * Create - members
 */
export const teamMemberRoles = ["owner", "admin", "member"] as const;
export const createTeamMemberInput = z.object({
  teamId: z.string(),
  userId: z.string(),
  role: z.enum(teamMemberRoles),
});
export type CreateTeamMemberInput = z.infer<typeof createTeamMemberInput>;

export const createTeamMembersInput = z.object({
  teamMembers: z.array(createTeamMemberInput),
});
export type CreateTeamMembersInput = z.infer<typeof createTeamMembersInput>;

/**
 * Create - invitations
 */
export const createTeamInvitationInput = z.object({
  teamId: z.string(),
  email: z.string().email(),
  role: z.enum(teamMemberRoles),
  invitedBy: z.string().optional(),
  status: z.enum(["pending", "accepted", "rejected"]).default("pending"),
});
export type CreateTeamInvitationInput = z.infer<
  typeof createTeamInvitationInput
>;

export const createTeamInvitationsInput = z.object({
  teamInvitations: z.array(createTeamInvitationInput),
});
export type CreateTeamInvitationsInput = z.infer<
  typeof createTeamInvitationsInput
>;

/**
 * Read
 */

/**
 * Read - teams
 */
export const getTeamInput = z.object({
  id: z.string().optional(),
  slug: z.string().optional(),
});
export type GetTeamInput = z.infer<typeof getTeamInput>;

export const getTeamsInput = z.object({
  page: z.string().default("1"),
  perPage: z.string().default("10"),
  sort: z
    .array(
      z.object({
        field: createTeamInput.extend({ id: z.string() }).keyof(),
        direction: z.enum(["asc", "desc"]).default("asc"),
      }),
    )
    .default([{ field: "id", direction: "asc" }]),
  filter: z
    .array(
      z.object({
        field: createTeamInput.extend({ id: z.string() }).keyof(),
        value: z.string(),
      }),
    )
    .optional(),
});
export type GetTeamsInput = z.infer<typeof getTeamsInput>;

/**
 * Read - members
 */
export const getTeamMemberInput = z.object({
  teamId: z.string(),
  userId: z.string(),
});

/**
 * Update
 */

/**
 * Update - teams
 */
export const updateTeamInput = z
  .object({
    id: z.string(),
  })
  .merge(createTeamInput);
export type UpdateTeamInput = z.infer<typeof updateTeamInput>;

export const updateTeamsInput = z.object({ teams: z.array(updateTeamInput) });
export type UpdateTeamsInput = z.infer<typeof updateTeamsInput>;

/**
 * Update - members
 */
export const updateTeamMemberInput = createTeamMemberInput;
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberInput>;

export const updateTeamMembersInput = z.object({
  teamMembers: z.array(updateTeamMemberInput),
});
export type UpdateTeamMembersInput = z.infer<typeof updateTeamMembersInput>;

/**
 * Update - invitations
 */
export const updateTeamInvitationInput = z
  .object({
    id: z.string(),
  })
  .merge(createTeamInvitationInput);
export type UpdateTeamInvitationInput = z.infer<
  typeof updateTeamInvitationInput
>;

export const updateTeamInvitationsInput = z.object({
  teamInvitations: z.array(updateTeamInvitationInput),
});
export type UpdateTeamInvitationsInput = z.infer<
  typeof updateTeamInvitationsInput
>;

/**
 * Delete
 */

/**
 * Delete - teams
 */
export const deleteTeamInput = z.object({
  id: z.string(),
});
export type DeleteTeamInput = z.infer<typeof deleteTeamInput>;

export const deleteTeamsInput = z.object({ teams: z.array(deleteTeamInput) });
export type DeleteTeamsInput = z.infer<typeof deleteTeamsInput>;

/**
 * Delete - members
 */
export const deleteTeamMemberInput = createTeamMemberInput.pick({
  teamId: true,
  userId: true,
});
export type DeleteTeamMemberInput = z.infer<typeof deleteTeamMemberInput>;

export const deleteTeamMembersInput = z.object({
  teamMembers: z.array(deleteTeamMemberInput),
});
export type DeleteTeamMembersInput = z.infer<typeof deleteTeamMembersInput>;

/**
 * Delete - invitations
 */
export const deleteTeamInvitationInput = z.object({
  id: z.string(),
});
export type DeleteTeamInvitationInput = z.infer<
  typeof deleteTeamInvitationInput
>;

export const deleteTeamInvitationsInput = z.object({
  teamInvitations: z.array(deleteTeamInvitationInput),
});
export type DeleteTeamInvitationsInput = z.infer<
  typeof deleteTeamInvitationsInput
>;
