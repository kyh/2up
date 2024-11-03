import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  requestPasswordResetInput,
  setSessionInput,
  signInWithOAuthInput,
  signInWithOtpInput,
  signInWithPasswordInput,
  signUpInput,
  updatePasswordInput,
} from "./auth-schema";

export const authRouter = createTRPCRouter({
  me: publicProcedure.query(({ ctx }) => {
    return { user: ctx.user };
  }),
  signUp: publicProcedure
    .input(signUpInput)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.supabase.auth.signUp({
        ...input,
      });

      if (response.error) {
        throw response.error;
      }

      const user = response.data.user;
      const identities = user?.identities ?? [];

      // if the user has no identities, it means that the email is taken
      if (identities.length === 0) {
        throw new Error("User already registered");
      }

      if (!user) {
        throw new Error("Unable to create user");
      }

      return { user };
    }),
  signInWithPassword: publicProcedure
    .input(signInWithPasswordInput)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.supabase.auth.signInWithPassword(input);

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),
  signInWithOtp: publicProcedure
    .input(signInWithOtpInput)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.supabase.auth.signInWithOtp(input);

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),
  signInWithOAuth: publicProcedure
    .input(signInWithOAuthInput)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.supabase.auth.signInWithOAuth(input);

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),
  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    const response = await ctx.supabase.auth.signOut();

    if (response.error) {
      throw response.error;
    }

    return { success: true };
  }),
  requestPasswordReset: publicProcedure
    .input(requestPasswordResetInput)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.supabase.auth.resetPasswordForEmail(
        input.email,
      );

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),
  updatePassword: protectedProcedure
    .input(updatePasswordInput)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.supabase.auth.updateUser(input);

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),
  mfaFactors: protectedProcedure.query(async ({ ctx }) => {
    const response = await ctx.supabase.auth.mfa.listFactors();

    if (response.error) {
      throw response.error;
    }

    return response.data;
  }),
  setSession: protectedProcedure
    .input(setSessionInput)
    .mutation(async ({ ctx, input }) => {
      const signOutResponse = await ctx.supabase.auth.signOut();

      if (signOutResponse.error) {
        throw signOutResponse.error;
      }

      const setSessionResponse = await ctx.supabase.auth.setSession({
        refresh_token: input.refreshToken,
        access_token: input.accessToken,
      });

      if (setSessionResponse.error) {
        throw setSessionResponse.error;
      }

      return setSessionResponse.data;
    }),
});
