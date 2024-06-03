import { useMutation } from "@tanstack/react-query";

import type { VerifyOtpParams } from "@supabase/gotrue-js";
import { useSupabase } from "./use-supabase";

export const useVerifyOtp = () => {
  const client = useSupabase();

  const mutationKey = ["verify-otp"];

  const mutationFn = async (params: VerifyOtpParams) => {
    const { data, error } = await client.auth.verifyOtp(params);

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
