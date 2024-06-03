import { useQuery } from "@tanstack/react-query";

import { useSupabase } from "./use-supabase";
import { useFactorsMutationKey } from "./use-user-factors-mutation-key";

export const useFetchAuthFactors = (userId: string) => {
  const client = useSupabase();
  const queryKey = useFactorsMutationKey(userId);

  const queryFn = async () => {
    const { data, error } = await client.auth.mfa.listFactors();

    if (error) {
      throw error;
    }

    return data;
  };

  return useQuery({
    queryKey,
    queryFn,
  });
};
