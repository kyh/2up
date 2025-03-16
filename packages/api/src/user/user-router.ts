import { getSupabaseAdminClient } from "@init/db/supabase-admin-client";
import { TRPCError } from "@trpc/server";

import {
  createTRPCRouter,
  protectedProcedure,
  superAdminProcedure,
} from "../trpc";
import {
  createUserInput,
  deleteUserInput,
  impersonateUserInput,
  updateUserInput,
} from "./user-schema";

export const userRouter = createTRPCRouter({
  updateUser: protectedProcedure
    .input(updateUserInput)
    .mutation(async ({ ctx, input }) => {
      const { id: _id, email: _email, ...metadata } = input;
      const response = await ctx.supabase.auth.updateUser({
        data: metadata,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),

  createUser: superAdminProcedure
    .input(createUserInput)
    .mutation(async ({ input }) => {
      const client = getSupabaseAdminClient();
      const { email, ...metadata } = input;

      const response = await client.auth.admin.createUser({
        email,
        user_metadata: metadata,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),

  deleteUser: superAdminProcedure
    .input(deleteUserInput)
    .mutation(async ({ input }) => {
      const client = getSupabaseAdminClient();

      const response = await client.auth.admin.deleteUser(input.id, true);

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),

  impersonateUser: superAdminProcedure
    .input(impersonateUserInput)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.id === input.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You cannot perform a destructive action on your own account as a Super Admin",
        });
      }
      const client = getSupabaseAdminClient();

      const {
        data: { user },
        error,
      } = await client.auth.admin.getUserById(input.id);

      if (error ?? !user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error fetching user",
        });
      }

      const email = user.email;

      if (!email) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User has no email. Cannot impersonate",
        });
      }

      const { error: linkError, data } = await client.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: {
          redirectTo: "/",
        },
      });

      if (linkError ?? !data) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Error generating magic link",
        });
      }

      const response = await fetch(data.properties.action_link, {
        method: "GET",
        redirect: "manual",
      });

      const location = response.headers.get("Location");

      if (!location) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "You cannot perform a destructive action on your own account as a Super Admin",
        });
      }

      const hash = new URL(location).hash.substring(1);
      const query = new URLSearchParams(hash);
      const accessToken = query.get("access_token");
      const refreshToken = query.get("refresh_token");

      if (!accessToken || !refreshToken) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Error generating magic link. Tokens not found in URL hash.",
        });
      }

      return {
        accessToken,
        refreshToken,
      };
    }),
});
