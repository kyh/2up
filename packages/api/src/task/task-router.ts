import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  byAccountIdInput,
  byIdInput,
  createInput,
  deleteInput,
  updateInput,
} from "./task-schema";

export const taskRouter = createTRPCRouter({
  byAccountId: protectedProcedure.input(byAccountIdInput).query(({ ctx }) => {
    return;
  }),

  byId: protectedProcedure.input(byIdInput).query(({ ctx, input }) => {
    return;
  }),

  create: protectedProcedure.input(createInput).mutation(({ ctx, input }) => {
    return;
  }),

  update: protectedProcedure.input(updateInput).mutation(({ ctx, input }) => {
    return;
  }),

  delete: protectedProcedure.input(deleteInput).mutation(({ ctx, input }) => {
    return;
  }),
});
