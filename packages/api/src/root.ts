import { authRouter } from "./router/auth";
import { waitlistRouter } from "./router/waitlist";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  waitlist: waitlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
