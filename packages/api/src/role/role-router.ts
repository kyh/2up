import { createTRPCRouter, protectedProcedure } from "../trpc";
import { retrieveInput } from "./role-schema";

export const roleRouter = createTRPCRouter({
  retrieve: protectedProcedure
    .input(retrieveInput)
    .query(async ({ ctx, input }) => {
      const response = await ctx.supabase
        .from("Roles")
        .select("name")
        .gte("hierarchyLevel", input.maxRoleHierarchy)
        .order("hierarchyLevel", { ascending: true });

      if (response.error) {
        throw response.error;
      }

      return response.data.map((item) => item.name);
    }),
});
