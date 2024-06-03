import { useMutation } from "@tanstack/react-query";

import type { SignInWithPasswordlessCredentials } from "@supabase/gotrue-js";
import { useSupabase } from "./use-supabase";

export const useSignInWithOtp = () => {
  const client = useSupabase();
  const mutationKey = ["auth", "sign-in-with-otp"];

  const mutationFn = async (credentials: SignInWithPasswordlessCredentials) => {
    const result = await client.auth.signInWithOtp(credentials);

    if (result.error) {
      if (shouldIgnoreError(result.error.message)) {
        console.warn(
          `Ignoring error during development: ${result.error.message}`,
        );

        return {} as never;
      }

      throw result.error.message;
    }

    return result.data;
  };

  return useMutation({
    mutationFn,
    mutationKey,
  });
};

export default useSignInWithOtp;

const shouldIgnoreError = (error: string) => isSmsProviderNotSetupError(error);

const isSmsProviderNotSetupError = (error: string) =>
  error.includes(`sms Provider could not be found`);
