// src/server/trpc/router/index.ts
import { t } from "server/trpc/utils";
import { authRouter } from "./auth";
import { packRouter } from "./pack";
import { gameRouter } from "./game";

export const appRouter = t.router({
  auth: authRouter,
  pack: packRouter,
  game: gameRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
