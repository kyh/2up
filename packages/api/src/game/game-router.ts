import { generateGameCode } from "@2up/db/uuid";
import { TRPCError } from "@trpc/server";
import { sampleSize } from "lodash";
import { objectToCamel } from "ts-case-convert";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

// type SceneWithAnswers = Scene & { answers: SceneAnswer[] };

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
      const packsResponse = await ctx.adminSupabase
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
        .eq("id", input.packId)
        .single();

      if (packsResponse.error) {
        throw packsResponse.error;
      }

      const gamesResponse = await ctx.adminSupabase
        .from("games")
        .insert({
          code: generateGameCode(),
          history: [],
          game_scenes: sampleSize(
            packsResponse.data.scenes,
            packsResponse.data.game_length,
          ),
          pack_id: input.packId,
        })
        .select()
        .single();

      if (gamesResponse.error) {
        throw gamesResponse.error;
      }

      return objectToCamel(gamesResponse.data);
    }),
});
