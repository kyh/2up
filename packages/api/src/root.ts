import { teamRouter } from "./routers/team";
import { todoRouter } from "./routers/todo";
import { userRouter } from "./routers/user";
import { waitlistRouter } from "./routers/waitlist";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  waitlist: waitlistRouter,
  user: userRouter,
  team: teamRouter,
  todo: todoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
