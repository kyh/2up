import {
  createTRPCRouter,
  publicProcedure,
  superAdminProcedure,
} from "../trpc";
import { joinWaitlistInput } from "./waitlist-schema";

export const waitlistRouter = createTRPCRouter({
  all: superAdminProcedure.query(({ ctx }) => {
    return ctx.supabase.from("Waitlist").select("*");
  }),

  join: publicProcedure
    .input(joinWaitlistInput)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.adminSupabase
        .from("Waitlist")
        .insert({ email: input.email });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),
});
