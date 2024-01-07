import type { Scene, SceneAnswer } from "@prisma/client/edge";
import { TRPCError } from "@trpc/server";
import { sampleSize } from "lodash";
import { z } from "zod";

import { uuid } from "@2up/db";

import { createTRPCRouter, publicProcedure } from "../trpc";

type SceneWithAnswers = Scene & { answers: SceneAnswer[] };

const convertScene = (scene: SceneWithAnswers) => {
  return {
    questionDescription: scene.questionDescription,
    question: scene.question,
    questionType: scene.questionType,
    answerType: scene.answerType,
    sceneAnswers: scene.answers.map((sa) => ({
      id: sa.id,
      content: sa.content,
      isCorrect: sa.isCorrect,
    })),
  };
};

export const gameRouter = createTRPCRouter({
  check: publicProcedure
    .input(z.object({ gameCode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const game = await ctx.db.game.findFirst({
        where: { code: input.gameCode, isActive: true },
      });

      if (!game) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Game not found",
        });
      }

      return game;
    }),

  create: publicProcedure
    .input(z.object({ packId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const pack = await ctx.db.pack.findUnique({
        where: {
          id: input.packId,
        },
        include: {
          scenes: {
            include: {
              answers: true,
            },
          },
        },
      });

      if (!pack) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid packId.",
        });
      }

      const scenes = sampleSize(pack.scenes, pack.gameLength);

      return ctx.db.game.create({
        data: {
          code: uuid.generateGameCode(),
          isActive: true,
          scenes: scenes.map(convertScene),
          packId: input.packId,
        },
      });
    }),
});
