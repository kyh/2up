import { z } from "zod";

// CREATE
export const createTeamInput = z.object({
  name: z.string(),
  slug: z.string(),
});
export type CreateTeamInput = z.infer<typeof createTeamInput>;

export const createTeamsInput = z.array(createTeamInput);
export type CreateTeamsInput = z.infer<typeof createTeamsInput>;

export const createTeamMemberInput = z.object({
  teamId: z.string(),
  userId: z.string(),
  role: z.enum(["owner", "admin", "member"]),
});
export type CreateTeamMemberInput = z.infer<typeof createTeamMemberInput>;

export const createTeamMembersInput = z.array(createTeamMemberInput);
export type CreateTeamMembersInput = z.infer<typeof createTeamMembersInput>;

export const createTeamInvitationInput = z.object({
  teamId: z.string(),
  email: z.string().email(),
  role: createTeamMemberInput.shape.role,
  invitedBy: z.string(),
  status: z.enum(["pending", "accepted", "rejected"]).default("pending"),
});
export type CreateTeamInvitationInput = z.infer<
  typeof createTeamInvitationInput
>;

export const createTeamInvitationsInput = z.array(createTeamInvitationInput);
export type CreateTeamInvitationsInput = z.infer<
  typeof createTeamInvitationsInput
>;

// READ
export const getTeamInput = z
  .object({
    id: z.string(),
  })
  .required();
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

// UPDATE
export const updateTeamInput = z
  .object({
    id: z.string(),
  })
  .merge(createTeamInput);
export type UpdateTeamInput = z.infer<typeof updateTeamInput>;

export const updateTeamsInput = z.array(updateTeamInput);
export type UpdateTeamsInput = z.infer<typeof updateTeamsInput>;

export const updateTeamMemberInput = createTeamMemberInput.pick({ role: true });
export type UpdateTeamMemberInput = z.infer<typeof updateTeamMemberInput>;

export const updateTeamMembersInput = z.array(updateTeamMemberInput);
export type UpdateTeamMembersInput = z.infer<typeof updateTeamMembersInput>;

export const updateTeamInvitationInput = createTeamInvitationInput.pick({
  role: true,
  status: true,
});
export type UpdateTeamInvitationInput = z.infer<
  typeof updateTeamInvitationInput
>;

export const updateTeamInvitationsInput = z.array(updateTeamInvitationInput);
export type UpdateTeamInvitationsInput = z.infer<
  typeof updateTeamInvitationsInput
>;

// DELETE
export const deleteTeamInput = z
  .object({
    id: z.string(),
  })
  .required();
export type DeleteTeamInput = z.infer<typeof deleteTeamInput>;

export const deleteTeamsInput = z.array(deleteTeamInput);
export type DeleteTeamsInput = z.infer<typeof deleteTeamsInput>;

export const deleteTeamMemberInput = createTeamMemberInput.pick({
  teamId: true,
  userId: true,
});
export type DeleteTeamMemberInput = z.infer<typeof deleteTeamMemberInput>;

export const deleteTeamMembersInput = z.array(deleteTeamMemberInput);
export type DeleteTeamMembersInput = z.infer<typeof deleteTeamMembersInput>;

export const deleteTeamInvitationInput = createTeamInvitationInput.pick({
  teamId: true,
  email: true,
});
export type DeleteTeamInvitationInput = z.infer<
  typeof deleteTeamInvitationInput
>;

export const deleteTeamInvitationsInput = z.array(deleteTeamInvitationInput);
export type DeleteTeamInvitationsInput = z.infer<
  typeof deleteTeamInvitationsInput
>;
