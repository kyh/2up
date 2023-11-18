import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

const discoverMap = {
  producthunt: [
    { title: "Packs for you", tags: ["product"] },
    { title: "Featured Packs", tags: ["code"] },
    { title: "Learn your geography", tags: ["geography"] },
    { title: "Trending now", tags: ["crypto"] },
  ],
  devto: [
    { title: "Packs for you", tags: ["code"] },
    { title: "Top played", tags: ["crypto"] },
    { title: "Learn your geography", tags: ["geography"] },
    { title: "Trending now", tags: ["product"] },
  ],
  default: [
    { title: "Featured Packs", tags: ["featured"] },
    { title: "For the hackers", tags: ["code"] },
    { title: "Trending now", tags: ["product", "crypto"] },
    { title: "Learn your geography", tags: ["geography"] },
  ],
};

const packModel = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  isRandom: z.boolean(),
  gameLength: z.number(),
  tags: z.array(z.string()),
});

export const packRouter = createTRPCRouter({
  getDiscover: publicProcedure
    .input(z.object({ ref: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const sections =
        discoverMap[(input?.ref as keyof typeof discoverMap) || "default"];

      const tagsWithPacks = await ctx.db.packTag.findMany({
        where: {
          name: {
            in: sections.flatMap((x) => x.tags),
          },
        },
        include: {
          packs: true,
        },
      });

      type PackList = (typeof tagsWithPacks)[0]["packs"];

      const tagMap = tagsWithPacks.reduce(
        (acc, packTag) => {
          if (!acc[packTag.name]) acc[packTag.name] = [];
          acc[packTag.name]?.push(...packTag.packs);
          return acc;
        },
        {} as Record<string, PackList>,
      );

      return sections.map((section) => ({
        ...section,
        packs: section.tags
          .flatMap((tag) => tagMap[tag])
          .filter(Boolean) as PackList,
      }));
    }),

  getAll: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        username: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      let userId = input.userId;

      if (input.username) {
        const user = await ctx.db.user.findUnique({
          where: {
            username: input.username,
          },
        });
        userId = user?.id;
      }

      return ctx.db.pack.findMany({ where: { userId } });
    }),

  get: publicProcedure
    .input(
      z.object({
        id: z.string(),
        withScenes: z.boolean().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.pack.findUnique({
        where: {
          id: input.id,
        },
        include: {
          tags: true,
          scenes: input.withScenes
            ? {
                include: {
                  answers: true,
                },
              }
            : false,
        },
      });
    }),

  create: protectedProcedure
    .input(packModel)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.pack.create({
        data: {
          name: input.name,
          description: input.description,
          isRandom: input.isRandom,
          userId: ctx.session.user.id,
          tags: {
            connectOrCreate: input.tags.map((tag) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        },
      });
    }),

  update: protectedProcedure
    .input(packModel)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.pack.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          description: input.description,
          isRandom: input.isRandom,
          userId: ctx.session.user.id,
          tags: {
            connectOrCreate: input.tags.map((tag) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(() => {
      return;
    }),
});
