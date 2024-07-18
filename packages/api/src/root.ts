import { accountRouter } from "./account/account-router";
import { adminRouter } from "./admin/admin-router";
import { authRouter } from "./auth/auth-router";
import { billingRouter } from "./billing/billing-router";
import { gameRouter } from "./game/game-router";
import { notificationsRouter } from "./notifications/notifications-router";
import { packRouter } from "./pack/pack-router";
import { roleRouter } from "./role/role-router";
import { storageRouter } from "./storage/storage-router";
import { teamRouter } from "./team/team-router";
import { createTRPCRouter } from "./trpc";
import { waitlistRouter } from "./waitlist/waitlist-router";

export const appRouter = createTRPCRouter({
  admin: adminRouter,
  auth: authRouter,
  account: accountRouter,
  billing: billingRouter,
  notifications: notificationsRouter,
  role: roleRouter,
  storage: storageRouter,
  team: teamRouter,
  waitlist: waitlistRouter,
  game: gameRouter,
  pack: packRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
