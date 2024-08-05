import { z } from "zod";

export const TaskLabels = [
  "bug",
  "feature",
  "enhancement",
  "documentation",
] as const;

export const TaskPriorites = ["low", "medium", "high"] as const;

export const TaskStatuses = [
  "todo",
  "in-progress",
  "done",
  "canceled",
] as const;

export const getTaskInput = z.object({
  id: z.string(),
});

export const createTaskInput = z.object({
  title: z.string(),
  label: z.enum(TaskLabels).optional(),
  priority: z.enum(TaskPriorites).optional(),
  status: z.enum(TaskStatuses).optional(),
  accountId: z.string(),
});
export type CreateTaskInput = z.infer<typeof createTaskInput>;

export const getTaskListInput = z.object({
  page: z.string().default("1"),
  per_page: z.string().default("10"),
  sort: z.string().default("created_at"),
  accountId: z.string(),
});
export type GetTaskListInput = z.infer<typeof getTaskListInput>;

export const updateTaskInput = z.object({
  id: z.string(),
  title: z.string().optional(),
  label: z.enum(TaskLabels).optional(),
  priority: z.enum(TaskPriorites).optional(),
  status: z.enum(TaskStatuses).optional(),
});
export type UpdateTaskInput = z.infer<typeof updateTaskInput>;

export const deleteTaskInput = z.object({
  ids: z.string().array(),
});
