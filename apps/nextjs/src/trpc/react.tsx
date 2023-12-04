"use client";

import { use, useCallback, useState, useTransition } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import SuperJSON from "superjson";

import type { AppRouter } from "@acme/api";

import type { ServerActionResponse } from "./server";

export type * from "@acme/api";

export const api = createTRPCReact<AppRouter>();

export const TRPCReactProvider = (props: {
  children: React.ReactNode;
  headersPromise: Promise<Headers>;
}) => {
  const [queryClient] = useState(() => new QueryClient());
  const ssrHeaders = use(props.headersPromise);

  const [trpcClient] = useState(() =>
    api.createClient({
      transformer: SuperJSON,
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          url: getBaseUrl() + "/api/trpc",
          headers: () => {
            const headers = new Map(ssrHeaders);
            headers.set("x-trpc-source", "nextjs-react");
            return Object.fromEntries(headers);
          },
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  );
};

const getBaseUrl = () => {
  if (typeof window !== "undefined") return window.location.origin;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return `http://localhost:${process.env.PORT ?? 3000}`;
};

/**
 * Custom hook to execute a server actions with client-side effects.
 */
export const useServerAction = <P, R>(
  action: (_: P) => Promise<ServerActionResponse<R>>,
  {
    onExecute,
    onSuccess,
    onError,
    onSettled,
  }: {
    onExecute?: (_: P) => void;
    onSuccess?: (_: R) => void;
    onError?: (_: string) => void;
    onSettled?: () => void;
  },
): {
  execute: (_: P) => void;
  data?: R;
  error?: string;
  isError: boolean;
  isIdle: boolean;
  isLoading: boolean;
  isSuccess: boolean;
  reset: () => void;
} => {
  const [isLoading, startTransition] = useTransition();
  const [error, setError] = useState<string>();
  const [data, setData] = useState<R>();

  const execute = useCallback(
    (args: P) => {
      if (onExecute) onExecute(args);

      startTransition(() => {
        return action(args).then(({ data, error }) => {
          if (error) {
            setError(error);
            onError?.(error);
          }

          if (data) {
            setData(data);
            onSuccess?.(data);
          }

          onSettled?.();
        });
      });
    },
    [action, onExecute, onError, onSuccess, onSettled],
  );

  const reset = useCallback(() => {
    setData(undefined);
    setError(undefined);
  }, []);

  return {
    execute,
    data,
    error,
    isError: !!error,
    isIdle: !isLoading,
    isLoading,
    isSuccess: !!data,
    reset,
  };
};
