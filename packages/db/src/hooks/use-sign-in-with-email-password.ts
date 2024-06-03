import { useMutation } from "@tanstack/react-query";

import type { SignInWithPasswordCredentials } from "@supabase/supabase-js";
import { useSupabase } from "./use-supabase";

export const useSignInWithEmailPassword = () => {
  const client = useSupabase();
  const mutationKey = ["auth", "sign-in-with-email-password"];

  const mutationFn = async (credentials: SignInWithPasswordCredentials) => {
    const response = await client.auth.signInWithPassword(credentials);

    if (response.error) {
      throw response.error.message;
    }

    const user = response.data.user;
    const identities = user.identities ?? [];

    // if the user has no identities, it means that the email is taken
    if (identities.length === 0) {
      throw new Error("User already registered");
    }

    return response.data;
  };

  return useMutation({ mutationKey, mutationFn });
};
