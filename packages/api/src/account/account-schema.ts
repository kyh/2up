import { z } from "zod";

export const byIdInput = z.object({
  id: z.string(),
});
export type ByIdInput = z.infer<typeof byIdInput>;
