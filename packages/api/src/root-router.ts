import { authRouter } from "./auth/auth-router";
import { billingRouter } from "./billing/billing-router";
// import { notificationsRouter } from "./notifications/notifications-router";
import { taskRouter } from "./task/task-router";
import { teamRouter } from "./team/team-router";
import { createTRPCRouter } from "./trpc";
import { userRouter } from "./user/user-router";
import { waitlistRouter } from "./waitlist/waitlist-router";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  billing: billingRouter,
  // notifications: notificationsRouter,
  task: taskRouter,
  team: teamRouter,
  user: userRouter,
  waitlist: waitlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
