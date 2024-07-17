import { z } from "zod";

export const createNotificationInput = z.object({
  account_id: z.string(),
  body: z.string(),
  channel: z.enum(["in_app", "email"]).optional(),
  created_at: z.string().optional(),
  dismissed: z.boolean().optional(),
  expires_at: z.string().nullable().optional(),
  link: z.string().nullable().optional(),
  type: z.enum(["info", "warning", "error"]).optional(),
});

export const dismissNotificationInput = z.object({
  notification: z.number(),
});

export const fetchNotificationsInput = z.object({
  accountIds: z.array(z.string()),
});
