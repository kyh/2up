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

const keys = getSupabaseClientKeys();
const serviceRoleKey = getServiceRoleKey();

const createServerSupabaseClient = <
  GenericSchema extends Database = Database,
>() =>
  createServerClient<GenericSchema>(keys.url, keys.anonKey, {
    cookies: getCookiesStrategy(),
  });

export const getSupabaseServerActionClient = <
  GenericSchema extends Database = Database,
>(params?: {
  admin: boolean;
}) => {
  // prevent any caching (to be removed in Next v15)
  noStore();

  const keys = getSupabaseClientKeys();
  const admin = params?.admin ?? false;

  if (admin) {
    warnServiceRoleKeyUsage();

    return createClient<GenericSchema>(keys.url, serviceRoleKey, {
      auth: {
        persistSession: false,
        detectSessionInUrl: false,
        autoRefreshToken: false,
      },
    });
  }

  return createServerSupabaseClient();
};

const getCookiesStrategy = () => {
  const cookieStore = cookies();

  return {
    get: (name: string) => {
      return cookieStore.get(name)?.value;
    },
    set: (name: string, value: string, options: object) => {
      cookieStore.set({ name, value, ...options });
    },
    remove: (name: string, options: object) => {
      cookieStore.set({
        name,
        value: "",
        ...options,
      });
    },
  };
};
