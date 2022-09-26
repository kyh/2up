import { t } from "~/server/trpc";
import { packRouter } from "./pack";
import { gameRouter } from "./game";

export const appRouter = t.router({
  pack: packRouter,
  game: gameRouter,
});

export type AppRouter = typeof appRouter;
