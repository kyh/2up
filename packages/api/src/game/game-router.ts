import { generateGameCode } from "@2up/db/uuid";
import { TRPCError } from "@trpc/server";
import { sampleSize } from "lodash";
import { objectToCamel } from "ts-case-convert";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

// type SceneWithAnswers = Scene & { answers: SceneAnswer[] };

// const convertScene = (scene: SceneWithAnswers) => {
//   return {
//     questionDescription: scene.questionDescription,
//     question: scene.question,
//     questionType: scene.questionType,
//     answerType: scene.answerType,
//     sceneAnswers: scene.answers.map((sa) => ({
//       id: sa.id,
//       content: sa.content,
//       isCorrect: sa.isCorrect,
//     })),
//   };
// };

export const gameRouter = createTRPCRouter({
  check: publicProcedure
    .input(z.object({ gameCode: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // const game = await ctx.db.game.findFirst({
      //   where: { code: input.gameCode, isActive: true },
      // });
      // if (!game) {
      //   throw new TRPCError({
      //     code: "BAD_REQUEST",
      //     message: "Game not found",
      //   });
      // }
      // return game;
    }),

  create: publicProcedure
    .input(z.object({ packId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const response = await ctx.adminSupabase
        .from("packs")
        .select(
          `
        id,
        name,
        description,
        image,
        tags,
        game_length,
        is_random,
        is_public,
        is_published,
        scenes (
          id,
          question,
          question_description,
          question_type,
          answer,
          answer_description,
          answer_type
        )
      `,
        )
        .eq("id", input.packId);

      if (response.error) {
        throw response.error;
      }

      const pack = response.data[0];

      if (!pack) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid packId.",
        });
      }

      const game = await ctx.adminSupabase
        .from("games")
        .insert({
          code: generateGameCode(),
          history: [],
          game_scenes: sampleSize(pack.scenes, pack.game_length),
          pack_id: input.packId,
        })
        .select("*");

      console.log("game", game);

      return game;
    }),
});
