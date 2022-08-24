import { z } from "zod";
import { t } from "server/trpc/utils";

export const packsRouter = t.router({
  getByTag: t.procedure
    .input(z.object({ tag: z.string().nullish() }).nullish())
    .query(({ ctx, input }) => {
      return ctx.prisma.pack_tags.findMany();
    }),
  getAll: t.procedure.query(({ ctx }) => {
    return ctx.prisma.packs.findMany();
  }),
});
