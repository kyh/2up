import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import type { Database } from "./types/database.types";
import { getSupabaseClientKeys } from "./env/get-supabase-client-keys";

const keys = getSupabaseClientKeys();

/**
 * @name getSupabaseServerClient
 * @description Get a Supabase client for use in the Route Handler Routes
 */
export const getSupabaseServerClient = <GenericSchema = Database>() => {
  return createServerClient<GenericSchema>(keys.url, keys.anonKey, {
    cookies: {
      getAll: async () => {
        const cookieStore = await cookies();
        return cookieStore.getAll();
      },
      setAll: async (cookiesToSet) => {
        const cookieStore = await cookies();
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            return cookieStore.set(name, value, options);
          });
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};
