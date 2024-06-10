import { accountRouter } from "./account/account-router";
import { authRouter } from "./auth/auth-router";
import { gameRouter } from "./game/game-router";
import { packRouter } from "./pack/pack-router";
import { sceneRouter } from "./scene/scene-router";
import { createTRPCRouter } from "./trpc";
import { waitlistRouter } from "./waitlist/waitlist-router";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  account: accountRouter,
  waitlist: waitlistRouter,
  game: gameRouter,
  pack: packRouter,
  scene: sceneRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
