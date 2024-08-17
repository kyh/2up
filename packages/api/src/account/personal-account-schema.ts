import { z } from "zod";

export const updatePictureInput = z.object({
  pictureUrl: z.string().url().nullable(),
});
export type UpdatePictureInput = z.infer<typeof updatePictureInput>;

export const updateAccountNameInput = z.object({
  name: z.string(),
});
export type UpdateAccountNameInput = z.infer<typeof updateAccountNameInput>;
