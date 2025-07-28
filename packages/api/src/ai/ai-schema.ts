import { z } from "zod";

export const projectId = "1ZC17YbMevA" as const;

/**
 * Create schema
 */
export const createChatInput = z
  .object({
    message: z.string(),
  })
  .required();
export type CreateChatInput = z.infer<typeof createChatInput>;

export const updateChatInput = z
  .object({
    chatId: z.string(),
    message: z.string(),
  })
  .required();
export type UpdateChatInput = z.infer<typeof updateChatInput>;

/**
 * Read schema
 */
export const getChatInput = z
  .object({
    chatId: z.string(),
  })
  .required();
export type GetChatInput = z.infer<typeof getChatInput>;

/**
 * Delete schema
 */
export const deleteChatInput = z
  .object({
    chatId: z.string(),
  })
  .required();
export type DeleteChatInput = z.infer<typeof deleteChatInput>;
