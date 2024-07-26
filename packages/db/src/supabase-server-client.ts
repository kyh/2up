import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";
import { getServiceRoleKey } from "./get-service-role-key";
import { getSupabaseClientKeys } from "./get-supabase-client-keys";

const serviceRoleKey = getServiceRoleKey();
const keys = getSupabaseClientKeys();

/**
 * @name getSupabaseServerClient
 * @description Get a Supabase client for use in the Route Handler Routes
 */
export const getSupabaseServerClient = <GenericSchema = Database>(
  params = {
    admin: false,
  },
) => {
  // prevent any caching (to be removed in Next v15)
  noStore();

  if (params.admin) {
    return createClient<GenericSchema>(keys.url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }

  const cookieStore = cookies();

  return createServerClient<GenericSchema>(keys.url, keys.anonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (cookiesToSet) => {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing
          // user sessions.
        }
      },
    },
  });
};
