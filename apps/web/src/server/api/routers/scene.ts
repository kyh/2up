import { z } from "zod";
import { createTRPCRouter, authedProcedure } from "@/server/api/trpc";
import { AnswerType, QuestionType } from "@prisma/client";

const sceneModel = z.object({
  id: z.string().optional(),
  questionDescription: z.string().optional(),
  questionType: z.string(),
  question: z.string(),
  answerType: z.string(),
  answers: z.array(
    z.object({
      id: z.string().optional(),
      content: z.string(),
      isCorrect: z.boolean(),
    }),
  ),
  packId: z.string().optional(),
});

export const sceneRouter = createTRPCRouter({
  create: authedProcedure.input(sceneModel).mutation(async ({ ctx, input }) => {
    return ctx.db.scene.create({
      data: {
        questionDescription: input.questionDescription,
        questionType: input.questionType as QuestionType,
        question: input.question,
        answerType: input.answerType as AnswerType,
        answers: {
          create: input.answers,
        },
        pack: {
          connect: {
            id: input.packId,
          },
        },
      },
    });
  }),
  update: authedProcedure.input(sceneModel).mutation(async ({ ctx, input }) => {
    return ctx.db.scene.update({
      where: {
        id: input.id,
      },
      data: {
        questionDescription: input.questionDescription,
        questionType: input.questionType as QuestionType,
        question: input.question,
        answerType: input.answerType as AnswerType,
        answers: {
          upsert: input.answers.map((answer) => ({
            where: { id: answer.id },
            create: answer,
            update: answer,
          })),
        },
      },
    });
  }),
  delete: authedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return;
    }),
});
