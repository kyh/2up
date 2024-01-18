import { z } from "zod";

import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

export const teamRouter = createTRPCRouter({
  all: adminProcedure.query(({ ctx }) => {
    return ctx.db.team.findMany();
  }),

  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.db.team.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  create: protectedProcedure
    .input(z.object({ name: z.string(), slug: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.team.create({
        data: {
          name: input.name,
          slug: input.slug,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.team.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          slug: input.slug,
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.db.team.delete({
        where: {
          id: input.id,
        },
      });
    }),

  // inviteMembers: protectedProcedure
  //   .input(
  //     z.object({
  //       teamId: z.string(),
  //       members: z.array(
  //         z.object({ email: z.string().email(), role: z.string() }),
  //       ),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const result = await ctx.db.teamMemberInvite.createMany({
  //       data: input.members.map((member) => ({
  //         email: member.email,
  //         role: member.role,
  //         team: {
  //           connect: {
  //             id: input.teamId,
  //           },
  //         },
  //       })),
  //     });
  //   }),
});
