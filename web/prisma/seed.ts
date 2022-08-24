import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // reset packs
  // await prisma.packs.deleteMany({});
  // await prisma.packs.createMany({
  //   data: prompts.map((p) => ({ content: p })),
  //   skipDuplicates: true,
  // });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
