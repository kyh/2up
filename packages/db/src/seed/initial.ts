import { faker } from "@faker-js/faker";

import { db } from "../client";
import { tasks } from "../schema";
import { getSupabaseAdminClient } from "../supabase-admin-client";

const randomCount = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const generateTasks = ({
  userId,
  teamId,
  count,
}: {
  userId: string;
  teamId: string;
  count: number;
}) => {
  const results = Array(count)
    .fill(null)
    .map(() => {
      const title = faker.lorem
        .words(randomCount(2, 5))
        .replace(/^./, (letter) => letter.toUpperCase());

      return {
        userId,
        teamId,
        slug: title.toLowerCase().replace(/\s/g, "-"),
        title,
        status: faker.helpers.shuffle(tasks.status.enumValues)[0] ?? "todo",
        label: faker.helpers.shuffle(tasks.label.enumValues)[0] ?? "bug",
        priority: faker.helpers.shuffle(tasks.priority.enumValues)[0] ?? "low",
      };
    });

  return results;
};

async function main() {
  console.log("Seeding...");

  const adminClient = getSupabaseAdminClient();

  await adminClient.auth.admin.createUser({
    email: "im.kaiyu@gmail.com",
    password: "testing123",
    email_confirm: true,
  });

  const users = await db.query.authUsers.findMany({
    with: {
      teamMembers: true,
    },
  });

  for (const user of users) {
    const userTeam = user.teamMembers[0];

    if (!userTeam) continue;

    await db.insert(tasks).values(
      generateTasks({
        userId: userTeam.userId,
        teamId: userTeam.teamId,
        count: randomCount(50, 100),
      }),
    );
  }
}

main()
  .then(() => {
    console.log("Seed complete");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seed failed");
    console.error(err);
    process.exit(1);
  });
