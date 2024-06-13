import { createTRPCRouter, protectedProcedure } from "../trpc";
import { retrieveInput } from "./role-schema";

export const roleRouter = createTRPCRouter({
  retrieve: protectedProcedure
    .input(retrieveInput)
    .query(async ({ ctx, input }) => {
      const response = await ctx.supabase
        .from("roles")
        .select("name")
        .gte("hierarchy_level", input.maxRoleHierarchy)
        .order("hierarchy_level", { ascending: true });

      if (response.error) {
        throw response.error;
      }

      return response.data.map((item) => item.name);
    }),
});
