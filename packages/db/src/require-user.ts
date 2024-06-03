import type { SupabaseClient, User } from "@supabase/supabase-js";
import { checkRequiresMultiFactorAuthentication } from "./check-requires-mfa";

const MULTI_FACTOR_AUTH_VERIFY_PATH = "/auth/verify";
const SIGN_IN_PATH = "/auth/sign-in";

/**
 * @name requireUser
 * @description Require a session to be present in the request
 * @param client
 */
export const requireUser = async (
  client: SupabaseClient,
): Promise<
  | {
      error: null;
      data: User;
    }
  | (
      | {
          error: AuthenticationError;
          data: null;
          redirectTo: string;
        }
      | {
          error: MultiFactorAuthError;
          data: null;
          redirectTo: string;
        }
    )
> => {
  const { data, error } = await client.auth.getUser();

  if (!data.user || error) {
    return {
      data: null,
      error: new AuthenticationError(),
      redirectTo: SIGN_IN_PATH,
    };
  }

  const requiresMfa = await checkRequiresMultiFactorAuthentication(client);

  // If the user requires multi-factor authentication,
  // redirect them to the page where they can verify their identity.
  if (requiresMfa) {
    return {
      data: null,
      error: new MultiFactorAuthError(),
      redirectTo: MULTI_FACTOR_AUTH_VERIFY_PATH,
    };
  }

  return {
    error: null,
    data: data.user,
  };
};

class AuthenticationError extends Error {
  constructor() {
    super(`Authentication required`);
  }
}

class MultiFactorAuthError extends Error {
  constructor() {
    super(`Multi-factor authentication required`);
  }
}
