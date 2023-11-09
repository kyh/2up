import { gameRouter } from "./routers/game";
import { packRouter } from "./routers/pack";
import { sceneRouter } from "./routers/scene";
import { createTRPCRouter } from "@/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  game: gameRouter,
  pack: packRouter,
  scene: sceneRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
