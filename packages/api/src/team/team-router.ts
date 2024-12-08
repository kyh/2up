import { and, eq } from "@init/db";
import { invitations, teamMembers, teams } from "@init/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  createTeamInput,
  createTeamInvitationsInput,
  createTeamMemberInput,
  deleteTeamInput,
  deleteTeamInvitationInput,
  deleteTeamMemberInput,
  getTeamInput,
  getTeamInvitationInput,
  getTeamMemberInput,
  updateTeamInput,
  updateTeamInvitationInput,
  updateTeamMemberInput,
} from "./team-schema";

export const teamRouter = createTRPCRouter({
  createTeam: protectedProcedure
    .input(createTeamInput)
    .mutation(async ({ ctx, input }) => {
      let teamSlug = input.name.toLowerCase().replace(/\s/g, "-");
      let counter = 1;

      while (
        await ctx.db.query.teams.findFirst({
          where: (teams, { eq }) => eq(teams.slug, teamSlug),
        })
      ) {
        teamSlug = `${input.name.toLowerCase().replace(/\s/g, "-")}-${counter}`;
        counter++;
      }

      const [created] = await ctx.db
        .insert(teams)
        .values({
          slug: teamSlug,
          ...input,
        })
        .returning();

      if (!created) {
        throw new Error("Failed to create team");
      }

      await ctx.db.insert(teamMembers).values({
        teamId: created.id,
        userId: ctx.user.id,
        role: "owner",
      });

      return {
        team: created,
      };
    }),

  getTeam: protectedProcedure
    .input(getTeamInput)
    .query(async ({ ctx, input }) => {
      const whereClause = whereIdOrSlug(input);
      const team = await ctx.db.query.teams.findFirst({
        where: whereClause,
        with: {
          teamMembers: {
            with: { user: true },
          },
          invitations: true,
        },
      });

      return {
        team,
      };
    }),

  updateTeam: protectedProcedure
    .input(updateTeamInput)
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(teams)
        .set(input)
        .where(eq(teams.id, input.id))
        .returning();

      return {
        team: updated,
      };
    }),

  deleteTeam: protectedProcedure
    .input(deleteTeamInput)
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .delete(teams)
        .where(eq(teams.id, input.id))
        .returning();

      return {
        team: deleted,
      };
    }),

  createTeamInvitations: protectedProcedure
    .input(createTeamInvitationsInput)
    .mutation(async ({ ctx, input }) => {
      const createdInvitations = (
        await Promise.all(
          input.teamInvitations.map(async (invitation) => {
            const [created] = await ctx.db
              .insert(invitations)
              .values({ ...invitation, invitedBy: ctx.user.id })
              .returning();

            return created;
          }),
        )
      ).filter((i) => !!i);

      return {
        invitations: createdInvitations,
      };
    }),

  getTeamInvitation: protectedProcedure
    .input(getTeamInvitationInput)
    .query(async ({ ctx, input }) => {
      const invitation = await ctx.db.query.invitations.findFirst({
        where: eq(invitations.id, input.id),
      });

      return {
        invitation,
      };
    }),

  updateTeamInvitation: protectedProcedure
    .input(updateTeamInvitationInput)
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(invitations)
        .set(input)
        .where(eq(invitations.id, input.id))
        .returning();

      return {
        invitation: updated,
      };
    }),

  deleteTeamInvitation: protectedProcedure
    .input(deleteTeamInvitationInput)
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .delete(invitations)
        .where(eq(invitations.id, input.id))
        .returning();

      return {
        invitation: deleted,
      };
    }),

  getTeamMember: protectedProcedure
    .input(getTeamMemberInput)
    .query(async ({ ctx, input }) => {
      const member = await ctx.db.query.teamMembers.findFirst({
        where: and(
          eq(teamMembers.teamId, input.teamId),
          eq(teamMembers.userId, input.userId),
        ),
        with: { user: true },
      });

      return {
        teamMember: member,
      };
    }),

  createTeamMember: protectedProcedure
    .input(createTeamMemberInput)
    .mutation(async ({ ctx, input }) => {
      const [created] = await ctx.db
        .insert(teamMembers)
        .values(input)
        .returning();

      return {
        teamMember: created,
      };
    }),

  updateTeamMember: protectedProcedure
    .input(updateTeamMemberInput)
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(teamMembers)
        .set(input)
        .where(
          and(
            eq(teamMembers.teamId, input.teamId),
            eq(teamMembers.userId, input.userId),
          ),
        )
        .returning();

      return {
        teamMember: updated,
      };
    }),

  deleteTeamMember: protectedProcedure
    .input(deleteTeamMemberInput)
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .delete(teamMembers)
        .where(
          and(
            eq(teamMembers.teamId, input.teamId),
            eq(teamMembers.userId, input.userId),
          ),
        )
        .returning();

      return {
        teamMember: deleted,
      };
    }),
});

const whereIdOrSlug = (input: { id?: string; slug?: string }) => {
  const whereClause = input.id
    ? eq(teams.id, input.id)
    : input.slug
      ? eq(teams.slug, input.slug)
      : undefined;

  if (!whereClause) {
    throw new Error("Either ID or Slug must be provided");
  }

  return whereClause;
};
