import type { Scene, SceneAnswer } from "@prisma/client";
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
      const game = await ctx.db.game.findUnique({
        where: { code_isActive: { code: input.gameCode, isActive: true } },
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

  // start: publicProcedure
  //   .input(z.object({ gameId: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const game = await findGameOrThrow(ctx.db, input.gameId);
  //     const gameState = game.state as unknown as GameState;

  //     return ctx.db.game.update({
  //       where: { id: input.gameId },
  //       data: {
  //         isStarted: true,
  //         state: {
  //           ...gameState,
  //           currentStep: 1,
  //           startTime: Date.now(),
  //         },
  //       },
  //     });
  //   }),

  // nextStep: publicProcedure
  //   .input(z.object({ gameId: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const game = await findGameOrThrow(ctx.db, input.gameId);
  //     const gameState = game.state as unknown as GameState;

  //     return ctx.db.game.update({
  //       where: { id: input.gameId },
  //       data: {
  //         state: {
  //           ...gameState,
  //           currentStep: gameState.currentStep + 1,
  //         },
  //       },
  //     });
  //   }),

  // nextScene: publicProcedure
  //   .input(z.object({ gameId: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const game = await findGameOrThrow(ctx.db, input.gameId);
  //     const gameState = game.state as unknown as GameState;

  //     const nextScene = gameState.currentScene + 1;
  //     const scene = game.gameScenes[nextScene] as
  //       | ReturnType<typeof convertScene>
  //       | undefined;

  //     if (!scene) {
  //       return ctx.db.game.update({
  //         where: { id: input.gameId },
  //         data: { state: { ...gameState, currentStep: 0 }, isFinished: true },
  //       });
  //     }

  //     return ctx.db.game.update({
  //       where: { id: input.gameId },
  //       data: {
  //         state: {
  //           ...gameState,
  //           currentStep: 1,
  //           currentScene: nextScene,
  //           submissions: [],
  //           duration: 45,
  //           startTime: Date.now(),
  //           ...scene,
  //         },
  //       },
  //     });
  //   }),

  // submitAnswer: publicProcedure
  //   .input(
  //     z.object({
  //       gameId: z.string(),
  //       numPlayers: z.number(),
  //       submission: z.object({
  //         playerId: z.string(),
  //         playerName: z.string(),
  //         content: z.string(),
  //         isCorrect: z.boolean().optional(),
  //       }),
  //     }),
  //   )
  //   .mutation(async ({ ctx, input }) => {
  //     const game = await findGameOrThrow(ctx.db, input.gameId);
  //     const gameState = game.state as unknown as GameState;
  //     const correctAnswer = gameState.sceneAnswers.find(
  //       (sceneAnswer) => sceneAnswer.isCorrect,
  //     )!;

  //     const submission = {
  //       ...input.submission,
  //       isCorrect: compareAnswer(
  //         input.submission.content,
  //         correctAnswer.content,
  //       ),
  //     };
  //     const updatedSubmissions = [...gameState.submissions, submission];

  //     const playerScore = {
  //       playerId: input.submission.playerId,
  //       playerName: input.submission.playerName,
  //       score: calculateScore(
  //         submission.isCorrect,
  //         gameState.startTime,
  //         Date.now(),
  //         gameState.duration,
  //       ),
  //       prevScore: 0,
  //     };

  //     const updatedPlayerScores = upsert(
  //       [...gameState.playerScores],
  //       playerScore,
  //       "playerId",
  //       (oldEntry, newEntry) => ({
  //         ...newEntry,
  //         prevScore: oldEntry.score,
  //         score: oldEntry.score + newEntry.score,
  //       }),
  //     );

  //     const shouldAdvanceStep = updatedSubmissions.length >= input.numPlayers;

  //     return ctx.db.game.update({
  //       where: { id: input.gameId },
  //       data: {
  //         state: {
  //           ...gameState,
  //           currentStep: shouldAdvanceStep ? 2 : 1,
  //           submissions: updatedSubmissions,
  //           playerScores: updatedPlayerScores,
  //         },
  //       },
  //     });
  //   }),
});
