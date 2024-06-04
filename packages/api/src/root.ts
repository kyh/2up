import { accountRouter } from "./account/account-router";
import { authRouter } from "./auth/auth-router";
import { taskRouter } from "./task/task-router";
import { createTRPCRouter } from "./trpc";
import { waitlistRouter } from "./waitlist/waitlist-router";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  account: accountRouter,
  task: taskRouter,
  waitlist: waitlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
