import { accountRouter } from "./account/account-router";
import { adminRouter } from "./admin/admin-router";
import { authRouter } from "./auth/auth-router";
import { roleRouter } from "./role/role-router";
import { storageRouter } from "./storage/storage-router";
import { taskRouter } from "./task/task-router";
import { teamAccountRouter } from "./team-account/team-account-router";
import { createTRPCRouter } from "./trpc";
import { waitlistRouter } from "./waitlist/waitlist-router";

export const appRouter = createTRPCRouter({
  admin: adminRouter,
  auth: authRouter,
  account: accountRouter,
  role: roleRouter,
  storage: storageRouter,
  task: taskRouter,
  teamAccount: teamAccountRouter,
  waitlist: waitlistRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
