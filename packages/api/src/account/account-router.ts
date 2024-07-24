import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  byIdInput,
  personalAccountInput,
  updatePictureInput,
} from "./account-schema";

export const accountRouter = createTRPCRouter({
  me: publicProcedure.query(async ({ ctx }) => {
    return ctx.user;
  }),
  userWorkspace: protectedProcedure.query(async ({ ctx }) => {
    const userAccountsResponse = await ctx.supabase
      .from("user_accounts")
      .select("*");

    if (userAccountsResponse.error) {
      throw userAccountsResponse.error;
    }

    const userWorkspaceResponse = await ctx.supabase
      .from("user_account_workspace")
      .select("*")
      .single();

    if (userWorkspaceResponse.error) {
      throw userWorkspaceResponse.error;
    }

    return {
      workspace: userWorkspaceResponse.data,
      accounts: userAccountsResponse.data,
      user: ctx.user,
    };
  }),
  byId: protectedProcedure.input(byIdInput).query(async ({ ctx, input }) => {
    const response = await ctx.supabase
      .from("Accounts")
      .select("*")
      .eq("id", input.id)
      .single();

    if (response.error) {
      throw response.error;
    }

    return response.data;
  }),
  personalAccount: protectedProcedure
    .input(personalAccountInput)
    .query(async ({ ctx, input }) => {
      const response = await ctx.supabase
        .from("Accounts")
        .select("*")
        .eq("primaryOwnerUserId", input.id)
        .eq("isPersonalAccount", true)
        .single();

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),
  updatePicture: protectedProcedure
    .input(updatePictureInput)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.supabase
        .from("Accounts")
        .update({
          pictureUrl: input.pictureUrl,
        })
        .eq("id", input.accountId);

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),
});
