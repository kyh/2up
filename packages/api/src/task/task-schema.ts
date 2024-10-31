import { z } from "zod";

// CREATE
export const createTaskInput = z.object({
  title: z.string(),
  label: z.enum(["bug", "feature", "enhancement", "documentation"]),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["todo", "in-progress", "done", "canceled"]),
  teamId: z.string(),
});
export type CreateTaskInput = z.infer<typeof createTaskInput>;

export const createTasksInput = z.array(createTaskInput);
export type CreateTasksInput = z.infer<typeof createTasksInput>;

// READ
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

// UPDATE
export const updateTaskInput = z
  .object({
    id: z.string(),
  })
  .merge(createTaskInput);
export type UpdateTaskInput = z.infer<typeof updateTaskInput>;

export const updateTasksInput = z.array(updateTaskInput);
export type UpdateTasksInput = z.infer<typeof updateTasksInput>;

// DELETE
export const deleteTaskInput = z
  .object({
    id: z.string(),
  })
  .required();
export type DeleteTaskInput = z.infer<typeof deleteTaskInput>;

export const deleteTasksInput = z.array(deleteTaskInput);
export type DeleteTasksInput = z.infer<typeof deleteTasksInput>;
