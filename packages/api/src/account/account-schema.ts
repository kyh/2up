import { z } from "zod";

export const byIdInput = z.object({
  id: z.string(),
});
export type ByIdInput = z.infer<typeof byIdInput>;

export const personalAccountInput = z.object({
  id: z.string(),
});

export const updatePictureInput = z.object({
  accountId: z.string(),
  pictureUrl: z.string().url().nullable(),
});
