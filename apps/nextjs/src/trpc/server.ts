import { cache } from "react";
import { cookies, headers } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

import { createCaller, createTRPCContext } from "@acme/api";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(headers());
  const supabase = createServerComponentClient({ cookies });

  heads.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: heads,
    supabase,
  });
});

export const api = createCaller(createContext);
