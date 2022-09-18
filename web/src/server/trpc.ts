import { initTRPC, TRPCError } from "@trpc/server";
import type { Context } from "./context";
import superjson from "superjson";

export const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape }) {
    return shape;
  },
});

// export const authedProcedure = t.procedure.use(({ ctx, next }) => {
//   if (!ctx.user) throw new TRPCError({ code: "UNAUTHORIZED" });
//   return next({ ctx });
// });

export const ServerError = TRPCError;
