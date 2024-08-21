"use client";

import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  httpBatchLink,
  loggerLink,
  splitLink,
  unstable_httpBatchStreamLink,
} from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import SuperJSON from "superjson";

import type { AppRouter } from "@init/api";
import type { QueryClient } from "@tanstack/react-query";
import { createQueryClient } from "./query-client";

export type { TRPCError } from "@trpc/server";

let clientQueryClientSingleton: QueryClient | undefined = undefined;
const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient();
  } else {
    // Browser: use singleton pattern to keep the same query client
    return (clientQueryClientSingleton ??= createQueryClient());
  }
};

export const api = createTRPCReact<AppRouter>({
  overrides: {
    useMutation: {
      /**
       * This function is called whenever a `.useMutation` succeeds
       **/
      onSuccess: async (opts) => {
        /**
         * @note that order here matters:
         * The order here allows route changes in `onSuccess` without
         * having a flash of content change whilst redirecting.
         **/
        // Calls the `onSuccess` defined in the `useQuery()`-options:
        await opts.originalFn();
        // Invalidate all queries in the react-query cache:
        await opts.queryClient.invalidateQueries();
      },
    },
  },
});

export const TRPCReactProvider = (props: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();

  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        splitLink({
          condition: (op) => {
            // return op.path.startsWith("auth.");
            return true;
          },
          true: httpBatchLink({
            transformer: SuperJSON,
            url: `${getBaseUrl()}/api/trpc`,
            headers: async () => {
              const headers = new Headers();
              headers.set("x-trpc-source", "nextjs-client");
              return headers;
            },
          }),
          false: unstable_httpBatchStreamLink({
            transformer: SuperJSON,
            url: `${getBaseUrl()}/api/trpc`,
            headers: async () => {
              const headers = new Headers();
              headers.set("x-trpc-source", "nextjs-client-batch-stream");
              return headers;
            },
          }),
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
        <ReactQueryDevtools initialIsOpen={false} />
      </api.Provider>
    </QueryClientProvider>
  );
};

const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};
