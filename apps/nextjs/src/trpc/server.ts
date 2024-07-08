import { cache } from "react";
import { headers } from "next/headers";
import { createCaller, createTRPCContext } from "@init/api";
import { createHydrationHelpers } from "@trpc/react-query/rsc";

import type { AppRouter } from "@init/api";
import { createQueryClient } from "./query-client";

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

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
  caller,
  getQueryClient,
);
