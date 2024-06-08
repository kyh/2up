import { z } from "zod";

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
  label: z.enum(["bug", "feature", "enhancement", "documentation"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["todo", "in-progress", "done", "canceled"]).optional(),
});
export type CreateInput = z.infer<typeof createInput>;

export const retrieveInput = z.object({
  page: z.number().default(1),
  perPage: z.number().default(10),
  sort: z.string().default("created_at"),
});
export type RetrieveInput = z.infer<typeof retrieveInput>;

export const updateInput = z.object({
  id: z.string(),
  title: z.string().optional(),
  label: z.enum(["bug", "feature", "enhancement", "documentation"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  status: z.enum(["todo", "in-progress", "done", "canceled"]).optional(),
});
export type UpdateInput = z.infer<typeof updateInput>;

export const deleteInput = z.object({
  ids: z.string().array(),
});
export type DeleteInput = z.infer<typeof deleteInput>;
