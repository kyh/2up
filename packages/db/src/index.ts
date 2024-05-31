import { PrismaClient } from "@prisma/client";
import * as supabase from "@supabase/supabase-js";

import type { Database as SupabaseDatabase } from "./supabase-types";
import type { SupabaseClient as DefaultSupabaseClient } from "@supabase/supabase-js";

const NODE_ENV = process.env.NODE_ENV ?? "development";

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const db = globalForPrisma.prisma ?? prismaClientSingleton();

if (NODE_ENV !== "production") globalForPrisma.prisma = db;

type SupabaseClient = DefaultSupabaseClient<SupabaseDatabase>;

export {
  type SupabaseClient,
  type SupabaseDatabase,
  type PrismaClientSingleton,
  supabase,
  db,
};
