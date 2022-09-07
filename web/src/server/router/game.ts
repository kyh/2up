import { Scene } from "@prisma/client";
import { t, ServerError } from "~/server/trpc";
import { z } from "zod";
import { customAlphabet } from "nanoid";
import type { PrismaClient } from "@prisma/client";
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

const compareAnswer = (answer: string, answerToCompare: string) => {
  return answer.trim().toLowerCase() === answerToCompare.trim().toLowerCase();
};

export const gameRouter = t.router({
  get: t.procedure
    .input(z.object({ gameId: z.string() }))
    .query(({ ctx, input }) => findGameOrThrow(ctx.prisma, input.gameId)),
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
        currentScene: 0,
        currentStep: 1,
        submissions: [],
        totalScenes: scenes.length,
        duration: 40,
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
  check: t.procedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async ({ ctx, input }) =>
      findGameOrThrow(ctx.prisma, input.gameId)
    ),
  start: t.procedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.game.update({
        where: { id: input.gameId },
        data: { isStarted: true },
      });
    }),
  nextStep: t.procedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async () => {
      return {};
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
      const shouldAdvanceStep = updatedSubmissions.length === input.numPlayers;

      return ctx.prisma.game.update({
        where: { id: input.gameId },
        data: {
          state: {
            ...gameState,
            currentStep: shouldAdvanceStep ? 2 : 1,
            submissions: updatedSubmissions,
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
