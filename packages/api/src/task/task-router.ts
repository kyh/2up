import { and, asc, desc, eq, sql } from "@init/db";
import { tasks } from "@init/db/schema";

import type { SQL } from "@init/db";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import {
  createTaskInput,
  createTasksInput,
  deleteTaskInput,
  deleteTasksInput,
  getTaskInput,
  getTasksInput,
  updateTaskInput,
  updateTasksInput,
} from "./task-schema";

export const taskRouter = createTRPCRouter({
  createTask: protectedProcedure
    .input(createTaskInput)
    .mutation(async ({ ctx, input }) => {
      const [created] = await ctx.db
        .insert(tasks)
        .values({
          ...input,
          userId: ctx.user.id,
        })
        .returning();

      return {
        task: created,
      };
    }),
  createTasks: protectedProcedure
    .input(createTasksInput)
    .mutation(async ({ ctx, input }) => {}),

  getTask: protectedProcedure
    .input(getTaskInput)
    .query(async ({ ctx, input }) => {
      const task = await ctx.db.query.tasks.findFirst({
        where: (tasks, { eq }) => eq(tasks.id, input.id),
      });

      return {
        task,
      };
    }),
  getTasks: protectedProcedure
    .input(getTasksInput)
    .query(async ({ ctx, input }) => {
      // Convert page and perPage to numbers
      const pageNum = parseInt(input.page);
      const perPageNum = parseInt(input.perPage);
      const offset = (pageNum - 1) * perPageNum;

      // Build where conditions
      const whereConditions: SQL[] = [];
      input.filter?.forEach((filter) => {
        whereConditions.push(eq(tasks[filter.field], filter.value));
      });

      // Build order by configuration
      const orderBy = input.sort.map((sortItem) => {
        const column = tasks[sortItem.field];
        return sortItem.direction === "asc" ? asc(column) : desc(column);
      });

      // Execute query
      const results = await ctx.db.query.tasks.findMany({
        where: whereConditions.length > 0 ? and(...whereConditions) : undefined,
        orderBy: orderBy,
        limit: perPageNum,
        offset: offset,
      });

      // Get total count
      const [total] = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(tasks)
        .where(
          whereConditions.length > 0 ? and(...whereConditions) : undefined,
        );
      const count = total?.count ?? 0;

      return {
        data: results,
        pagination: {
          total: count,
          page: pageNum,
          perPage: perPageNum,
          totalPages: Math.ceil(count / perPageNum),
        },
      };
    }),

  updateTask: protectedProcedure
    .input(updateTaskInput)
    .mutation(async ({ ctx, input }) => {
      const [updated] = await ctx.db
        .update(tasks)
        .set(input)
        .where(eq(tasks.id, input.id))
        .returning();

      return {
        task: updated,
      };
    }),
  updateTasks: protectedProcedure
    .input(updateTasksInput)
    .mutation(async ({ ctx, input }) => {}),

  deleteTask: protectedProcedure
    .input(deleteTaskInput)
    .mutation(async ({ ctx, input }) => {
      const [deleted] = await ctx.db
        .delete(tasks)
        .where(eq(tasks.id, input.id))
        .returning();

      return {
        task: deleted,
      };
    }),
  deleteTasks: protectedProcedure
    .input(deleteTasksInput)
    .mutation(async ({ ctx, input }) => {}),
});
