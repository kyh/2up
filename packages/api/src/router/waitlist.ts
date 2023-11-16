import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const waitlistRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.waitlist.findMany();
  }),

  joinAccountWaitlist: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.waitlist.create({
        data: { data: { email: input.email } },
      });
    }),

  delete: protectedProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.db.waitlist.delete({
      where: { id: input },
    });
  }),
});
