import { createReadStream } from "fs";
import { resolve } from "path";
import { finished } from "stream/promises";
import type { AnswerType, QuestionType } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { parse } from "csv-parse";

import { generateUuid } from "../src/uuid";

const adminUserId = process.env.ADMIN_USER_ID ?? generateUuid();

const prisma = new PrismaClient();

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

const main = async () => {
  console.log("Start seeding...");
  if (!adminUserId) throw new Error("ADMIN_USER_ID env variable is not set");

  // create admin profiles
  console.log("Creating admin profile...");
  await prisma.user.upsert({
    where: { id: adminUserId },
    update: {},
    create: {
      id: adminUserId,
      username: "admin",
      email: "im.kaiyu@gmail.com",
      role: "admin",
    },
  });

  // create packs
  console.log("Creating packs...");
  for (const pack of packs) {
    const exists = await prisma.pack.findFirst({
      where: {
        name: pack.name,
      },
    });

    if (exists) {
      console.log(`"${pack.name}" pack already exists, skipping...`);
    } else {
      console.log(`Creating pack "${pack.name}"...`);

      const scenes = await processCsv(getDataPath(pack.sceneData));

      const data = {
        name: pack.name,
        description: pack.description,
        userId: adminUserId,
        scenes: {
          create: scenes.map((scene) => ({
            ...scene,
            answers: {
              create: scene.answers,
            },
          })),
        },
        tags: {
          connectOrCreate: pack.tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
      };

      await prisma.pack.create({ data });

      console.log(`"${pack.name}" pack created`);
    }
  }

  console.log("Done!");
};

const getDataPath = (file: string) => {
  return resolve(__dirname, `./data/${file}`);
};

type SceneRecord = {
  externalId: string;
  questionDescription: string;
  questionType: QuestionType;
  question: string;
  answerType: AnswerType;
  answers: { isCorrect: boolean; content: string }[];
  answerDescription: string;
};

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
        record.answers = record.answers
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
        record.answers = [{ content: record.answers, isCorrect: true }];
      }

      records.push(record);
    }
  });

  await finished(parser);

  return records;
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
