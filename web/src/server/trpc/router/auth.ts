import { t, authedProcedure } from "server/trpc/utils";

export const authRouter = t.router({
  getCurrentUser: t.procedure.query(({ ctx }) => {
    return ctx.user;
  }),
  getSecretMessage: authedProcedure.query(() => {
    return "You are logged in and can see this secret message!";
  }),
});
