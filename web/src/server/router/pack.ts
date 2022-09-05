import { z } from "zod";
import { t } from "~/server/trpc";

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
  getAll: t.procedure.query(({ ctx }) => ctx.prisma.pack.findMany()),
  getPack: t.procedure
    .input(z.object({ packId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.pack.findUnique({
        where: {
          id: input.packId,
        },
      });
    }),
});
