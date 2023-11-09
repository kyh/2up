import type { PrismaClient, Scene, SceneAnswer } from "@prisma/client";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { customAlphabet } from "nanoid";
import { sampleSize } from "lodash";
import { compareAnswer, upsert, calculateScore } from "@/lib/game/game-utils";
import type { GameState } from "@/lib/game/game-store";

const nanoid = customAlphabet("1234567890", 5);

const findGameOrThrow = async (prisma: PrismaClient, gameId: string) => {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
  });

  if (!game || game.isFinished) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Game not found",
    });
  }

  return game;
};

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
  get: publicProcedure
    .input(z.object({ gameId: z.string() }))
    .query(({ ctx, input }) => findGameOrThrow(ctx.db, input.gameId)),

  check: publicProcedure
    .input(z.object({ gameId: z.string() }))
    .mutation(({ ctx, input }) => findGameOrThrow(ctx.db, input.gameId)),

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
      const [firstScene] = scenes;

      const gameState: GameState = {
        currentStep: 0,
        currentScene: 0,
        totalScenes: scenes.length,
        playerScores: [],
        submissions: [],
        duration: 45,
        startTime: Date.now(),
        ...convertScene(firstScene),
      };

      const game = await ctx.db.game.create({
        data: {
          id: nanoid(),
          state: gameState,
          gameScenes: scenes.map(convertScene),
          packId: input.packId,
        },
      });

      return game;
    }),

  start: publicProcedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const game = await findGameOrThrow(ctx.db, input.gameId);
      const gameState = game.state as unknown as GameState;

      return ctx.db.game.update({
        where: { id: input.gameId },
        data: {
          isStarted: true,
          state: {
            ...gameState,
            currentStep: 1,
            startTime: Date.now(),
          },
        },
      });
    }),

  nextStep: publicProcedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const game = await findGameOrThrow(ctx.db, input.gameId);
      const gameState = game.state as unknown as GameState;

      return ctx.db.game.update({
        where: { id: input.gameId },
        data: {
          state: {
            ...gameState,
            currentStep: gameState.currentStep + 1,
          },
        },
      });
    }),

  nextScene: publicProcedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const game = await findGameOrThrow(ctx.db, input.gameId);
      const gameState = game.state as unknown as GameState;

      const nextScene = gameState.currentScene + 1;
      const scene = game.gameScenes[nextScene] as
        | ReturnType<typeof convertScene>
        | undefined;

      if (!scene) {
        return ctx.db.game.update({
          where: { id: input.gameId },
          data: { state: { ...gameState, currentStep: 0 }, isFinished: true },
        });
      }

      return ctx.db.game.update({
        where: { id: input.gameId },
        data: {
          state: {
            ...gameState,
            currentStep: 1,
            currentScene: nextScene,
            submissions: [],
            duration: 45,
            startTime: Date.now(),
            ...scene,
          },
        },
      });
    }),

  submitAnswer: publicProcedure
    .input(
      z.object({
        gameId: z.string(),
        numPlayers: z.number(),
        submission: z.object({
          playerId: z.string(),
          playerName: z.string(),
          content: z.string(),
          isCorrect: z.boolean().optional(),
        }),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const game = await findGameOrThrow(ctx.db, input.gameId);
      const gameState = game.state as unknown as GameState;
      const correctAnswer = gameState.sceneAnswers.find(
        (sceneAnswer) => sceneAnswer.isCorrect,
      )!;

      const submission = {
        ...input.submission,
        isCorrect: compareAnswer(
          input.submission.content,
          correctAnswer.content,
        ),
      };
      const updatedSubmissions = [...gameState.submissions, submission];

      const playerScore = {
        playerId: input.submission.playerId,
        playerName: input.submission.playerName,
        score: calculateScore(
          submission.isCorrect,
          gameState.startTime,
          Date.now(),
          gameState.duration,
        ),
        prevScore: 0,
      };

      const updatedPlayerScores = upsert(
        [...gameState.playerScores],
        playerScore,
        "playerId",
        (oldEntry, newEntry) => ({
          ...newEntry,
          prevScore: oldEntry.score,
          score: oldEntry.score + newEntry.score,
        }),
      );

      const shouldAdvanceStep = updatedSubmissions.length >= input.numPlayers;

      return ctx.db.game.update({
        where: { id: input.gameId },
        data: {
          state: {
            ...gameState,
            currentStep: shouldAdvanceStep ? 2 : 1,
            submissions: updatedSubmissions,
            playerScores: updatedPlayerScores,
          },
        },
      });
    }),
});
