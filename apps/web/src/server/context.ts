import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { decode } from "~/utils/jwt";
import { prisma } from "~/utils/prisma";
import type { User } from "@supabase/supabase-js";

const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error("JWT_SECRET is not defined");
}

interface CreateContextOptions {
  user: User | null;
}

export const getUser = async (
  req: trpcNext.CreateNextContextOptions["req"]
) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  if (accessToken) {
    // We should authenticate with supabase but it's an extra network call.
    const user = decode(accessToken, secret);
    return {
      ...user,
      id: user.sub,
    };
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
  return createContextInner({
    user: await getUser(options.req),
  });
};
