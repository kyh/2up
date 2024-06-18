import { getSupabaseServerClient } from "@2up/db/supabase-server-client";
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

export const packRouter = createTRPCRouter({
  discover: publicProcedure
    .input(z.object({ ref: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const sections =
        discoverMap[(input?.ref as keyof typeof discoverMap) || "default"];

      const response = await ctx.adminSupabase.from("packs").select();

      if (response.error) {
        throw response.error;
      }

      const packsByTag = response.data.reduce(
        (grouped, item) => {
          item.tags?.forEach((tag) => {
            if (!grouped[tag]) {
              grouped[tag] = [];
            }
            grouped[tag]?.push(item);
          });
          return grouped;
        },
        {} as Record<string, typeof response.data>,
      );

      return sections.map((section) => ({
        ...section,
        packs: section.tags
          .flatMap((tag) => packsByTag[tag])
          .filter(Boolean) as typeof response.data,
      }));
    }),

  all: publicProcedure.query(async ({ ctx, input }) => {
    const response = await ctx.supabase.from("packs").select();

    if (response.error) {
      throw response.error;
    }

    return response.data;
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

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(() => {
      return;
    }),
});
