import { generateGameCode } from "@init/db/uuid";
import { sampleSize } from "lodash";

import { createTRPCRouter, publicProcedure } from "../trpc";
import { checkInput, createInput } from "./game-schema";

export const gameRouter = createTRPCRouter({
  check: publicProcedure.input(checkInput).mutation(async ({ ctx, input }) => {
    const response = await ctx.supabase
      .from("Games")
      .select()
      .eq("code", input.gameCode)
      .neq("isFinished", true)
      .single();

    if (response.error) {
      throw response.error;
    }

    return response.data;
  }),

  create: publicProcedure
    .input(createInput)
    .mutation(async ({ ctx, input }) => {
      const packsResponse = await ctx.supabase
        .from("Packs")
        .select(
          `
        id,
        name,
        description,
        image,
        tags,
        gameLength,
        isRandom,
        isPublic,
        isPublished,
        Scenes (
          id,
          question,
          questionDescription,
          questionType,
          answer,
          answerDescription,
          answerType
        )
      `,
        )
        .eq("id", input.packId)
        .single();

      if (packsResponse.error) {
        throw packsResponse.error;
      }

      const gamesResponse = await ctx.supabase
        .from("Games")
        .insert({
          code: generateGameCode(),
          history: [],
          gameScenes: sampleSize(
            packsResponse.data.Scenes,
            packsResponse.data.gameLength,
          ),
          packId: input.packId,
        })
        .select()
        .single();

      if (gamesResponse.error) {
        throw gamesResponse.error;
      }

      return gamesResponse.data;
    }),
});
