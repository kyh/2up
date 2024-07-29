import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  createInput,
  deleteInput,
  retrieveInput,
  updateInput,
} from "./task-schema";

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createInput)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.supabase.from("Tasks").insert({
        title: input.title,
        label: input.label,
        priority: input.priority,
        status: input.status,
        accountId: input.accountId,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),

  retrieve: protectedProcedure
    .input(retrieveInput)
    .query(async ({ ctx, input }) => {
      const page = parseInt(input.page);
      const perPage = parseInt(input.per_page);
      const offset = (page - 1) * perPage;

      const response = await ctx.supabase
        .from("Tasks")
        .select("*", { count: "exact" })
        .limit(perPage)
        .range(offset, offset + perPage - 1)
        .eq("accountId", input.accountId);

      if (response.error) {
        throw response.error;
      }

      const pageCount = Math.ceil((response.count ?? 0) / perPage);

      return { data: response.data, pageCount };
    }),

  update: protectedProcedure
    .input(updateInput)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.supabase
        .from("Tasks")
        .update({
          title: input.title,
          label: input.label,
          priority: input.priority,
          status: input.status,
        })
        .match({ id: input.id });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),

  delete: protectedProcedure
    .input(deleteInput)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.supabase
        .from("Tasks")
        .delete()
        .in("id", input.ids);

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),
});
