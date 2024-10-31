import { relations, sql } from "drizzle-orm";
import { pgEnum, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { authUsers } from "drizzle-orm/supabase";

export const usersRelations = relations(authUsers, ({ many }) => ({
  teamMembers: many(teamMembers),
  invitationsSent: many(invitations),
}));

export const teams = pgTable("teams", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.varchar({ length: 255 }).notNull(),
  slug: t.text().unique(),
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
    .$onUpdateFn(() => sql`now()`),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
  teamMembers: many(teamMembers),
  tasks: many(tasks),
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
    role: t.varchar({ length: 50 }).notNull(),
    joinedAt: t
      .timestamp({ mode: "date", withTimezone: true })
      .notNull()
      .defaultNow(),
  }),
  (t) => ({
    compoundKey: primaryKey({
      columns: [t.userId, t.teamId],
    }),
  }),
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

export const taskLabel = pgEnum("task_label", [
  "bug",
  "feature",
  "enhancement",
  "documentation",
]);

export const taskPriority = pgEnum("task_priority", ["low", "medium", "high"]);

export const taskStatus = pgEnum("task_status", [
  "todo",
  "in-progress",
  "done",
  "canceled",
]);

export const tasks = pgTable("tasks", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  teamId: t
    .uuid()
    .notNull()
    .references(() => teams.id),
  userId: t.uuid().references(() => authUsers.id),
  slug: t.text(),
  title: t.text(),
  status: taskStatus().default("todo").notNull(),
  label: taskLabel().default("bug").notNull(),
  priority: taskPriority().default("low").notNull(),
  createdAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  team: one(teams, {
    fields: [tasks.teamId],
    references: [teams.id],
  }),
  user: one(authUsers, {
    fields: [tasks.userId],
    references: [authUsers.id],
  }),
}));

export const notificationChannel = pgEnum("notification_channel", [
  "in_app",
  "email",
  "push",
]);

export const notificationType = pgEnum("notification_type", [
  "info",
  "warning",
  "error",
]);

export const notifications = pgTable("notifications", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  userId: t.uuid().references(() => authUsers.id),
  type: notificationType().default("info").notNull(),
  body: t.varchar({ length: 5000 }).notNull(),
  link: t.varchar({ length: 255 }),
  channel: notificationChannel().default("in_app").notNull(),
  dismissed: t.boolean().default(false).notNull(),
  expiresAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .default(sql`(now() + '1 mon'::interval)`),
  createdAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(authUsers, {
    fields: [notifications.userId],
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
