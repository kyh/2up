import { createTRPCRouter, superAdminProcedure } from "../trpc";
import {
  banUserInput,
  deleteAccountInput,
  deleteUserInput,
  getAccountInput,
  getAccountsInput,
  getMembershipsInput,
  getMembersInput,
  getSubscriptionInput,
  getUserByIdInput,
  impersonateUserInput,
  reactivateUserInput,
} from "./admin-schema";

export const adminRouter = createTRPCRouter({
  getAccount: superAdminProcedure
    .input(getAccountInput)
    .query(async ({ ctx, input }) => {
      const response = await ctx.adminSupabase
        .from("accounts")
        .select("*, memberships: accounts_memberships (*)")
        .eq("id", input.accountId)
        .single();

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),
  getAccounts: superAdminProcedure
    .input(getAccountsInput)
    .query(async ({ ctx, input }) => {
      const page = parseInt(input.page);
      const perPage = parseInt(input.per_page);
      const offset = (page - 1) * perPage;

      let query = ctx.adminSupabase
        .from("accounts")
        .select("*", { count: "exact" })
        .limit(perPage)
        .range(offset, offset + perPage - 1);

      if (input.account_type && input.account_type !== "all") {
        query = query.eq(
          "is_personal_account",
          input.account_type === "personal",
        );
      }

      if (input.query) {
        query = query.like("name", `%${input.query}%`);
      }

      const response = await query;

      if (response.error) {
        throw response.error;
      }

      const pageCount = Math.ceil((response.count ?? 0) / perPage);

      return { data: response.data, pageCount };
    }),
  getUserById: superAdminProcedure
    .input(getUserByIdInput)
    .query(async ({ ctx, input }) => {
      const response = await ctx.adminSupabase.auth.admin.getUserById(
        input.accountId,
      );

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),
  getDashboardData: superAdminProcedure.mutation(async ({ ctx }) => {
    const selectParams: {
      head?: boolean;
      count?: "exact" | "estimated" | "planned";
    } = {
      count: "estimated",
      head: true,
    };

    const subscriptionsPromise = ctx.adminSupabase
      .from("subscriptions")
      .select("*", selectParams)
      .eq("status", "active")
      .then((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }

        return response.count;
      });

    const trialsPromise = ctx.adminSupabase
      .from("subscriptions")
      .select("*", selectParams)
      .eq("status", "trialing")
      .then((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }

        return response.count;
      });

    const accountsPromise = ctx.adminSupabase
      .from("accounts")
      .select("*", selectParams)
      .eq("is_personal_account", true)
      .then((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }

        return response.count;
      });

    const teamAccountsPromise = ctx.adminSupabase
      .from("accounts")
      .select("*", selectParams)
      .eq("is_personal_account", false)
      .then((response) => {
        if (response.error) {
          throw new Error(response.error.message);
        }

        return response.count;
      });

    const [subscriptions, trials, accounts, teamAccounts] = await Promise.all([
      subscriptionsPromise,
      trialsPromise,
      accountsPromise,
      teamAccountsPromise,
    ]);

    return {
      subscriptions,
      trials,
      accounts,
      teamAccounts,
    };
  }),
  deleteAccount: superAdminProcedure
    .input(deleteAccountInput)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.adminSupabase
        .from("accounts")
        .delete()
        .eq("id", input.accountId);

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),
  deleteUser: superAdminProcedure
    .input(deleteUserInput)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.id === input.userId) {
        throw new Error(
          `You cannot perform a destructive action on your own account as a Super Admin`,
        );
      }
      const response = await ctx.adminSupabase.auth.admin.deleteUser(
        input.userId,
      );

      if (response.error) {
        throw response.error;
      }
    }),
  impersonateUser: superAdminProcedure
    .input(impersonateUserInput)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.id === input.userId) {
        throw new Error(
          `You cannot perform a destructive action on your own account as a Super Admin`,
        );
      }

      const {
        data: { user },
        error,
      } = await ctx.adminSupabase.auth.admin.getUserById(input.userId);

      if (error ?? !user) {
        throw new Error(`Error fetching user`);
      }

      const email = user.email;

      if (!email) {
        throw new Error(`User has no email. Cannot impersonate`);
      }

      const { error: linkError, data } =
        await ctx.adminSupabase.auth.admin.generateLink({
          type: "magiclink",
          email,
          options: {
            redirectTo: `/`,
          },
        });

      if (linkError ?? !data) {
        throw new Error(`Error generating magic link`);
      }

      const response = await fetch(data.properties?.action_link, {
        method: "GET",
        redirect: "manual",
      });

      const location = response.headers.get("Location");

      if (!location) {
        throw new Error(
          `Error generating magic link. Location header not found`,
        );
      }

      const hash = new URL(location).hash.substring(1);
      const query = new URLSearchParams(hash);
      const accessToken = query.get("access_token");
      const refreshToken = query.get("refresh_token");

      if (!accessToken || !refreshToken) {
        throw new Error(
          `Error generating magic link. Tokens not found in URL hash.`,
        );
      }

      return {
        accessToken,
        refreshToken,
      };
    }),
  getMembers: superAdminProcedure
    .input(getMembersInput)
    .query(async ({ ctx, input }) => {
      const response = await ctx.adminSupabase.rpc("get_account_members", {
        account_slug: input.accountSlug,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),
  getMemberships: superAdminProcedure
    .input(getMembershipsInput)
    .query(async ({ ctx, input }) => {
      const response = await ctx.adminSupabase
        .from("accounts_memberships")
        .select("*, account: account_id !inner (id, name)")
        .eq("user_id", input.userId);

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),
  getSubscription: superAdminProcedure
    .input(getSubscriptionInput)
    .query(async ({ ctx, input }) => {
      const response = await ctx.adminSupabase
        .from("subscriptions")
        .select("*, subscription_items !inner (*)")
        .eq("account_id", input.accountId)
        .maybeSingle();

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),
  banUser: superAdminProcedure
    .input(banUserInput)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.id === input.userId) {
        throw new Error(
          `You cannot perform a destructive action on your own account as a Super Admin`,
        );
      }
      await ctx.adminSupabase.auth.admin.updateUserById(input.userId, {
        ban_duration: "876600h",
      });
    }),
  reactivateUser: superAdminProcedure
    .input(reactivateUserInput)
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.id === input.userId) {
        throw new Error(
          `You cannot perform a destructive action on your own account as a Super Admin`,
        );
      }
      await ctx.adminSupabase.auth.admin.updateUserById(input.userId, {
        ban_duration: "none",
      });
    }),
});
