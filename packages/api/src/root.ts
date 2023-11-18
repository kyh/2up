import { gameRouter } from "./router/game";
import { packRouter } from "./router/pack";
import { sceneRouter } from "./router/scene";
import { waitlistRouter } from "./router/waitlist";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  game: gameRouter,
  pack: packRouter,
  scene: sceneRouter,
  waitlist: waitlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
