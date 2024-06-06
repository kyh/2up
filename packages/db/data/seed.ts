import { createReadStream } from "fs";
import { dirname, resolve } from "path";
import { finished } from "stream/promises";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import { parse } from "csv-parse";
import { objectToSnake } from "ts-case-convert";

import type { Database } from "../src/database.types";
import { getServiceRoleKey } from "../src/get-service-role-key";
import { getSupabaseClientKeys } from "../src/get-supabase-client-keys";

const serviceRoleKey = getServiceRoleKey();
const keys = getSupabaseClientKeys();

const client = createClient<Database>(keys.url, serviceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

const packs = [
  {
    name: "Example Pack",
    description: "Example Pack Description",
    sceneData: "example.csv",
    tags: ["example"],
  },
  {
    name: "So you think you can AWS?",
    description: "If AWS certification were like a drivers test",
    sceneData: "aws.csv",
    tags: ["code"],
  },
  {
    name: "Capitals",
    description: "Guess the capital of given country",
    sceneData: "capitals.csv",
    tags: ["featured", "geography"],
  },
  {
    name: "Crypto",
    description: "Guess the crypto of given icon",
    sceneData: "crypto.csv",
    tags: ["featured", "crypto"],
  },
  {
    name: "Flags",
    description: "Guess the name of the country by looking at its flag",
    sceneData: "flags.csv",
    tags: ["featured", "geography"],
  },
  {
    name: "States",
    description: "Guess the name of state by looking at the map",
    sceneData: "states.csv",
    tags: ["featured", "geography"],
  },
  {
    name: "Stocks",
    description: "Guess the ticker of the company",
    sceneData: "stocks.csv",
    tags: ["featured", "finance"],
  },
  {
    name: "JavaScript is weird",
    description: "A list of funny and tricky JavaScript examples",
    sceneData: "wtf-js.csv",
    tags: ["code"],
  },
];

async function main() {
  console.log("Start seeding...");

  // create packs
  console.log("Creating packs...");
  for (const pack of packs) {
    const { data } = await client.from("packs").select().eq("name", pack.name);

    if (data && data.length) {
      console.log(`"${pack.name}" pack already exists, skipping...`);
    } else {
      console.log(`Creating pack "${pack.name}"...`);

      const scenes = await processCsv(getDataPath(pack.sceneData));

      const { data: createdPack, error: createPackError } = await client
        .from("packs")
        .insert({
          name: pack.name,
          description: pack.description,
          tags: pack.tags,
        })
        .select();

      const createdPackId = createdPack?.[0].id;

      if (!createdPackId || createPackError) {
        throw createPackError;
      }

      const { data: createdScenes, error: createScenesError } = await client
        .from("scenes")
        .insert(
          scenes.map((scene) => ({
            ...scene,
            pack_id: createdPackId,
          })),
        )
        .select();

      if (!createdScenes || createScenesError) {
        throw createScenesError;
      }

      console.log(`"${pack.name}" pack created`);
    }
  }

  console.log("Done!");
}

const getDataPath = (file: string) => {
  return resolve(dirname(fileURLToPath(import.meta.url)), `./${file}`);
};

type SceneRecord = {
  external_id: string;
  question_description: string;
  question_type: Database["public"]["Enums"]["question_type"];
  question: string;
  answer: { is_correct: boolean; content: string }[];
  answer_type: Database["public"]["Enums"]["answer_type"];
  answer_description: string;
};

const processCsv = async (input: string) => {
  const records: SceneRecord[] = [];
  const parser = createReadStream(input).pipe(
    parse({
      columns: true,
    }),
  );

  parser.on("readable", () => {
    let record;
    while ((record = parser.read()) !== null) {
      // handle answerTypes
      if (record.answerType === "multiText") {
        record.answer = record.answer
          .split("-")
          .filter(Boolean)
          .map((a: string) => {
            const isCorrect = a.includes("(correct)");
            return {
              content: a.replace("(correct)", "").replace("\n", "").trim(),
              isCorrect,
            };
          });
      }

      if (record.answerType === "text") {
        record.answer = [{ content: record.answer, isCorrect: true }];
      }

      delete record.externalId;

      records.push(objectToSnake(record as unknown as SceneRecord));
    }
  });

  await finished(parser);

  return records;
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
