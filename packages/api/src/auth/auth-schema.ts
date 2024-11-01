import { z } from "zod";

import type { User } from "@supabase/supabase-js";

export type { User };

export const signUpInput = z.object({
  email: z.string().email(),
  password: z.string(),
  inviteToken: z.string().optional(),
});
export type SignUpInput = z.infer<typeof signUpInput>;

export const signInWithPasswordInput = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type SignInWithPasswordInput = z.infer<typeof signInWithPasswordInput>;

export const signInWithOtpInput = z.object({
  email: z.string().email(),
});
export type SignInWithOtpInput = z.infer<typeof signInWithOtpInput>;

export const signInWithOAuthInput = z.object({
  provider: z.enum(["github"]),
});
export type SignInWithOAuthInput = z.infer<typeof signInWithOAuthInput>;

export const requestPasswordResetInput = z.object({
  email: z.string().email(),
});
export type RequestPasswordResetInput = z.infer<
  typeof requestPasswordResetInput
>;

export const updatePasswordInput = z.object({
  password: z.string(),
});
export type UpdatePasswordInput = z.infer<typeof updatePasswordInput>;

export const setSessionInput = z.object({
  refreshToken: z.string(),
  accessToken: z.string(),
});
export type SetSessionInput = z.infer<typeof setSessionInput>;
