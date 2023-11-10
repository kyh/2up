import type { AdapterAccount } from "@auth/core/adapters";
import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

import { generateUuid } from "./uuid";

// Auth
export const userRole = pgEnum("user_role", ["admin", "user"]);

export const users = pgTable("user", {
  id: text("id").notNull().primaryKey(),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: userRole("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  packs: many(packs),
  games: many(usersToGames),
}));

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
    userIdIdx: index("user_id_idx").on(account.userId),
  }),
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = pgTable(
  "session",
  {
    sessionToken: text("sessionToken").notNull().primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (session) => ({
    userIdIdx: index("user_id_idx").on(session.userId),
  }),
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  }),
);

// Games
export const games = pgTable("games", {
  id: text("id").primaryKey().$defaultFn(generateUuid),
  history: jsonb("history"),
  gameScenes: jsonb("game_scenes"),
  gameScores: jsonb("game_scores"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const gamesRelations = relations(games, ({ many }) => ({
  players: many(usersToGames),
}));

export const usersToGames = pgTable(
  "users_to_games",
  {
    userId: text("user_id").notNull(),
    gameId: text("game_id").notNull(),
  },
  (t) => ({
    compoundKey: primaryKey(t.userId, t.gameId),
  }),
);

export const usersToGamesRelations = relations(usersToGames, ({ one }) => ({
  game: one(games, {
    fields: [usersToGames.gameId],
    references: [games.id],
  }),
  user: one(users, {
    fields: [usersToGames.userId],
    references: [users.id],
  }),
}));

// Packs
export const packs = pgTable("packs", {
  id: text("id").primaryKey().$defaultFn(generateUuid),
  name: text("name").notNull(),
  isRandom: boolean("is_random").default(true).notNull(),
  gameLength: integer("game_length").default(10).notNull(),
  imageUrl: text("image_url"),
  description: text("description"),
  userId: text("user_id").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const packsRelations = relations(packs, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [packs.userId],
    references: [users.id],
  }),
  scenes: many(scene),
  assets: many(packAssets),
  tags: many(packTagsToPacks),
}));

export const packAssets = pgTable("pack_assets", {
  id: text("id").primaryKey().$defaultFn(generateUuid),
  name: text("name").notNull(),
  url: text("url").notNull(),
  packId: text("pack_id").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const packAssetsRelations = relations(packAssets, ({ one }) => ({
  pack: one(packs, {
    fields: [packAssets.packId],
    references: [packs.id],
  }),
}));

export const packTags = pgTable("pack_tags", {
  id: text("id").primaryKey().$defaultFn(generateUuid),
  name: text("name").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const packTagsRelations = relations(packTags, ({ many }) => ({
  packs: many(packTagsToPacks),
}));

export const packTagsToPacks = pgTable(
  "pack_tags_to_packs",
  {
    packId: text("pack_id").notNull(),
    packTagId: text("pack_tag_id").notNull(),
  },
  (t) => ({
    compoundKey: primaryKey(t.packId, t.packTagId),
  }),
);

export const packTagsToPacksRelations = relations(
  packTagsToPacks,
  ({ one }) => ({
    pack: one(packs, {
      fields: [packTagsToPacks.packId],
      references: [packs.id],
    }),
    packTag: one(packTags, {
      fields: [packTagsToPacks.packTagId],
      references: [packTags.id],
    }),
  }),
);

// Scenes
export const questionType = pgEnum("question_type", [
  "text",
  "image",
  "video",
  "audio",
  "code",
]);

export const answerType = pgEnum("answer_type", ["text", "multi_text"]);

export const scene = pgTable("scenes", {
  id: text("id").primaryKey().$defaultFn(generateUuid),
  externalId: text("externalId"),
  questionType: questionType("questionType").notNull(),
  question: text("question").notNull(),
  questionDescription: text("questionDescription"),
  answerType: answerType("answerType").notNull(),
  answerDescription: text("answerDescription"),
  order: numeric("order"),
  packId: text("packId").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sceneRelations = relations(scene, ({ one, many }) => ({
  pack: one(packs, { fields: [scene.packId], references: [packs.id] }),
  answers: many(sceneAnswers),
}));

export const sceneAnswers = pgTable("scene_answers", {
  id: text("id").primaryKey().$defaultFn(generateUuid),
  content: text("content").notNull(),
  isCorrect: boolean("isCorrect").default(false),
  sceneId: text("sceneId").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const sceneAnswersRelations = relations(sceneAnswers, ({ one }) => ({
  scene: one(scene, { fields: [sceneAnswers.sceneId], references: [scene.id] }),
}));

// Waitlist
export const waitlistType = pgEnum("waitlist_type", ["account"]);

export const waitlist = pgTable("waitlist", {
  id: text("id").primaryKey().$defaultFn(generateUuid),
  type: waitlistType("type").default("account").notNull(),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});
