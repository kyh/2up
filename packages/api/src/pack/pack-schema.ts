import { z } from "zod";

export const discoverInput = z
  .object({ ref: z.string().optional() })
  .optional();
export type DiscoverInput = z.infer<typeof discoverInput>;

export type DiscoverSection = {
  title: string;
  tags: string[];
};

/**
 * Map of input ref's to sections shown on the discover page
 */
export const discoverMap: Record<string, DiscoverSection[]> = {
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

export const getDiscoverSection = (ref?: string) => {
  return discoverMap[ref ?? "default"]!;
};
