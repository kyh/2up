import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { supabase } from "~/utils/supabase";
import { prisma } from "~/utils/prisma";

export const createContext = async (
  opts: trpcNext.CreateNextContextOptions
) => {
  const { user } = await supabase.auth.api.getUserByCookie(opts.req);
  return {
    user,
    prisma,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
