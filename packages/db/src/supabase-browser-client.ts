import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "./database.types";

/**
 * @name getSupabaseBrowserClient
 * @description Get a Supabase client for use in the Browser
 */
export const getSupabaseBrowserClient = <GenericSchema = Database>() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  return createBrowserClient<GenericSchema>(url, anonKey);
};
