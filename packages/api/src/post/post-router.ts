import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { postByIdInput, postCreateInput, postDeleteInput } from "./post-schema";

export const postRouter = createTRPCRouter({
  all: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findMany();
  }),

  byId: publicProcedure.input(postByIdInput).query(({ ctx, input }) => {
    return ctx.db.post.findUnique({
      where: {
        id: input.id,
      },
    });
  }),

  create: protectedProcedure
    .input(postCreateInput)
    .mutation(({ ctx, input }) => {
      return ctx.db.post.create({
        data: {
          title: input.title,
          content: input.content,
        },
      });
    }),

  delete: protectedProcedure
    .input(postDeleteInput)
    .mutation(({ ctx, input }) => {
      return ctx.db.post.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
