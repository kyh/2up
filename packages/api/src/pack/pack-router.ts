import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { discoverInput, getDiscoverSection } from "./pack-schema";

export const packRouter = createTRPCRouter({
  discover: publicProcedure
    .input(discoverInput)
    .query(async ({ ctx, input }) => {
      const sections = getDiscoverSection(input?.ref);
      const response = await ctx.supabase.from("Packs").select();

      if (response.error) {
        throw response.error;
      }

      const packsByTag = response.data.reduce(
        (grouped, item) => {
          item.tags?.forEach((tag) => {
            if (!grouped[tag]) {
              grouped[tag] = [];
            }
            grouped[tag].push(item);
          });
          return grouped;
        },
        {} as Record<string, typeof response.data>,
      );

      return sections.map((section) => ({
        ...section,
        packs: section.tags.flatMap((tag) => packsByTag[tag]).filter(Boolean),
      }));
    }),

  all: publicProcedure.query(async ({ ctx, input }) => {
    return;
  }),

  byId: publicProcedure.query(async ({ ctx, input }) => {
    return;
  }),

  create: protectedProcedure.mutation(async ({ ctx, input }) => {
    return;
  }),

  update: protectedProcedure.mutation(async ({ ctx, input }) => {
    return;
  }),

  delete: protectedProcedure.mutation(() => {
    return;
  }),
});
