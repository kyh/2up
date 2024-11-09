import { z } from "zod";

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

export const getTasksInput = z.object({
  page: z.string().default("1"),
  perPage: z.string().default("10"),
  sort: z
    .array(
      z.object({
        field: createTaskInput.extend({ id: z.string() }).keyof(),
        direction: z.enum(["asc", "desc"]).default("asc"),
      }),
    )
    .default([{ field: "id", direction: "asc" }]),
  filter: z
    .array(
      z.object({
        field: createTaskInput.extend({ id: z.string() }).keyof(),
        value: z.string(),
      }),
    )
    .optional(),
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
