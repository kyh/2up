import { useMutation } from "@tanstack/react-query";

import { useSupabase } from "./use-supabase";

type Params = {
  email: string;
  redirectTo: string;
};

/**
 * @name useRequestResetPassword
 * @description Requests a password reset for a user. This function will
 * trigger a password reset email to be sent to the user's email address.
 * After the user clicks the link in the email, they will be redirected to
 * /password-reset where their password can be updated.
 */
export const useRequestResetPassword = () => {
  const client = useSupabase();
  const mutationKey = ["auth", "reset-password"];

  const mutationFn = async (params: Params) => {
    const { error, data } = await client.auth.resetPasswordForEmail(
      params.email,
      {
        redirectTo: params.redirectTo,
      },
    );

    if (error) {
      throw error;
    }

    return data;
  };

  return useMutation({
    mutationFn,
    mutationKey,
  });
};
