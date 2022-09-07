import { Scene } from "@prisma/client";
import { t, ServerError } from "~/server/trpc";
import { z } from "zod";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890", 5);

export const gameRouter = t.router({
  get: t.procedure
    .input(z.object({ gameId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.prisma.game.findUnique({
        where: { id: input.gameId },
      });
    }),
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

      const game = await ctx.prisma.game.create({
        data: {
          id: nanoid(),
          state: {
            currentScene: 0,
            currentStep: 0,
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
          },
          gameScenes: scenes.map((s) => s.id),
          packId: input.packId,
        },
      });

      return game;
    }),
  check: t.procedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const game = await ctx.prisma.game.findUnique({
        where: {
          id: input.gameId,
        },
      });

      if (!game) {
        throw new ServerError({
          code: "BAD_REQUEST",
          message: "Invalid game code.",
        });
      }

      return game;
    }),
  start: t.procedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.game.update({
        where: { id: input.gameId },
        data: { isStarted: true },
      });
    }),
  nextScene: t.procedure
    .input(z.object({ gameId: z.string() }))
    .mutation(async () => {
      return {};
    }),
  submitAnswer: t.procedure
    .input(z.object({ gameId: z.string(), submission: z.string() }))
    .mutation(async () => {
      return {};
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
