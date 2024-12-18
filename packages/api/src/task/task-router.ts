import { asc, count, desc, eq } from "@init/db";
import { tasks } from "@init/db/schema";

import { createTRPCRouter, protectedProcedure } from "../trpc";
import { filterColumns } from "./filter-columns";
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
          slug: input.title.toLowerCase().replace(/\s/g, "-"),
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
      try {
        const offset = (input.page - 1) * input.perPage;

        const where = filterColumns({
          table: tasks,
          // @ts-expect-error - TS doesn't understand that the filters are already validated
          filters: input.filters,
          joinOperator: input.joinOperator,
        });

        const orderBy =
          input.sort.length > 0
            ? input.sort.map((item) =>
                // @ts-expect-error - TS doesn't understand that the filters are already validated
                item.desc ? desc(tasks[item.id]) : asc(tasks[item.id]),
              )
            : [asc(tasks.createdAt)];

        const { data, total } = await ctx.db.transaction(async (tx) => {
          const data = await tx
            .select()
            .from(tasks)
            .limit(input.perPage)
            .offset(offset)
            .where(where)
            .orderBy(...orderBy);

          const total = await tx
            .select({
              count: count(),
            })
            .from(tasks)
            .where(where)
            .execute()
            .then((res) => res[0]?.count ?? 0);

          return {
            data,
            total,
          };
        });

        const pageCount = Math.ceil(total / input.perPage);
        return { data, pageCount };
      } catch (err) {
        return { data: [], pageCount: 0 };
      }
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
