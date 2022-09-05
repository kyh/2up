import { t } from "~/server/trpc";
import { authRouter } from "./auth";
import { packRouter } from "./pack";
import { gameRouter } from "./game";

export const appRouter = t.router({
  auth: authRouter,
  pack: packRouter,
  game: gameRouter,
});

export type AppRouter = typeof appRouter;
