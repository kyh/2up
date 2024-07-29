import { z } from "zod";

export const updatePictureInput = z.object({
  accountId: z.string(),
  pictureUrl: z.string().url().nullable(),
});
