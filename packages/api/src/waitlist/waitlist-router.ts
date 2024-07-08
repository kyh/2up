import {
  createTRPCRouter,
  publicProcedure,
  superAdminProcedure,
} from "../trpc";
import { joinWaitlistInput } from "./waitlist-schema";

export const waitlistRouter = createTRPCRouter({
  all: superAdminProcedure.query(({ ctx }) => {
    return ctx.supabase.from("waitlist").select("*");
  }),

  join: publicProcedure
    .input(joinWaitlistInput)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.adminSupabase
        .from("waitlist")
        .insert({ email: input.email });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),
});
