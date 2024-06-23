import { z } from "zod";

export const checkInput = z.object({ gameCode: z.string() });
export type CheckInput = z.infer<typeof checkInput>;

export const createInput = z.object({ packId: z.string() });
export type CreateInput = z.infer<typeof createInput>;
