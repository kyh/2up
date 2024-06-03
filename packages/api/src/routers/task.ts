import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const taskRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return;
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return;
    }),

  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(({ ctx, input }) => {
      return;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string(),
        completed: z.boolean(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return;
    }),
});
