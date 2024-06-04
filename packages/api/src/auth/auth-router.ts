import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  requestPasswordResetInput,
  signInWithOAuthInput,
  signInWithOtpInput,
  signInWithPasswordInput,
  signUpInput,
  updatePasswordInput,
} from "./auth-schema";

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(signUpInput)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.supabase.auth.signUp({
        ...input,
      });

      if (response.error) {
        throw response.error.message;
      }

      const user = response.data.user;
      const identities = user?.identities ?? [];

      // if the user has no identities, it means that the email is taken
      if (identities.length === 0) {
        throw new Error("User already registered");
      }

      return response.data;
    }),
  signInWithPassword: publicProcedure
    .input(signInWithPasswordInput)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.supabase.auth.signInWithPassword(input);

      if (response.error) {
        throw response.error.message;
      }

      return response.data;
    }),
  signInWithOtp: publicProcedure
    .input(signInWithOtpInput)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.supabase.auth.signInWithOtp(input);

      if (response.error) {
        throw response.error.message;
      }

      return response.data;
    }),
  signInWithOAuth: publicProcedure
    .input(signInWithOAuthInput)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.supabase.auth.signInWithOAuth(input);

      if (response.error) {
        throw response.error.message;
      }

      return response.data;
    }),
  signOut: protectedProcedure.mutation(async ({ ctx }) => {
    return;
  }),
  requestPasswordReset: publicProcedure
    .input(requestPasswordResetInput)
    .mutation(async ({ ctx }) => {
      return;
    }),
  updatePassword: publicProcedure
    .input(updatePasswordInput)
    .mutation(async ({ ctx }) => {
      return;
    }),
  mfaFactors: protectedProcedure.query(async ({ ctx }) => {
    return;
  }),
});
