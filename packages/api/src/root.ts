import { taskRouter } from "./routers/task";
import { waitlistRouter } from "./routers/waitlist";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  waitlist: waitlistRouter,
  task: taskRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
