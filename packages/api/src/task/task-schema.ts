import {
  createSearchParamsCache,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString,
  parseAsStringEnum,
} from "nuqs/server";
import { z } from "zod";

import type { tasks } from "@init/db/schema";
import {
  filterSchema,
  getFiltersStateParser,
  getSortingStateParser,
  sortSchema,
} from "./parsers";

type Task = typeof tasks.$inferSelect;

export const taskLabels = [
  "bug",
  "feature",
  "enhancement",
  "documentation",
] as const;
export type TaskLabel = (typeof taskLabels)[number];

export const taskPriorities = ["low", "medium", "high"] as const;
export type TaskPriority = (typeof taskPriorities)[number];

export const taskStatuses = [
  "todo",
  "in-progress",
  "done",
  "canceled",
] as const;
export type TaskStatus = (typeof taskStatuses)[number];

/**********
 * Create
 **********/
export const createTaskInput = z.object({
  title: z.string(),
  label: z.enum(taskLabels).default("bug"),
  priority: z.enum(taskPriorities).default("low"),
  status: z.enum(taskStatuses).default("todo"),
  teamId: z.string(),
});
export type CreateTaskInput = z.infer<typeof createTaskInput>;

export const createTasksInput = z.object({ tasks: z.array(createTaskInput) });
export type CreateTasksInput = z.infer<typeof createTasksInput>;

/**********
 * Read
 **********/
export const getTaskInput = z
  .object({
    id: z.string(),
  })
  .required();
export type GetTaskInput = z.infer<typeof getTaskInput>;

export const searchParamsCache = createSearchParamsCache({
  title: parseAsString.withDefault(""),
  status: parseAsArrayOf(z.enum(taskStatuses)).withDefault([]),
  priority: parseAsArrayOf(z.enum(taskPriorities)).withDefault([]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  filters: getFiltersStateParser<Task>().withDefault([]),
  sort: getSortingStateParser<Task>().withDefault([
    { id: "createdAt", desc: true },
  ]),
});

export const getTasksInput = z.object({
  title: z.string(),
  status: z.array(z.enum(taskStatuses)),
  priority: z.array(z.enum(taskPriorities)),
  from: z.string(),
  to: z.string(),
  joinOperator: z.enum(["and", "or"]),
  page: z.number(),
  perPage: z.number(),
  filters: z.array(filterSchema),
  sort: z.array(sortSchema),
});
export type GetTasksInput = z.infer<typeof getTasksInput>;

/**********
 * Update
 **********/
export const updateTaskInput = z
  .object({
    id: z.string(),
  })
  .merge(createTaskInput);
export type UpdateTaskInput = z.infer<typeof updateTaskInput>;

export const updateTasksInput = z.object({ tasks: z.array(updateTaskInput) });
export type UpdateTasksInput = z.infer<typeof updateTasksInput>;

/**********
 * Delete
 **********/
export const deleteTaskInput = z
  .object({
    id: z.string(),
  })
  .required();
export type DeleteTaskInput = z.infer<typeof deleteTaskInput>;

export const deleteTasksInput = z.object({ tasks: z.array(deleteTaskInput) });
export type DeleteTasksInput = z.infer<typeof deleteTasksInput>;
