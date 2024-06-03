import { cache } from "react";
import { headers } from "next/headers";
import { createCaller, createTRPCContext } from "@init/api";
import { getSupabaseServerComponentClient } from "@init/db/clients/server-component.client";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const head = new Headers(headers());
  const supabase = getSupabaseServerComponentClient();

  head.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: head,
    supabase,
  });
});

export const api = createCaller(createContext);
