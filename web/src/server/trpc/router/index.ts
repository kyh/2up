// src/server/trpc/router/index.ts
import { t } from "server/trpc/utils";
import { exampleRouter } from "./example";
import { packsRouter } from "./packs";
import { authRouter } from "./auth";

export const appRouter = t.router({
  packs: packsRouter,
  example: exampleRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
