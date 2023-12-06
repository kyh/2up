import { authRouter } from "./routers/auth";
import { todoRouter } from "./routers/todo";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  todo: todoRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
