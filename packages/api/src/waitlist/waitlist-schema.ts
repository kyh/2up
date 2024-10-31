import { z } from "zod";

// CREATE
export const joinWaitlistInput = z.object({
  email: z.string().email(),
  type: z.enum(["app"]),
});
export type JoinWaitlistInput = z.infer<typeof joinWaitlistInput>;

export const joinWaitlistsInput = z.array(joinWaitlistInput);
export type JoinWaitlistsInput = z.infer<typeof joinWaitlistsInput>;

// READ
export const getWaitlistInput = z
  .object({
    id: z.string(),
  })
  .required();
export type GetWaitlistInput = z.infer<typeof getWaitlistInput>;

export const getWaitlistsInput = z.object({
  page: z.string().default("1"),
  perPage: z.string().default("10"),
  sort: z
    .array(
      z.object({
        field: joinWaitlistInput.extend({ id: z.string() }).keyof(),
        direction: z.enum(["asc", "desc"]).default("asc"),
      }),
    )
    .default([{ field: "id", direction: "asc" }]),
  filter: z
    .array(
      z.object({
        field: joinWaitlistInput.extend({ id: z.string() }).keyof(),
        value: z.string(),
      }),
    )
    .optional(),
});
export type GetWaitlistsInput = z.infer<typeof getWaitlistsInput>;

// UPDATE
export const updateWaitlistInput = z
  .object({
    id: z.string(),
  })
  .merge(joinWaitlistInput);
export type UpdateWaitlistInput = z.infer<typeof updateWaitlistInput>;

export const updateWaitlistsInput = z.array(updateWaitlistInput);
export type UpdateWaitlistsInput = z.infer<typeof updateWaitlistsInput>;

// DELETE
export const deleteWaitlistInput = z
  .object({
    id: z.string(),
  })
  .required();
export type DeleteWaitlistInput = z.infer<typeof deleteWaitlistInput>;

export const deleteWaitlistsInput = z.array(deleteWaitlistInput);
export type DeleteWaitlistsInput = z.infer<typeof deleteWaitlistsInput>;
