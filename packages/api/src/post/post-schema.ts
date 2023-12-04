import { z } from "zod";

export const postByIdInput = z.object({ id: z.string() });

export const postCreateInput = z.object({
  title: z.string(),
  content: z.string(),
});

export const postDeleteInput = z.object({ id: z.string() });
