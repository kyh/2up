import { z } from "zod";

import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "../trpc";

export const userRouter = createTRPCRouter({
  all: adminProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .$queryRaw`SELECT email, raw_user_meta_data FROM auth.users;`;

    return result;
  }),

  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const result = await ctx.db
        .$queryRaw`SELECT email, raw_user_meta_data FROM auth.users WHERE id = ${input.id};`;

      return result;
    }),

  create: adminProcedure
    .input(z.object({ email: z.string().email(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { error, data } = await ctx.supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          emailRedirectTo: `${ctx.headers.get("origin")}/auth/callback`,
        },
      });

      if (error) throw error;

      return data.user;
    }),

  updateMetadata: protectedProcedure
    .input(
      z.object({
        admin: z.boolean().optional(),
        image: z.string().optional(),
        onboarded: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.user_metadata?.admin && input.admin) {
        throw new Error("Only admins can set the admin flag");
      }

      const { data, error } = await ctx.supabase.auth.updateUser({
        data: {
          ...ctx.user.user_metadata,
          ...input,
        },
      });

      if (error) throw error;

      return data.user;
    }),

  updateEmail: protectedProcedure
    .input(
      z.object({
        email: z.string().email(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase.auth.updateUser({
        email: input.email,
      });

      if (error) throw error;

      return data.user;
    }),

  updatePassword: protectedProcedure
    .input(
      z.object({
        password: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { data, error } = await ctx.supabase.auth.updateUser({
        password: input.password,
      });

      if (error) throw error;

      return data.user;
    }),
});
