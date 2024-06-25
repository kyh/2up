import { z } from "zod";

export const getAccountInput = z.object({
  accountId: z.string(),
});

export const getAccountsInput = z.object({
  page: z.string().optional(),
  per_page: z.string().optional(),
  account_type: z.enum(["all", "team", "personal"]).optional(),
  query: z.string().optional(),
});
export type GetAccountsInput = z.infer<typeof getAccountsInput>;

export const getUserByIdInput = z.object({
  accountId: z.string().uuid(),
});

export const deleteAccountInput = z.object({
  accountId: z.string().uuid(),
});

export const deleteUserInput = z.object({
  userId: z.string().uuid(),
});

export const impersonateUserInput = z.object({
  userId: z.string().uuid(),
});

export const getMembersInput = z.object({
  accountSlug: z.string(),
});

export const getMembershipsInput = z.object({
  userId: z.string().uuid(),
});

export const getSubscriptionInput = z.object({
  accountId: z.string().uuid(),
});

export const banUserInput = z.object({
  userId: z.string().uuid(),
});

export const reactivateUserInput = z.object({
  userId: z.string().uuid(),
});
