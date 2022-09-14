import type { Scene, PrismaClient } from "@prisma/client";
import { t, ServerError } from "~/server/trpc";
import { z } from "zod";
import { customAlphabet } from "nanoid";
import { compareAnswer, upsert, calculateScore } from "~/lib/game/gameUtils";
import type { GameState } from "~/lib/game/gameStore";

const nanoid = customAlphabet("1234567890", 5);

const findGameOrThrow = async (prisma: PrismaClient, gameId: string) => {
  const game = await prisma.game.findUnique({
    where: { id: gameId },
  });

  if (!game || game.isFinished) {
    throw new ServerError({
      code: "BAD_REQUEST",
      message: "Game not found",
    });
  }

  return game;
};

export const gameRouter = t.router({
  get: t.procedure
    .input(z.object({ gameId: z.string() }))
    .query(({ ctx, input }) => findGameOrThrow(ctx.prisma, input.gameId)),
  check: t.procedure
    .input(z.object({ gameId: z.string() }))
    .mutation(({ ctx, input }) => findGameOrThrow(ctx.prisma, input.gameId)),
  create: t.procedure
    .input(z.object({ packId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const pack = await ctx.prisma.pack.findUnique({
        where: {
          id: input.packId,
        },
      });

      if (!pack) {
        throw new ServerError({
          code: "BAD_REQUEST",
          message: "Invalid packId.",
        });
      }

      let scenes: Scene[] = [];
      if (pack.isRandom) {
        scenes = await ctx.prisma.$queryRawUnsafe(
          `SELECT * FROM "Scene" WHERE "packId"='${input.packId}' ORDER BY RANDOM() LIMIT ${pack.gameLength};`
        );
      } else {
        scenes = await ctx.prisma.scene.findMany({
          where: {
            packId: input.packId,
          },
          orderBy: {
            order: "asc",
          },
          take: pack.gameLength,
        });
      }

      const [firstScene] = scenes;
      const sceneAnswers = await ctx.prisma.sceneAnswer.findMany({
        where: {
          sceneId: firstScene.id,
        },
      });

      const gameState: GameState = {
        currentStep: 1,
        currentScene: 0,
        totalScenes: scenes.length,
        playerScores: [],
        submissions: [],
        duration: 45,
        startTime: Date.now(),
        questionDescription: firstScene.questionDescription,
        question: firstScene.question,
        questionType: firstScene.questionType,
        answerType: firstScene.answerType,
        sceneAnswers: sceneAnswers.map((sa) => ({
          id: sa.id,
          content: sa.content,
          isCorrect: sa.isCorrect,
        })),
      };

      const game = await ctx.prisma.game.create({
        data: {
          id: nanoid(),
          state: gameState,
          gameScenes: scenes.map((s) => s.id),
          packId: input.packId,
        },
      });

      return game;
    }),
  join: t.procedure
    .input(
      z.object({
        gameId: z.string(),
        playerName: z.string(),
        playerId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // TODO
    }),
  start: t.procedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const game = await findGameOrThrow(ctx.prisma, input.gameId);
      const gameState = game.state as unknown as GameState;

      return ctx.prisma.game.update({
        where: { id: input.gameId },
        data: {
          isStarted: true,
          state: {
            ...gameState,
            startTime: Date.now(),
          },
        },
      });
    }),
  nextStep: t.procedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const game = await findGameOrThrow(ctx.prisma, input.gameId);
      const gameState = game.state as unknown as GameState;

      return ctx.prisma.game.update({
        where: { id: input.gameId },
        data: {
          state: {
            ...gameState,
            currentStep: gameState.currentStep + 1,
          },
        },
      });
    }),
  nextScene: t.procedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const game = await findGameOrThrow(ctx.prisma, input.gameId);
      const gameState = game.state as unknown as GameState;

      const nextScene = gameState.currentScene + 1;
      const nextSceneId = game.gameScenes[nextScene];

      if (!nextSceneId) {
        return ctx.prisma.game.update({
          where: { id: input.gameId },
          data: { state: { ...gameState, currentStep: 0 } },
        });
      }

      const scene = await ctx.prisma.scene.findUnique({
        where: { id: nextSceneId },
        include: { answers: true },
      });

      return ctx.prisma.game.update({
        where: { id: input.gameId },
        data: {
          state: {
            ...gameState,
            currentStep: 1,
            currentScene: nextScene,
            submissions: [],
            duration: 45,
            startTime: Date.now(),
            questionDescription: scene?.questionDescription,
            question: scene?.question,
            questionType: scene?.questionType,
            answerType: scene?.answerType,
            sceneAnswers: scene?.answers.map((sa) => ({
              id: sa.id,
              content: sa.content,
              isCorrect: sa.isCorrect,
            })),
          },
        },
      });
    }),
  submitAnswer: t.procedure
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
      })
    )
    .mutation(async ({ ctx, input }) => {
      const game = await findGameOrThrow(ctx.prisma, input.gameId);
      const gameState = game.state as unknown as GameState;
      const correctAnswer = gameState.sceneAnswers.find(
        (sceneAnswer) => sceneAnswer.isCorrect
      )!;

      const submission = {
        ...input.submission,
        isCorrect: compareAnswer(
          input.submission.content,
          correctAnswer.content
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
          gameState.duration
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
        })
      );

      const shouldAdvanceStep = updatedSubmissions.length >= input.numPlayers;

      return ctx.prisma.game.update({
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
  end: t.procedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.game.update({
        where: { id: input.gameId },
        data: { isFinished: true },
      });
    }),
});
