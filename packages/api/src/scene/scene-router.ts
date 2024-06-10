import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

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
  create: protectedProcedure
    .input(sceneModel)
    .mutation(async ({ ctx, input }) => {
      // return ctx.db.scene.create({
      //   data: {
      //     questionDescription: input.questionDescription,
      //     questionType: input.questionType,
      //     question: input.question,
      //     answerType: input.answerType,
      //     answers: {
      //       create: input.answers,
      //     },
      //     pack: {
      //       connect: {
      //         id: input.packId,
      //       },
      //     },
      //   },
      // });
    }),

  update: protectedProcedure
    .input(sceneModel)
    .mutation(async ({ ctx, input }) => {
      // return ctx.db.scene.update({
      //   where: {
      //     id: input.id,
      //   },
      //   data: {
      //     questionDescription: input.questionDescription,
      //     questionType: input.questionType,
      //     question: input.question,
      //     answerType: input.answerType,
      //     answers: {
      //       upsert: input.answers.map((answer) => ({
      //         where: { id: answer.id },
      //         create: answer,
      //         update: answer,
      //       })),
      //     },
      //   },
      // });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(() => {
      return;
    }),
});
