import { t } from "~/server/trpc";
import { gameRouter } from "./game";
import { packRouter } from "./pack";
import { sceneRouter } from "./scene";

export const appRouter = t.router({
  game: gameRouter,
  pack: packRouter,
  scene: sceneRouter,
});

export type AppRouter = typeof appRouter;
