import { getSupabaseRouteHandlerClient } from "@init/db/clients/route-handler.client";
import { z } from "zod";

import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";

export const waitlistRouter = createTRPCRouter({
  all: adminProcedure.query(({ ctx }) => {
    return ctx.supabase.from("waitlist").select("*");
  }),

  join: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      // We use the admin client here because the waitlist table is is the only public table
      const adminSupabase = getSupabaseRouteHandlerClient({ admin: true });
      return adminSupabase.from("waitlist").insert([{ email: input.email }]);
    }),
});
