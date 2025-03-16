import { relations } from "drizzle-orm";
import { pgEnum, pgSchema, pgTable, primaryKey } from "drizzle-orm/pg-core";

/* ------------------------------ auth schema; ------------------------------ */
const auth = pgSchema("auth");

export const authUsers = auth.table("users", (t) => ({
  id: t.uuid().primaryKey().notNull(),
  email: t.varchar({ length: 255 }),
  rawUserMetaData: t.jsonb(),
}));

export const usersRelations = relations(authUsers, ({ many }) => ({
  teamMembers: many(teamMembers),
  invitationsSent: many(invitations),
}));

export const teams = pgTable("teams", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.varchar({ length: 255 }).notNull(),
  avatarUrl: t.text(),
  slug: t.text().unique().notNull(),
  stripeCustomerId: t.text().unique(),
  stripeSubscriptionId: t.text().unique(),
  stripeProductId: t.text(),
  planName: t.varchar({ length: 50 }),
  subscriptionStatus: t.varchar({ length: 20 }),
  createdAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  teamMembers: many(teamMembers),
  invitations: many(invitations),
}));

export const teamMembers = pgTable(
  "team_members",
  (t) => ({
    userId: t
      .uuid()
      .notNull()
      .references(() => authUsers.id),
    teamId: t
      .uuid()
      .notNull()
      .references(() => teams.id),
    role: t.varchar({ length: 50 }).notNull(), // owner, admin, member
    joinedAt: t
      .timestamp({ mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
  }),
  (t) => [
    primaryKey({
      columns: [t.userId, t.teamId],
    }),
  ],
);

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(authUsers, {
    fields: [teamMembers.userId],
    references: [authUsers.id],
  }),
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export const invitations = pgTable("invitations", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  teamId: t
    .uuid()
    .notNull()
    .references(() => teams.id),
  email: t.varchar("email", { length: 255 }).notNull(),
  role: t.varchar("role", { length: 50 }).notNull(),
  invitedBy: t
    .uuid()
    .notNull()
    .references(() => authUsers.id),
  invitedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .notNull()
    .defaultNow(),
  status: t.varchar({ length: 20 }).notNull().default("pending"),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  team: one(teams, {
    fields: [invitations.teamId],
    references: [teams.id],
  }),
  invitedBy: one(authUsers, {
    fields: [invitations.invitedBy],
    references: [authUsers.id],
  }),
}));

export const waitlistType = pgEnum("waitlist_type", ["app"]);

export const waitlist = pgTable("waitlist", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  userId: t.uuid().references(() => authUsers.id),
  type: waitlistType().default("app").notNull(),
  email: t.text().unique(),
}));

export const waitlistRelations = relations(waitlist, ({ one }) => ({
  user: one(authUsers, {
    fields: [waitlist.userId],
    references: [authUsers.id],
  }),
}));
