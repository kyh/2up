import { accountRouter } from "./account/account-router";
import { adminRouter } from "./admin/admin-router";
import { authRouter } from "./auth/auth-router";
import { billingRouter } from "./billing/billing-router";
import { notificationsRouter } from "./notifications/notifications-router";
import { storageRouter } from "./storage/storage-router";
import { taskRouter } from "./task/task-router";
import { createTRPCRouter } from "./trpc";
import { waitlistRouter } from "./waitlist/waitlist-router";

export const appRouter = createTRPCRouter({
  admin: adminRouter,
  auth: authRouter,
  account: accountRouter,
  billing: billingRouter,
  notifications: notificationsRouter,
  storage: storageRouter,
  task: taskRouter,
  waitlist: waitlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
