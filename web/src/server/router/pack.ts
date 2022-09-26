import { z } from "zod";
import { t, authedProcedure } from "~/server/trpc";

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

export const packRouter = t.router({
  getDiscover: t.procedure
    .input(z.object({ ref: z.string().nullish() }).nullish())
    .query(async ({ ctx, input }) => {
      const sections =
        discoverMap[(input?.ref as keyof typeof discoverMap) || "default"];

      const tagsWithPacks = await ctx.prisma.packTag.findMany({
        where: {
          name: {
            in: sections.flatMap((x) => x.tags),
          },
        },
        include: {
          packs: true,
        },
      });

      const tagMap = tagsWithPacks.reduce((acc, packTag) => {
        if (!acc[packTag.name]) acc[packTag.name] = [];
        acc[packTag.name].push(...packTag.packs);
        return acc;
      }, {} as { [key: string]: typeof tagsWithPacks[0]["packs"] });

      return sections.map((section) => ({
        ...section,
        packs: section.tags.flatMap((tag) => tagMap[tag]).filter(Boolean),
      }));
    }),
  getAll: t.procedure
    .input(
      z.object({
        userId: z.string().optional(),
        username: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      let userId = input.userId;

      if (input.username) {
        const profile = await ctx.prisma.profile.findUnique({
          where: {
            username: input.username,
          },
        });
        userId = profile?.userId;
      }

      return ctx.prisma.pack.findMany({ where: { userId } });
    }),
  get: t.procedure
    .input(z.object({ packId: z.string(), withScenes: z.boolean().optional() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.pack.findUnique({
        where: {
          id: input.packId,
        },
        include: {
          scenes: input.withScenes,
        },
      });
    }),
  create: authedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        isRandom: z.boolean(),
        length: z.number(),
        tags: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.pack.create({
        data: {
          name: input.name,
          description: input.description,
          isRandom: input.isRandom,
          userId: ctx.user.id,
          tags: {
            connectOrCreate: input.tags.map((tag) => ({
              where: { name: tag },
              create: { name: tag },
            })),
          },
        },
      });
    }),
  update: authedProcedure
    .input(z.object({ packId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return;
    }),
  delete: authedProcedure
    .input(z.object({ packId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return;
    }),
});
