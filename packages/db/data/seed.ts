import { createReadStream } from "fs";
import { dirname, resolve } from "path";
import { finished } from "stream/promises";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import { parse } from "csv-parse";

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
    const { data } = await client.from("Packs").select().eq("name", pack.name);

    if (data && data.length) {
      console.log(`"${pack.name}" pack already exists, skipping...`);
    } else {
      console.log(`Creating pack "${pack.name}"...`);

      const scenes = await processCsv(getDataPath(pack.sceneData));

      const { data: createdPack, error: createPackError } = await client
        .from("Packs")
        .insert({
          name: pack.name,
          description: pack.description,
          tags: pack.tags,
        })
        .select()
        .single();

      const createdPackId = createdPack?.id;

      if (!createdPackId || createPackError) {
        throw createPackError;
      }

      const { data: createdScenes, error: createScenesError } = await client
        .from("Scenes")
        .insert(
          scenes.map((scene) => ({
            ...scene,
            packId: createdPackId,
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
  externalId: string;
  questionDescription: string;
  questionType: Database["public"]["Enums"]["QuestionType"];
  question: string;
  answer: { isCorrect: boolean; content: string }[];
  answerType: Database["public"]["Enums"]["AnswerType"];
  answerDescription: string;
};

const processCsv = async (input: string) => {
  const records: SceneRecord[] = [];
  const parser = createReadStream(input).pipe(parse({ columns: true }));

  parser.on("readable", () => {
    let record;
    while ((record = parser.read()) !== null) {
      record.answer = [{ content: record.answer, isCorrect: true }];
      delete record.externalId;
      records.push(record);
    }
  });

  await finished(parser);

  // parse answers
  const parsed = records.map((record) => {
    if (record.answerType === "multiText") {
      const randomScenes = [...records]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
      const otherRandomAnswers = randomScenes.map(
        (scene) => scene.answer[0].content,
      );
      record.answer = record.answer.concat(
        otherRandomAnswers.map((content) => ({ content, isCorrect: false })),
      );
    }

    return record;
  });

  return parsed;
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
