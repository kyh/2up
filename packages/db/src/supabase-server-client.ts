import "server-only";

import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "./database.types";
import { getServiceRoleKey } from "./get-service-role-key";
import { getSupabaseClientKeys } from "./get-supabase-client-keys";

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

const serviceRoleKey = getServiceRoleKey();

export const getSupabaseAdminClient = <GenericSchema = Database>() => {
  return createClient<GenericSchema>(keys.url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
};
