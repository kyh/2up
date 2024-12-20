import { authRouter } from "./auth/auth-router";
import { billingRouter } from "./billing/billing-router";
import { gameRouter } from "./game/game-router";
import { packRouter } from "./pack/pack-router";
import { sceneRouter } from "./scene/scene-router";
import { createTRPCRouter } from "./trpc";
import { userRouter } from "./user/user-router";
import { waitlistRouter } from "./waitlist/waitlist-router";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  billing: billingRouter,
  game: gameRouter,
  pack: packRouter,
  scene: sceneRouter,
  user: userRouter,
  waitlist: waitlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
