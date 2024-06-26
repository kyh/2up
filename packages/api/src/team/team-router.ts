import { addDays, formatISO } from "date-fns";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  createTeamAccountInput,
  deleteInvitationInput,
  deleteTeamAccountInput,
  invitationsInput,
  leaveTeamAccountInput,
  membersInput,
  removeMemberInput,
  renewInvitationInput,
  sendInvitationsInput,
  teamWorkspaceInput,
  transferOwnershipInput,
  updateInvitationInput,
  updateMemberRoleInput,
  updateTeamAccountNameInput,
} from "./team-schema";

export const teamRouter = createTRPCRouter({
  teamWorkspace: protectedProcedure
    .input(teamWorkspaceInput)
    .query(async ({ ctx, input }) => {
      const response = await ctx.supabase.rpc("team_account_workspace", {
        account_slug: input.slug,
      });

      if (response.error) {
        throw response.error;
      }

      return {
        account: response.data[0],
        user: ctx.user,
      };
    }),

  createTeamAccount: protectedProcedure
    .input(createTeamAccountInput)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.supabase.rpc("create_team_account", {
        account_name: input.name,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),

  updateTeamAccountName: protectedProcedure
    .input(updateTeamAccountNameInput)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.supabase
        .from("accounts")
        .update({
          name: input.name,
          slug: input.slug,
        })
        .match({
          slug: input.slug,
        })
        .select("slug")
        .single();

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),

  deleteTeamAccount: protectedProcedure
    .input(deleteTeamAccountInput)
    .mutation(async ({ ctx, input }) => {
      const accountResponse = await ctx.supabase
        .from("accounts")
        .select("id")
        .eq("primary_owner_user_id", ctx.user.id)
        .eq("is_personal_account", false)
        .eq("id", input.accountId);

      if (accountResponse.error ?? !accountResponse.data) {
        throw new Error("Account not found");
      }

      const deleteResponse = await ctx.adminSupabase
        .from("accounts")
        .delete()
        .eq("id", input.accountId);

      if (deleteResponse.error) {
        throw deleteResponse.error;
      }

      return deleteResponse.data;
    }),

  leaveTeamAccount: protectedProcedure
    .input(leaveTeamAccountInput)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.adminSupabase
        .from("accounts_memberships")
        .delete()
        .match({
          account_id: input.accountId,
          user_id: ctx.user.id,
        });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),

  members: protectedProcedure
    .input(membersInput)
    .query(async ({ ctx, input }) => {
      const response = await ctx.supabase.rpc("get_account_members", {
        account_slug: input.slug,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data ?? [];
    }),

  invitations: protectedProcedure
    .input(invitationsInput)
    .query(async ({ ctx, input }) => {
      const response = await ctx.supabase.rpc("get_account_invitations", {
        account_slug: input.slug,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data ?? [];
    }),

  removeMember: protectedProcedure
    .input(removeMemberInput)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.supabase
        .from("accounts_memberships")
        .delete()
        .match({
          account_id: input.accountId,
          user_id: input.userId,
        });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),

  updateMemberRole: protectedProcedure
    .input(updateMemberRoleInput)
    .mutation(async ({ ctx, input }) => {
      const { data: canActionAccountMember, error: accountError } =
        await ctx.supabase.rpc("can_action_account_member", {
          target_user_id: input.userId,
          target_team_account_id: input.accountId,
        });

      if (accountError ?? !canActionAccountMember) {
        throw new Error(`Failed to validate permissions to update member role`);
      }

      const response = await ctx.adminSupabase
        .from("accounts_memberships")
        .update({
          account_role: input.role,
        })
        .match({
          account_id: input.accountId,
          user_id: input.userId,
        });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),

  transferOwnership: protectedProcedure
    .input(transferOwnershipInput)
    .mutation(async ({ ctx, input }) => {
      const { data: isOwner, error } = await ctx.supabase.rpc(
        "is_account_owner",
        {
          account_id: input.accountId,
        },
      );

      if (error ?? !isOwner) {
        throw new Error(
          `You must be the owner of the account to transfer ownership`,
        );
      }

      const response = await ctx.adminSupabase.rpc(
        "transfer_team_account_ownership",
        {
          target_account_id: input.accountId,
          new_owner_id: input.userId,
        },
      );

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),

  sendInvitations: protectedProcedure
    .input(sendInvitationsInput)
    .mutation(async ({ ctx, input }) => {
      const accountResponse = await ctx.supabase
        .from("accounts")
        .select("name")
        .eq("slug", input.accountSlug)
        .single();

      if (!accountResponse.data) {
        throw new Error("Account not found");
      }

      const response = await ctx.supabase.rpc("add_invitations_to_account", {
        invitations: input.invitations,
        account_slug: input.accountSlug,
      });

      if (response.error) {
        throw response.error;
      }

      const responseInvitations = Array.isArray(response.data)
        ? response.data
        : [response.data];

      return responseInvitations;
    }),

  updateInvitation: protectedProcedure
    .input(updateInvitationInput)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.supabase
        .from("invitations")
        .update({
          role: input.role,
        })
        .match({
          id: input.invitationId,
        });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),

  renewInvitation: protectedProcedure
    .input(renewInvitationInput)
    .mutation(async ({ ctx, input }) => {
      const sevenDaysFromNow = formatISO(addDays(new Date(), 7));

      const response = await ctx.supabase
        .from("invitations")
        .update({
          expires_at: sevenDaysFromNow,
        })
        .match({
          id: input.invitationId,
        });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),

  deleteInvitation: protectedProcedure
    .input(deleteInvitationInput)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.supabase.from("invitations").delete().match({
        id: input.invitationId,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),
});
