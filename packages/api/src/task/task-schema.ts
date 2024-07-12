import { z } from "zod";

export const TaskLabels: readonly [string, ...string[]] = [
  "bug",
  "feature",
  "enhancement",
  "documentation",
];

export const TaskPriorites: readonly [string, ...string[]] = [
  "low",
  "medium",
  "high",
];

export const TaskStatuses: readonly [string, ...string[]] = [
  "todo",
  "in-progress",
  "done",
  "canceled",
];

export const byAccountIdInput = z.object({
  id: z.string(),
});
export type ByAccountIdInput = z.infer<typeof byAccountIdInput>;

export const byIdInput = z.object({
  id: z.string(),
});
export type ById = z.infer<typeof byIdInput>;

export const createInput = z.object({
  title: z.string(),
  label: z.enum(TaskLabels).optional(),
  priority: z.enum(TaskPriorites).optional(),
  status: z.enum(TaskStatuses).optional(),
  accountId: z.string(),
});
export type CreateInput = z.infer<typeof createInput>;

export const retrieveInput = z.object({
  page: z.string().default("1"),
  per_page: z.string().default("10"),
  sort: z.string().default("created_at"),
  accountId: z.string(),
});
export type RetrieveInput = z.infer<typeof retrieveInput>;

export const updateInput = z.object({
  id: z.string(),
  title: z.string().optional(),
  label: z.enum(TaskLabels).optional(),
  priority: z.enum(TaskPriorites).optional(),
  status: z.enum(TaskStatuses).optional(),
});
export type UpdateInput = z.infer<typeof updateInput>;

export const deleteInput = z.object({
  ids: z.string().array(),
});
export type DeleteInput = z.infer<typeof deleteInput>;
