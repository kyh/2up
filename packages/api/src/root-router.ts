import { authRouter } from "./auth/auth-router";
import { teamRouter } from "./team/team-router";
import { createTRPCRouter } from "./trpc";
import { userRouter } from "./user/user-router";
import { waitlistRouter } from "./waitlist/waitlist-router";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  team: teamRouter,
  user: userRouter,
  waitlist: waitlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
