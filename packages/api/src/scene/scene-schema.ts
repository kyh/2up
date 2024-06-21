import { z } from "zod";

export const sceneAnswerSchema = z.object({
  id: z.string(),
  content: z.string(),
  isCorrect: z.boolean(),
});
export type SceneAnswerSchema = z.infer<typeof sceneAnswerSchema>;

export const sceneSchema = z.object({
  id: z.string(),
  question: z.string(),
  questionType: z.enum(["text", "image", "video", "audio", "code"]),
  questionDescription: z.string().optional(),
  answer: z.array(sceneAnswerSchema),
  answerType: z.enum(["text", "multiText"]),
  answerDescription: z.string().optional(),
});
export type SceneSchema = z.infer<typeof sceneSchema>;
