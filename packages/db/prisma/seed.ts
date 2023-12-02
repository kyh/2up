import { PrismaClient } from "@prisma/client/edge";

const prisma = new PrismaClient();

const main = async () => {
  console.log("Start seeding...");

  console.log("Done!");
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
