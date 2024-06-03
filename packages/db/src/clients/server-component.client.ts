import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "../database.types";
import {
  getServiceRoleKey,
  warnServiceRoleKeyUsage,
} from "../get-service-role-key";
import { getSupabaseClientKeys } from "../get-supabase-client-keys";

const serviceRoleKey = getServiceRoleKey();
const keys = getSupabaseClientKeys();

/**
 * @name getSupabaseServerComponentClient
 * @description Get a Supabase client for use in the Server Components
 */
export const getSupabaseServerComponentClient = <GenericSchema = Database>(
  params = {
    admin: false,
  },
) => {
  // prevent any caching (to be removed in Next v15)
  noStore();

  if (params.admin) {
    warnServiceRoleKeyUsage();

    return createClient<GenericSchema>(keys.url, serviceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }

  return createServerClient<GenericSchema>(keys.url, keys.anonKey, {
    cookies: getCookiesStrategy(),
  });
};

const getCookiesStrategy = () => {
  const cookieStore = cookies();

  return {
    get: (name: string) => {
      return cookieStore.get(name)?.value;
    },
  };
};
