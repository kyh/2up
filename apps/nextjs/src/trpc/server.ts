/* eslint-disable @typescript-eslint/no-explicit-any */
import type { RedirectError } from "next/dist/client/components/redirect";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { createTRPCClient, loggerLink, TRPCClientError } from "@trpc/client";
import { callProcedure } from "@trpc/server";
import { observable } from "@trpc/server/observable";
import SuperJSON from "superjson";
import { z } from "zod";

import { appRouter, createTRPCContext } from "@acme/api";

import type { TRPCErrorResponse } from "@trpc/server/rpc";

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

export const api = createTRPCClient<typeof appRouter>({
  transformer: SuperJSON,
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === "development" ||
        (op.direction === "down" && op.result instanceof Error),
    }),
    /**
     * Custom RSC link that invokes procedures directly in the server component Don't be too afraid
     * about the complexity here, it's just wrapping `callProcedure` with an observable to make it a
     * valid ending link for tRPC.
     */
    () =>
      ({ op }) =>
        observable((observer) => {
          createContext()
            .then((ctx) => {
              return callProcedure({
                procedures: appRouter._def.procedures,
                path: op.path,
                getRawInput: () => Promise.resolve(op.input),
                ctx,
                type: op.type,
              });
            })
            .then((data) => {
              observer.next({ result: { data } });
              observer.complete();
            })
            .catch((cause: TRPCErrorResponse) => {
              observer.error(TRPCClientError.from(cause));
            });
        }),
  ],
});

export type ServerActionResponse<T> = {
  data?: T;
  error?: string;
};

/**
 * Thin wrapper to create server actions that correctly serializes trpc responses.
 * 

export const createTodo = createServerAction(
  async (input: RouterInputs["todo"]["create"]) => {
    await api.todo.create.mutate(input);
    revalidatePath("/");
  },
);

 */
export const createServerAction = <P, R>(action: (_: P) => Promise<R>) => {
  return async (input: P): Promise<ServerActionResponse<R>> => {
    try {
      const res = await action(input);
      return { data: res };
    } catch (e: unknown) {
      // next/navigation functions work by throwing an error that will be
      // processed internally by Next.js. So, in this case we need to rethrow it.
      if (isNextRedirectError(e) || isNextNotFoundError(e)) {
        throw e;
      }

      if (e instanceof TRPCClientError) {
        return { error: e.message };
      }

      if (e instanceof Error) {
        return { error: e.message };
      }

      return { error: "Something went wrong while executing the operation" };
    }
  };
};

const REDIRECT_ERROR_CODE = "NEXT_REDIRECT";
const NOT_FOUND_ERROR_CODE = "NEXT_NOT_FOUND";

type NotFoundError = Error & { digest: typeof NOT_FOUND_ERROR_CODE };

const isNextRedirectError = <U extends string>(
  error: any,
): error is RedirectError<U> => {
  if (!z.object({ digest: z.string() }).safeParse(error).success) {
    return false;
  }

  const [errorCode, type, destination, permanent] =
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (error.digest as string).split(";", 4);

  if (!errorCode || !type || !destination || !permanent) {
    return false;
  }

  return (
    errorCode === REDIRECT_ERROR_CODE &&
    (type === "replace" || type === "push") &&
    typeof destination === "string" &&
    (permanent === "true" || permanent === "false")
  );
};

const isNextNotFoundError = (error: any): error is NotFoundError =>
  z.object({ digest: z.literal(NOT_FOUND_ERROR_CODE) }).safeParse(error)
    .success;
