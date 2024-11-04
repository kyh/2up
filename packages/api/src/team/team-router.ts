import { and, asc, desc, eq, sql } from "@init/db";
import { invitations, teamMembers, teams } from "@init/db/schema";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  createTeamInput,
  createTeamMemberInput,
  deleteTeamInput,
  getTeamInput,
  updateTeamInput,
} from "./team-schema";

export const teamRouter = createTRPCRouter({
  getMyTeams: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return { teams: [] };

    const teamMembers = await ctx.db.query.teamMembers.findMany({
      where: (teamMembers, { eq }) =>
        eq(teamMembers.userId, ctx.user?.id ?? ""),
      with: {
        team: true,
      },
    });

    return {
      teams: teamMembers.map((tm) => tm.team),
    };
  }),

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

  addMember: protectedProcedure
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

  getTeam: protectedProcedure
    .input(getTeamInput)
    .query(async ({ ctx, input }) => {
      const whereClause = whereIdOrSlug(input);
      const team = await ctx.db.query.teams.findFirst({
        where: whereClause,
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
