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

function groupByTags<T extends { tags: string[] | null }>(
  data: T[],
): { [key: string]: T[] } {
  const grouped: Record<string, T[]> = {};

  data.forEach((item) => {
    item.tags?.forEach((tag) => {
      if (!grouped[tag]) {
        grouped[tag] = [];
      }
      grouped[tag]?.push(item);
    });
  });

  return grouped;
}

export const packRouter = createTRPCRouter({
  discover: publicProcedure
    .input(z.object({ ref: z.string().optional() }).optional())
    .query(async ({ ctx, input }) => {
      const adminSupabase = getSupabaseServerClient({ admin: true });

      const sections =
        discoverMap[(input?.ref as keyof typeof discoverMap) || "default"];

      const response = await adminSupabase.from("packs").select();

      if (response.error) {
        throw response.error;
      }

      const packsByTag = groupByTags(response.data);

      return sections.map((section) => ({
        ...section,
        packs: section.tags.flatMap((tag) => packsByTag[tag]).filter(Boolean),
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
