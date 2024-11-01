import "server-only";

import type { EmailOtpType, SupabaseClient } from "@supabase/supabase-js";

/**
 * @name createAuthCallbackService
 * @description Creates an instance of the AuthCallbackService
 * @param client
 */
export const createAuthCallbackService = (client: SupabaseClient) =>
  new AuthCallbackService(client);

/**
 * @name AuthCallbackService
 * @description Service for handling auth callbacks in Supabase
 */
class AuthCallbackService {
  constructor(private readonly client: SupabaseClient) {}

  /**
   * @name verifyTokenHash
   * @description Verifies the token hash and type and redirects the user to the next page
   * This should be used when using a token hash to verify the user's email
   * @param request
   * @param params
   */
  async verifyTokenHash(
    request: Request,
    params: {
      joinTeamPath: string;
      redirectPath: string;
      errorPath?: string;
    },
  ): Promise<URL> {
    const url = new URL(request.url);
    const searchParams = url.searchParams;

    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type") as EmailOtpType | null;
    const next = searchParams.get("next") ?? params.redirectPath;
    const callbackParam = searchParams.get("callback");
    const callbackUrl = callbackParam ? new URL(callbackParam) : null;
    const inviteToken = callbackUrl?.searchParams.get("invite_token");

    const errorPath = params.errorPath ?? "/auth/callback/error";

    // remove the query params from the url
    searchParams.delete("token_hash");
    searchParams.delete("type");
    searchParams.delete("next");
    searchParams.delete("callback");

    url.pathname = next;

    // if we have an invite token, we append it to the redirect url
    if (inviteToken) {
      // if we have an invite token, we redirect to the join team page
      // instead of the default next url. This is because the user is trying
      // to join a team and we want to make sure they are redirected to the
      // correct page.
      url.pathname = params.joinTeamPath;
      searchParams.set("invite_token", inviteToken);
    }

    if (token_hash && type) {
      const { error } = await this.client.auth.verifyOtp({
        type,
        token_hash,
      });

      if (!error) {
        return url;
      }
    }

    // return the user to an error page with some instructions
    url.pathname = errorPath;

    return url;
  }

  /**
   * @name exchangeCodeForSession
   * @description Exchanges the auth code for a session and redirects the user to the next page or an error page
   * @param request
   * @param params
   */
  async exchangeCodeForSession(
    request: Request,
    params: {
      joinTeamPath: string;
      redirectPath: string;
      errorPath?: string;
    },
  ): Promise<{
    nextPath: string;
  }> {
    const requestUrl = new URL(request.url);
    const searchParams = requestUrl.searchParams;

    const authCode = searchParams.get("code");
    const error = searchParams.get("error");
    const nextUrlPathFromParams = searchParams.get("next");
    const inviteToken = searchParams.get("invite_token");
    const errorPath = params.errorPath ?? "/auth/callback/error";

    let nextUrl = nextUrlPathFromParams ?? params.redirectPath;

    // if we have an invite token, we redirect to the join team page
    // instead of the default next url. This is because the user is trying
    // to join a team and we want to make sure they are redirected to the
    // correct page.
    if (inviteToken) {
      nextUrl = `${params.joinTeamPath}?invite_token=${inviteToken}`;
    }

    if (authCode) {
      try {
        const { error } =
          await this.client.auth.exchangeCodeForSession(authCode);

        // if we have an error, we redirect to the error page
        if (error) {
          return onError({
            error: error.message,
            path: errorPath,
          });
        }
      } catch (error) {
        console.error(
          {
            error,
            name: `auth.callback`,
          },
          `An error occurred while exchanging code for session`,
        );

        const message = error instanceof Error ? error.message : error;

        return onError({
          error: message as string,
          path: errorPath,
        });
      }
    }

    if (error) {
      return onError({
        error,
        path: errorPath,
      });
    }

    return {
      nextPath: nextUrl,
    };
  }
}

const onError = ({ error, path }: { error: string; path: string }) => {
  const errorMessage = getAuthErrorMessage(error);

  console.error(
    {
      error,
      name: `auth.callback`,
    },
    `An error occurred while signing user in`,
  );

  const nextPath = `${path}?error=${errorMessage}`;

  return {
    nextPath,
  };
};

/**
 * Checks if the given error message indicates a verifier error.
 * We check for this specific error because it's highly likely that the
 * user is trying to sign in using a different browser than the one they
 * used to request the sign in link. This is a common mistake, so we
 * want to provide a helpful error message.
 */
const isVerifierError = (error: string) =>
  error.includes("both auth code and code verifier should be non-empty");

const getAuthErrorMessage = (error: string) =>
  isVerifierError(error)
    ? `It looks like you're trying to sign in using a different browser than the one you used to request the sign in link. Please try again using the same browser.`
    : `Sorry, we could not authenticate you. Please try again.`;
