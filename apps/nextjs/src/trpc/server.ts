import { cache } from "react";
import { headers } from "next/headers";
import { createCaller, createTRPCContext } from "@init/api";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const head = new Headers(headers());

  head.set("x-trpc-source", "rsc");

  return createTRPCContext({
    headers: head,
  });
});

export const api = createCaller(createContext);
