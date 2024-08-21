import { z } from "zod";

export const getRoleInput = z.object({
  maxRoleHierarchy: z.number().default(1),
});
export type getRoleInput = z.infer<typeof getRoleInput>;
