import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "./types/database.types";
import { getSupabaseClientKeys } from "./env/get-supabase-client-keys";

/**
 * @name getSupabaseBrowserClient
 * @description Get a Supabase client for use in the Browser
 */
export const getSupabaseBrowserClient = <GenericSchema = Database>() => {
  const keys = getSupabaseClientKeys();

  return createBrowserClient<GenericSchema>(keys.url, keys.anonKey);
};
