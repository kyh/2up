import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  byAccountIdInput,
  byIdInput,
  createInput,
  deleteInput,
  retrieveInput,
  updateInput,
} from "./task-schema";

export const taskRouter = createTRPCRouter({
  byAccountId: protectedProcedure.input(byAccountIdInput).query(({ ctx }) => {
    return;
  }),

  byId: protectedProcedure.input(byIdInput).query(({ ctx, input }) => {
    return;
  }),

  create: protectedProcedure
    .input(createInput)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.supabase.from("tasks").insert({
        title: input.title,
        label: input.label,
        priority: input.priority,
        status: input.status,
        account_id: ctx.user.id,
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),

  retrieve: protectedProcedure
    .input(retrieveInput)
    .query(async ({ ctx, input }) => {
      const offset = (input.page - 1) * input.perPage;

      const response = await ctx.supabase
        .from("tasks")
        .select("*", { count: "exact" })
        .eq("account_id", ctx.user.id)
        .range(offset, offset + input.perPage - 1);

      if (response.error) {
        throw response.error;
      }

      return { data: response.data, count: response.count };
    }),

  update: protectedProcedure
    .input(updateInput)
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.supabase
        .from("tasks")
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
        .from("tasks")
        .delete()
        .in("id", input.ids);

      if (response.error) {
        throw response.error;
      }

      return response.data;
    }),
});
