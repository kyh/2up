import { z } from "zod";

import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const waitlistRouter = createTRPCRouter({
  all: adminProcedure.query(({ ctx }) => {
    return ctx.db.waitlist.findMany();
  }),

  join: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.waitlist.create({
        data: {
          email: input.email,
        },
      });
    }),
});
