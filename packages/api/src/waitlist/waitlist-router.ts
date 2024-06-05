import { getSupabaseServerClient } from "@init/db/supabase-server-client";

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

  join: publicProcedure.input(joinWaitlistInput).mutation(async ({ input }) => {
    // We use the admin client here because the waitlist table is is available to the public
    const adminSupabase = getSupabaseServerClient({ admin: true });
    const response = await adminSupabase
      .from("waitlist")
      .insert([{ email: input.email }]);

    if (response.error) {
      throw response.error;
    }

    return response.data;
  }),
});
