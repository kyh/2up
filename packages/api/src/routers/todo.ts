import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const todoRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.todo.findMany();
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.todo.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  create: protectedProcedure
    .input(z.object({ content: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.todo.create({
        data: {
          content: input.content,
        },
      });
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
      return ctx.db.todo.update({
        where: {
          id: input.id,
        },
        data: {
          content: input.content,
          completed: input.completed,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.todo.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
