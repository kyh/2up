import { gameRouter } from "./routers/game";
import { packRouter } from "./routers/pack";
import { sceneRouter } from "./routers/scene";
import { waitlistRouter } from "./routers/waitlist";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  game: gameRouter,
  pack: packRouter,
  scene: sceneRouter,
  waitlist: waitlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
