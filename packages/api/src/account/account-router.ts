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
      .select(`name, slug, picture_url`);

    if (userAccountsResponse.error) {
      throw userAccountsResponse.error;
    }

    const userWorkspaceResponse = await ctx.supabase
      .from("user_account_workspace")
      .select(`*`)
      .single();

    if (userWorkspaceResponse.error) {
      throw userWorkspaceResponse.error;
    }

    return {
      accounts: userAccountsResponse.data,
      workspace: userWorkspaceResponse.data,
      user: ctx.user,
    };
  }),
  byId: protectedProcedure.input(byIdInput).query(async ({ ctx, input }) => {
    const response = await ctx.supabase
      .from("accounts")
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
        .from("accounts")
        .select(
          `
            id,
            name,
            picture_url
        `,
        )
        .eq("primary_owner_user_id", input.id)
        .eq("is_personal_account", true)
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
        .from("accounts")
        .update({
          picture_url: input.pictureUrl,
        })
        .eq("id", input.accountId);

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),
});
