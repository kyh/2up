import { createClient } from "@supabase/supabase-js";

import type { Database } from "./types/database.types";
import { getServiceRoleKey } from "./env/get-service-role-key";
import { getSupabaseClientKeys } from "./env/get-supabase-client-keys";

const keys = getSupabaseClientKeys();
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
