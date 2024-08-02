import { z } from "zod";

export const retrieveRoleInput = z.object({
  maxRoleHierarchy: z.number().default(1),
});
