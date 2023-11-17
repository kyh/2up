import { PrismaClient } from "@prisma/client/edge";

import * as uuid from "./uuid";

const NODE_ENV = process.env.NODE_ENV ?? "development";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (NODE_ENV !== "production") globalForPrisma.prisma = db;

export { uuid };
