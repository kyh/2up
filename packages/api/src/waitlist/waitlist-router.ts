import { and, asc, desc, eq, sql } from "@init/db";
import { waitlist } from "@init/db/schema";

import type { SQL } from "@init/db";
import {
  createTRPCRouter,
  publicProcedure,
  superAdminProcedure,
} from "../trpc";
import {
  getWaitlistInput,
  getWaitlistsInput,
  joinWaitlistInput,
} from "./waitlist-schema";

export const waitlistRouter = createTRPCRouter({
  join: publicProcedure
    .input(joinWaitlistInput)
    .mutation(async ({ ctx, input }) => {
      return ctx.db
        .insert(waitlist)
        .values({
          ...input,
          userId: ctx.user?.id,
        })
        .returning();
    }),

  getWaitlist: superAdminProcedure
    .input(getWaitlistInput)
    .query(async ({ ctx, input }) => {
      return ctx.db.query.waitlist.findFirst({
        where: (waitlist, { eq }) => eq(waitlist.id, input.id),
      });
    }),
  getWaitlists: superAdminProcedure
    .input(getWaitlistsInput)
    .query(async ({ ctx, input }) => {
      // Convert page and perPage to numbers
      const pageNum = parseInt(input.page);
      const perPageNum = parseInt(input.perPage);
      const offset = (pageNum - 1) * perPageNum;

      // Build where conditions
      const whereConditions: SQL[] = [];
      input.filter?.forEach((filter) => {
        whereConditions.push(eq(waitlist[filter.field], filter.value));
      });

      // Build order by configuration
      const orderBy = input.sort.map((sortItem) => {
        const column = waitlist[sortItem.field];
        return sortItem.direction === "asc" ? asc(column) : desc(column);
      });

      // Execute query
      const results = await ctx.db.query.waitlist.findMany({
        where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
        orderBy: orderBy,
        limit: perPageNum,
        offset: offset,
      });

      // Get total count
      const [total] = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(waitlist)
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
});
