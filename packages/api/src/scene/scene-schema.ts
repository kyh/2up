import { z } from "zod";

export const sceneAnswerSchema = z.object({
  id: z.string(),
  content: z.string(),
  isCorrect: z.boolean(),
});
export type SceneAnswerSchema = z.infer<typeof sceneAnswerSchema>;
