import { z } from "zod";

export const userMetadata = z.object({
  avatarUrl: z.string().optional(),
  displayName: z.string().optional(),
  defaultTeam: z.string().optional(),
});
export type UserMetadata = z.infer<typeof userMetadata>;

/**********
 * Create
 **********/
export const createUserInput = z
  .object({
    email: z.string().email().optional(),
  })
  .merge(userMetadata);
export type CreateUserInput = z.infer<typeof createUserInput>;

export const createUsersInput = z.object({ users: z.array(createUserInput) });
export type CreateUsersInput = z.infer<typeof createUsersInput>;

/**********
 * Read
 **********/
export const getUserInput = z
  .object({
    id: z.string(),
  })
  .required();
export type GetUserInput = z.infer<typeof getUserInput>;

export const getUsersInput = z.object({
  page: z.string().default("1"),
  perPage: z.string().default("10"),
  sort: z
    .array(
      z.object({
        field: createUserInput.extend({ id: z.string() }).keyof(),
        direction: z.enum(["asc", "desc"]).default("asc"),
      }),
    )
    .default([{ field: "id", direction: "asc" }]),
  filter: z
    .array(
      z.object({
        field: createUserInput.extend({ id: z.string() }).keyof(),
        value: z.string(),
      }),
    )
    .optional(),
});
export type GetUsersInput = z.infer<typeof getUsersInput>;

/**********
 * Update
 **********/
export const updateUserInput = z
  .object({
    id: z.string(),
  })
  .merge(createUserInput);
export type UpdateUserInput = z.infer<typeof updateUserInput>;

export const updateUsersInput = z.object({ users: z.array(updateUserInput) });
export type UpdateUsersInput = z.infer<typeof updateUsersInput>;

/**********
 * Delete
 **********/
export const deleteUserInput = z
  .object({
    id: z.string(),
  })
  .required();
export type DeleteUserInput = z.infer<typeof deleteUserInput>;

export const deleteUsersInput = z.object({ users: z.array(deleteUserInput) });
export type DeleteUsersInput = z.infer<typeof deleteUsersInput>;

/**
 * Other
 */
export const impersonateUserInput = z.object({
  id: z.string().uuid(),
});
