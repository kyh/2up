import { useMutation } from "@tanstack/react-query";

import type { SignInWithOAuthCredentials } from "@supabase/gotrue-js";
import { useSupabase } from "./use-supabase";

export const useSignInWithProvider = () => {
  const client = useSupabase();
  const mutationKey = ["auth", "sign-in-with-provider"];

  const mutationFn = async (credentials: SignInWithOAuthCredentials) => {
    const response = await client.auth.signInWithOAuth(credentials);

    if (response.error) {
      throw response.error.message;
    }

    return response.data;
  };

  return useMutation({
    mutationFn,
    mutationKey,
  });
};
