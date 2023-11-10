import { z } from "zod";

import { eq, schema } from "@2up/db";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const waitlistRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.waitlist.findMany();
  }),

  joinAccountWaitlist: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(schema.waitlist).values({
        data: { email: input.email },
      });
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.delete(schema.waitlist).where(eq(schema.waitlist.id, input));
  }),
});
