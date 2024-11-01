import { and, asc, desc, eq, sql } from "@init/db";
import { invitations, teamMembers, teams } from "@init/db/schema";

import type { CreateTeamInput, CreateTeamMemberInput } from "./team-schema";
import type { SQL } from "@init/db";
import type { Db } from "@init/db/client";
import { createTRPCRouter, protectedProcedure } from "../trpc";
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

export const createTeam = async (db: Db, input: CreateTeamInput) => {
  const [result] = await db.insert(teams).values(input).returning();
  if (!result) throw new Error("Failed to create team");
  return result;
};

export const addMember = async (db: Db, input: CreateTeamMemberInput) => {
  const [result] = await db.insert(teamMembers).values(input).returning();
  if (!result) throw new Error("Failed to add member");
  return result;
};

export const teamRouter = createTRPCRouter({
  createTeam: protectedProcedure
    .input(createTeamInput)
    .mutation(async ({ ctx, input }) => {
      return createTeam(ctx.db, input);
    }),

  addMember: protectedProcedure
    .input(createTeamMemberInput)
    .mutation(async ({ ctx, input }) => {
      return addMember(ctx.db, input);
    }),

  getTeam: protectedProcedure
    .input(getTeamInput)
    .query(async ({ ctx, input }) => {
      return ctx.db.query.teams.findFirst({
        where: (teams, { eq }) => eq(teams.id, input.id),
      });
    }),
  getTeams: protectedProcedure
    .input(getTeamsInput)
    .query(async ({ ctx, input }) => {
      // Convert page and perPage to numbers
      const pageNum = parseInt(input.page);
      const perPageNum = parseInt(input.perPage);
      const offset = (pageNum - 1) * perPageNum;

      // Build where conditions
      const whereConditions: SQL[] = [];
      input.filter?.forEach((filter) => {
        whereConditions.push(eq(teams[filter.field], filter.value));
      });

      // Build order by configuration
      const orderBy = input.sort.map((sortItem) => {
        const column = teams[sortItem.field];
        return sortItem.direction === "asc" ? asc(column) : desc(column);
      });

      // Execute query
      const results = await ctx.db.query.teams.findMany({
        where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
        orderBy: orderBy,
        limit: perPageNum,
        offset: offset,
      });

      // Get total count
      const [total] = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(teams)
        .where(
          whereConditions.length > 0 ? and(...whereConditions) : undefined,
        );
      const count = total?.count ?? 0;

      return {
        data: results,
        pagination: {
          total: count,
          page: pageNum,
          perPage: perPageNum,
          totalPages: Math.ceil(count / perPageNum),
        },
      };
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
