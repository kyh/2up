import { PrismaClient } from "@prisma/client";

const NODE_ENV = process.env.NODE_ENV ?? "development";

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: NODE_ENV === "development" ? ["query", "warn", "error"] : ["error"],
  });
};

export type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const db = globalForPrisma.prisma ?? prismaClientSingleton();

if (NODE_ENV !== "production") globalForPrisma.prisma = db;
