import { generateGameCode } from "@2up/db/uuid";
import { sampleSize } from "lodash";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { checkInput, createInput } from "./game-schema";

export const gameRouter = createTRPCRouter({
  check: publicProcedure.input(checkInput).mutation(async ({ ctx, input }) => {
    const response = await ctx.adminSupabase
      .from("games")
      .select()
      .eq("code", input.gameCode)
      .neq("is_finished", true)
      .single();

    if (response.error) {
      throw response.error;
    }

    return objectToCamel(response.data);
  }),

  create: publicProcedure
    .input(createInput)
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
