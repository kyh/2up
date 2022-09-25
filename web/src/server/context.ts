import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { supabase } from "~/utils/supabase";
import { prisma } from "~/utils/prisma";
import type { User } from "@supabase/supabase-js";

interface CreateContextOptions {
  user: User | null;
}

export const getUser = async (
  req: trpcNext.CreateNextContextOptions["req"]
) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  if (accessToken) {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(req.headers.authorization);

    if (error) {
      console.error("Error getting user", error);
      return null;
    }

    return user;
  }

  return null;
};

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export const createContextInner = async (opts: CreateContextOptions) => {
  return {
    ...opts,
    prisma,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>;

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export const createContext = async (
  options: trpcNext.CreateNextContextOptions
): Promise<Context> => {
  // for API-response caching see https://trpc.io/docs/caching
  return await createContextInner({
    user: await getUser(options.req),
  });
};
