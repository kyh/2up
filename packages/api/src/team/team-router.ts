import { and, asc, desc, eq, sql } from "@init/db";
import { invitations, teamMembers, teams } from "@init/db/schema";

import type { SQL } from "@init/db";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  createTeamInput,
  createTeamMemberInput,
  deleteTeamInput,
  deleteTeamsInput,
  getTeamInput,
  getTeamsInput,
  updateTeamInput,
  updateTeamsInput,
} from "./team-schema";

export const teamRouter = createTRPCRouter({
  getMyTeams: publicProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return [];

    const teamMembers = await ctx.db.query.teamMembers.findMany({
      where: (teamMembers, { eq }) =>
        eq(teamMembers.userId, ctx.user?.id ?? ""),
      with: {
        team: true,
      },
    });

    return teamMembers.map((tm) => tm.team);
  }),

  createTeam: protectedProcedure
    .input(createTeamInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(teams).values(input).returning();
    }),

  addMember: protectedProcedure
    .input(createTeamMemberInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.insert(teamMembers).values(input).returning();
    }),

  getTeam: protectedProcedure
    .input(getTeamInput)
    .query(async ({ ctx, input }) => {
      return ctx.db.query.teams.findFirst({
        where: (teams, { eq }) => eq(teams.id, input.id),
      });
    }),

  updateTeam: protectedProcedure
    .input(updateTeamInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .update(teams)
        .set(input)
        .where(eq(teams.id, input.id))
        .returning();
    }),

  deleteTeam: protectedProcedure
    .input(deleteTeamInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.delete(teams).where(eq(teams.id, input.id)).returning();
    }),
});
