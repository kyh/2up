import { useQuery } from "@tanstack/react-query";

import type { User } from "@supabase/supabase-js";
import { useSupabase } from "./use-supabase";

const queryKey = ["supabase:user"];

export const useUser = (initialData?: User | null) => {
  const client = useSupabase();

  const queryFn = async () => {
    const response = await client.auth.getUser();

    // this is most likely a session error or the user is not logged in
    if (response.error) {
      return undefined;
    }

    if (response.data.user) {
      return response.data.user;
    }

    return Promise.reject("Unexpected result format");
  };

  // update staleTime to 5 minutes
  const staleTime = 1000 * 60 * 5;

  return useQuery({
    queryFn,
    queryKey,
    initialData,
    staleTime,
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
