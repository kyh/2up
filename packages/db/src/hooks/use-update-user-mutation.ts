import { useMutation } from "@tanstack/react-query";

import type { UserAttributes } from "@supabase/gotrue-js";
import { useSupabase } from "./use-supabase";

type Params = UserAttributes & { redirectTo: string };

export const useUpdateUser = () => {
  const client = useSupabase();
  const mutationKey = ["supabase:user"];

  const mutationFn = async (attributes: Params) => {
    const { redirectTo, ...params } = attributes;

    const response = await client.auth.updateUser(params, {
      emailRedirectTo: redirectTo,
    });

    if (response.error) {
      throw response.error;
    }

    return response.data;
  };

  return useMutation({
    mutationKey,
    mutationFn,
  });
};
