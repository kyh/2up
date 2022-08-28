// src/server/trpc/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";

import { prisma } from "server/db/client";

export const createContext = async (
  opts: trpcNext.CreateNextContextOptions
) => {
  return {
    prisma,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
