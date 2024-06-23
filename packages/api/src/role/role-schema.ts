import { z } from "zod";

export const retrieveInput = z.object({
  maxRoleHierarchy: z.number().default(1),
});
