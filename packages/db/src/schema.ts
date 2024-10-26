// import { relations, sql } from "drizzle-orm";
// import { pgTable, primaryKey } from "drizzle-orm/pg-core";
// import { createInsertSchema } from "drizzle-zod";
// import { z } from "zod";

// export const Post = pgTable("post", (t) => ({
//   id: t.uuid().notNull().primaryKey().defaultRandom(),
//   title: t.varchar({ length: 256 }).notNull(),
//   content: t.text().notNull(),
//   createdAt: t.timestamp().defaultNow().notNull(),
//   updatedAt: t
//     .timestamp({ mode: "date", withTimezone: true })
//     .$onUpdateFn(() => sql`now()`),
// }));

// export const CreatePostSchema = createInsertSchema(Post, {
//   title: z.string().max(256),
//   content: z.string().max(256),
// }).omit({
//   id: true,
//   createdAt: true,
//   updatedAt: true,
// });

// export const User = pgTable("user", (t) => ({
//   id: t.uuid().notNull().primaryKey().defaultRandom(),
//   name: t.varchar({ length: 255 }),
//   email: t.varchar({ length: 255 }).notNull(),
//   emailVerified: t.timestamp({ mode: "date", withTimezone: true }),
//   image: t.varchar({ length: 255 }),
// }));

// export const UserRelations = relations(User, ({ many }) => ({
//   accounts: many(Account),
// }));

// import {
//   pgTable,
//   serial,
//   varchar,
//   text,
//   timestamp,
//   integer,
// } from 'drizzle-orm/pg-core';
// import { relations } from 'drizzle-orm';

// export const users = pgTable('users', {
//   id: serial('id').primaryKey(),
//   name: varchar('name', { length: 100 }),
//   email: varchar('email', { length: 255 }).notNull().unique(),
//   passwordHash: text('password_hash').notNull(),
//   role: varchar('role', { length: 20 }).notNull().default('member'),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
//   updatedAt: timestamp('updated_at').notNull().defaultNow(),
//   deletedAt: timestamp('deleted_at'),
// });

// export const teams = pgTable('teams', {
//   id: serial('id').primaryKey(),
//   name: varchar('name', { length: 100 }).notNull(),
//   createdAt: timestamp('created_at').notNull().defaultNow(),
//   updatedAt: timestamp('updated_at').notNull().defaultNow(),
//   stripeCustomerId: text('stripe_customer_id').unique(),
//   stripeSubscriptionId: text('stripe_subscription_id').unique(),
//   stripeProductId: text('stripe_product_id'),
//   planName: varchar('plan_name', { length: 50 }),
//   subscriptionStatus: varchar('subscription_status', { length: 20 }),
// });

// export const teamMembers = pgTable('team_members', {
//   id: serial('id').primaryKey(),
//   userId: integer('user_id')
//     .notNull()
//     .references(() => users.id),
//   teamId: integer('team_id')
//     .notNull()
//     .references(() => teams.id),
//   role: varchar('role', { length: 50 }).notNull(),
//   joinedAt: timestamp('joined_at').notNull().defaultNow(),
// });

// export const activityLogs = pgTable('activity_logs', {
//   id: serial('id').primaryKey(),
//   teamId: integer('team_id')
//     .notNull()
//     .references(() => teams.id),
//   userId: integer('user_id').references(() => users.id),
//   action: text('action').notNull(),
//   timestamp: timestamp('timestamp').notNull().defaultNow(),
//   ipAddress: varchar('ip_address', { length: 45 }),
// });

// export const invitations = pgTable('invitations', {
//   id: serial('id').primaryKey(),
//   teamId: integer('team_id')
//     .notNull()
//     .references(() => teams.id),
//   email: varchar('email', { length: 255 }).notNull(),
//   role: varchar('role', { length: 50 }).notNull(),
//   invitedBy: integer('invited_by')
//     .notNull()
//     .references(() => users.id),
//   invitedAt: timestamp('invited_at').notNull().defaultNow(),
//   status: varchar('status', { length: 20 }).notNull().default('pending'),
// });

// export const teamsRelations = relations(teams, ({ many }) => ({
//   teamMembers: many(teamMembers),
//   activityLogs: many(activityLogs),
//   invitations: many(invitations),
// }));

// export const usersRelations = relations(users, ({ many }) => ({
//   teamMembers: many(teamMembers),
//   invitationsSent: many(invitations),
// }));

// export const invitationsRelations = relations(invitations, ({ one }) => ({
//   team: one(teams, {
//     fields: [invitations.teamId],
//     references: [teams.id],
//   }),
//   invitedBy: one(users, {
//     fields: [invitations.invitedBy],
//     references: [users.id],
//   }),
// }));

// export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
//   user: one(users, {
//     fields: [teamMembers.userId],
//     references: [users.id],
//   }),
//   team: one(teams, {
//     fields: [teamMembers.teamId],
//     references: [teams.id],
//   }),
// }));

// export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
//   team: one(teams, {
//     fields: [activityLogs.teamId],
//     references: [teams.id],
//   }),
//   user: one(users, {
//     fields: [activityLogs.userId],
//     references: [users.id],
//   }),
// }));

// export type User = typeof users.$inferSelect;
// export type NewUser = typeof users.$inferInsert;
// export type Team = typeof teams.$inferSelect;
// export type NewTeam = typeof teams.$inferInsert;
// export type TeamMember = typeof teamMembers.$inferSelect;
// export type NewTeamMember = typeof teamMembers.$inferInsert;
// export type ActivityLog = typeof activityLogs.$inferSelect;
// export type NewActivityLog = typeof activityLogs.$inferInsert;
// export type Invitation = typeof invitations.$inferSelect;
// export type NewInvitation = typeof invitations.$inferInsert;
// export type TeamDataWithMembers = Team & {
//   teamMembers: (TeamMember & {
//     user: Pick<User, 'id' | 'name' | 'email'>;
//   })[];
// };

import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  foreignKey,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgSchema,
  pgTable,
  pgView,
  primaryKey,
  text,
  timestamp,
  unique,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";

const authSchema = pgSchema("auth");

const users = authSchema.table("users", {
  id: uuid("id").primaryKey(),
});

export const appPermissions = pgEnum("AppPermissions", [
  "roles.manage",
  "billing.manage",
  "settings.manage",
  "members.manage",
  "invites.manage",
]);
export const billingProvider = pgEnum("BillingProvider", [
  "stripe",
  "lemon-squeezy",
  "paddle",
]);
export const notificationChannel = pgEnum("NotificationChannel", [
  "in_app",
  "email",
  "push",
]);
export const notificationType = pgEnum("NotificationType", [
  "info",
  "warning",
  "error",
]);
export const paymentStatus = pgEnum("PaymentStatus", [
  "pending",
  "succeeded",
  "failed",
]);
export const subscriptionItemType = pgEnum("SubscriptionItemType", [
  "flat",
  "per_seat",
  "metered",
]);
export const subscriptionStatus = pgEnum("SubscriptionStatus", [
  "active",
  "trialing",
  "past_due",
  "canceled",
  "unpaid",
  "incomplete",
  "incomplete_expired",
  "paused",
]);
export const taskLabel = pgEnum("TaskLabel", [
  "bug",
  "feature",
  "enhancement",
  "documentation",
]);
export const taskPriority = pgEnum("TaskPriority", ["low", "medium", "high"]);
export const taskStatus = pgEnum("TaskStatus", [
  "todo",
  "in-progress",
  "done",
  "canceled",
]);

export const notifications = pgTable(
  "Notifications",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    accountId: uuid().notNull(),
    type: notificationType().default("info").notNull(),
    body: varchar({ length: 5000 }).notNull(),
    link: varchar({ length: 255 }),
    channel: notificationChannel().default("in_app").notNull(),
    dismissed: boolean().default(false).notNull(),
    expiresAt: timestamp({ withTimezone: true, mode: "string" }).default(
      sql`(now() + '1 mon'::interval)`,
    ),
    createdAt: timestamp({ withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      idxNotificationsAccountDismissed: index(
        "idx_notifications_account_dismissed",
      ).using(
        "btree",
        table.accountId.asc().nullsLast(),
        table.dismissed.asc().nullsLast(),
        table.expiresAt.asc().nullsLast(),
      ),
      notificationsAccountIdFkey: foreignKey({
        columns: [table.accountId],
        foreignColumns: [accounts.id],
        name: "Notifications_accountId_fkey",
      }).onDelete("cascade"),
    };
  },
);

export const accounts = pgTable(
  "Accounts",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    primaryOwnerUserId: uuid()
      .default(sql`auth.uid()`)
      .notNull(),
    name: varchar({ length: 255 }).notNull(),
    slug: text(),
    email: varchar({ length: 320 }),
    isPersonalAccount: boolean().default(false).notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" }),
    createdAt: timestamp({ withTimezone: true, mode: "string" }),
    createdBy: uuid(),
    updatedBy: uuid(),
    pictureUrl: varchar({ length: 1000 }),
    publicData: jsonb().default({}).notNull(),
  },
  (table) => {
    return {
      ixAccountsIsPersonalAccount: index(
        "ix_accounts_is_personal_account",
      ).using("btree", table.isPersonalAccount.asc().nullsLast()),
      ixAccountsPrimaryOwnerUserId: index(
        "ix_accounts_primary_owner_user_id",
      ).using("btree", table.primaryOwnerUserId.asc().nullsLast()),
      uniquePersonalAccount: uniqueIndex("unique_personal_account")
        .using("btree", table.primaryOwnerUserId.asc().nullsLast())
        .where(sql`("isPersonalAccount" = true)`),
      accountsPrimaryOwnerUserIdFkey: foreignKey({
        columns: [table.primaryOwnerUserId],
        foreignColumns: [users.id],
        name: "Accounts_primaryOwnerUserId_fkey",
      }).onDelete("cascade"),
      accountsCreatedByFkey: foreignKey({
        columns: [table.createdBy],
        foreignColumns: [users.id],
        name: "Accounts_createdBy_fkey",
      }),
      accountsUpdatedByFkey: foreignKey({
        columns: [table.updatedBy],
        foreignColumns: [users.id],
        name: "Accounts_updatedBy_fkey",
      }),
      accountsSlugKey: unique("Accounts_slug_key").on(table.slug),
      accountsEmailKey: unique("Accounts_email_key").on(table.email),
      accountsSlugNullIfPersonalAccountTrue: check(
        "accounts_slug_null_if_personal_account_true",
        sql`(("isPersonalAccount" = true) AND (slug IS NULL)) OR (("isPersonalAccount" = false) AND (slug IS NOT NULL))`,
      ),
    };
  },
);

export const roles = pgTable(
  "Roles",
  {
    name: varchar({ length: 50 }).primaryKey().notNull(),
    hierarchyLevel: integer().notNull(),
  },
  (table) => {
    return {
      rolesHierarchyLevelKey: unique("Roles_hierarchyLevel_key").on(
        table.hierarchyLevel,
      ),
      rolesHierarchyLevelCheck: check(
        "Roles_hierarchyLevel_check",
        sql`"hierarchyLevel" > 0`,
      ),
    };
  },
);

export const rolePermissions = pgTable(
  "RolePermissions",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    role: varchar({ length: 50 }).notNull(),
    permission: appPermissions().notNull(),
  },
  (table) => {
    return {
      ixRolePermissionsRole: index("ix_role_permissions_role").using(
        "btree",
        table.role.asc().nullsLast(),
      ),
      rolePermissionsRoleFkey: foreignKey({
        columns: [table.role],
        foreignColumns: [roles.name],
        name: "RolePermissions_role_fkey",
      }),
      rolePermissionsRolePermissionKey: unique(
        "RolePermissions_role_permission_key",
      ).on(table.role, table.permission),
    };
  },
);

export const invitations = pgTable(
  "Invitations",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    email: varchar({ length: 255 }).notNull(),
    accountId: uuid().notNull(),
    invitedBy: uuid().notNull(),
    role: varchar({ length: 50 }).notNull(),
    inviteToken: varchar({ length: 255 }).notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    expiresAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`(CURRENT_TIMESTAMP + '7 days'::interval)`)
      .notNull(),
  },
  (table) => {
    return {
      ixInvitationsAccountId: index("ix_invitations_account_id").using(
        "btree",
        table.accountId.asc().nullsLast(),
      ),
      invitationsAccountIdFkey: foreignKey({
        columns: [table.accountId],
        foreignColumns: [accounts.id],
        name: "Invitations_accountId_fkey",
      }).onDelete("cascade"),
      invitationsInvitedByFkey: foreignKey({
        columns: [table.invitedBy],
        foreignColumns: [users.id],
        name: "Invitations_invitedBy_fkey",
      }).onDelete("cascade"),
      invitationsRoleFkey: foreignKey({
        columns: [table.role],
        foreignColumns: [roles.name],
        name: "Invitations_role_fkey",
      }),
      invitationsEmailAccountIdKey: unique(
        "Invitations_email_accountId_key",
      ).on(table.email, table.accountId),
      invitationsInviteTokenKey: unique("Invitations_inviteToken_key").on(
        table.inviteToken,
      ),
    };
  },
);

export const billingCustomers = pgTable(
  "BillingCustomers",
  {
    accountId: uuid().notNull(),
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    email: text(),
    provider: billingProvider().notNull(),
    customerId: text().notNull(),
  },
  (table) => {
    return {
      ixBillingCustomersAccountId: index(
        "ix_billing_customers_account_id",
      ).using("btree", table.accountId.asc().nullsLast()),
      billingCustomersAccountIdFkey: foreignKey({
        columns: [table.accountId],
        foreignColumns: [accounts.id],
        name: "BillingCustomers_accountId_fkey",
      }).onDelete("cascade"),
      billingCustomersAccountIdCustomerIdProviderKey: unique(
        "BillingCustomers_accountId_customerId_provider_key",
      ).on(table.accountId, table.provider, table.customerId),
    };
  },
);

export const subscriptions = pgTable(
  "Subscriptions",
  {
    id: text().primaryKey().notNull(),
    accountId: uuid().notNull(),
    billingCustomerId: uuid().notNull(),
    status: subscriptionStatus().notNull(),
    active: boolean().notNull(),
    billingProvider: billingProvider().notNull(),
    cancelAtPeriodEnd: boolean().notNull(),
    currency: varchar({ length: 3 }).notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    periodStartsAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
    periodEndsAt: timestamp({ withTimezone: true, mode: "string" }).notNull(),
    trialStartsAt: timestamp({ withTimezone: true, mode: "string" }),
    trialEndsAt: timestamp({ withTimezone: true, mode: "string" }),
  },
  (table) => {
    return {
      ixSubscriptionsAccountId: index("ix_subscriptions_account_id").using(
        "btree",
        table.accountId.asc().nullsLast(),
      ),
      subscriptionsAccountIdFkey: foreignKey({
        columns: [table.accountId],
        foreignColumns: [accounts.id],
        name: "Subscriptions_accountId_fkey",
      }).onDelete("cascade"),
      subscriptionsBillingCustomerIdFkey: foreignKey({
        columns: [table.billingCustomerId],
        foreignColumns: [billingCustomers.id],
        name: "Subscriptions_billingCustomerId_fkey",
      }).onDelete("cascade"),
    };
  },
);

export const subscriptionItems = pgTable(
  "SubscriptionItems",
  {
    id: varchar({ length: 255 }).primaryKey().notNull(),
    subscriptionId: text().notNull(),
    productId: varchar({ length: 255 }).notNull(),
    variantId: varchar({ length: 255 }).notNull(),
    type: subscriptionItemType().notNull(),
    priceAmount: numeric(),
    quantity: integer().default(1).notNull(),
    interval: varchar({ length: 255 }).notNull(),
    intervalCount: integer().notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      ixSubscriptionItemsSubscriptionId: index(
        "ix_subscription_items_subscription_id",
      ).using("btree", table.subscriptionId.asc().nullsLast()),
      subscriptionItemsSubscriptionIdFkey: foreignKey({
        columns: [table.subscriptionId],
        foreignColumns: [subscriptions.id],
        name: "SubscriptionItems_subscriptionId_fkey",
      }).onDelete("cascade"),
      subscriptionItemsSubscriptionIdProductIdVariantIdKey: unique(
        "SubscriptionItems_subscriptionId_productId_variantId_key",
      ).on(table.subscriptionId, table.productId, table.variantId),
      subscriptionItemsIntervalCountCheck: check(
        "SubscriptionItems_intervalCount_check",
        sql`"intervalCount" > 0`,
      ),
    };
  },
);

export const orders = pgTable(
  "Orders",
  {
    id: text().primaryKey().notNull(),
    accountId: uuid().notNull(),
    billingCustomerId: uuid().notNull(),
    status: paymentStatus().notNull(),
    billingProvider: billingProvider().notNull(),
    totalAmount: numeric().notNull(),
    currency: varchar({ length: 3 }).notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      ixOrdersAccountId: index("ix_orders_account_id").using(
        "btree",
        table.accountId.asc().nullsLast(),
      ),
      ordersAccountIdFkey: foreignKey({
        columns: [table.accountId],
        foreignColumns: [accounts.id],
        name: "Orders_accountId_fkey",
      }).onDelete("cascade"),
      ordersBillingCustomerIdFkey: foreignKey({
        columns: [table.billingCustomerId],
        foreignColumns: [billingCustomers.id],
        name: "Orders_billingCustomerId_fkey",
      }).onDelete("cascade"),
    };
  },
);

export const orderItems = pgTable(
  "OrderItems",
  {
    id: text().primaryKey().notNull(),
    orderId: text().notNull(),
    productId: text().notNull(),
    variantId: text().notNull(),
    priceAmount: numeric(),
    quantity: integer().default(1).notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      ixOrderItemsOrderId: index("ix_order_items_order_id").using(
        "btree",
        table.orderId.asc().nullsLast(),
      ),
      orderItemsOrderIdFkey: foreignKey({
        columns: [table.orderId],
        foreignColumns: [orders.id],
        name: "OrderItems_orderId_fkey",
      }).onDelete("cascade"),
      orderItemsOrderIdProductIdVariantIdKey: unique(
        "OrderItems_orderId_productId_variantId_key",
      ).on(table.orderId, table.productId, table.variantId),
    };
  },
);

export const tasks = pgTable(
  "Tasks",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    accountId: uuid().notNull(),
    slug: text(),
    title: text(),
    status: taskStatus().default("todo").notNull(),
    label: taskLabel().default("bug").notNull(),
    priority: taskPriority().default("low").notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" }),
    createdAt: timestamp({ withTimezone: true, mode: "string" })
      .defaultNow()
      .notNull(),
    createdBy: uuid(),
    updatedBy: uuid(),
  },
  (table) => {
    return {
      tasksAccountIdFkey: foreignKey({
        columns: [table.accountId],
        foreignColumns: [accounts.id],
        name: "Tasks_accountId_fkey",
      }).onDelete("cascade"),
      tasksCreatedByFkey: foreignKey({
        columns: [table.createdBy],
        foreignColumns: [users.id],
        name: "Tasks_createdBy_fkey",
      }),
      tasksUpdatedByFkey: foreignKey({
        columns: [table.updatedBy],
        foreignColumns: [users.id],
        name: "Tasks_updatedBy_fkey",
      }),
      tasksSlugKey: unique("Tasks_slug_key").on(table.slug),
    };
  },
);

export const waitlist = pgTable(
  "Waitlist",
  {
    id: uuid()
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    accountId: uuid(),
    email: text(),
  },
  (table) => {
    return {
      waitlistAccountIdFkey: foreignKey({
        columns: [table.accountId],
        foreignColumns: [accounts.id],
        name: "Waitlist_accountId_fkey",
      }),
      waitlistEmailKey: unique("Waitlist_email_key").on(table.email),
    };
  },
);

export const accountsMemberships = pgTable(
  "AccountsMemberships",
  {
    userId: uuid().notNull(),
    accountId: uuid().notNull(),
    accountRole: varchar({ length: 50 }).notNull(),
    createdAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ withTimezone: true, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    createdBy: uuid(),
    updatedBy: uuid(),
  },
  (table) => {
    return {
      ixAccountsMembershipsAccountId: index(
        "ix_accounts_memberships_account_id",
      ).using("btree", table.accountId.asc().nullsLast()),
      ixAccountsMembershipsAccountrole: index(
        "ix_accounts_memberships_accountrole",
      ).using("btree", table.accountRole.asc().nullsLast()),
      ixAccountsMembershipsUserId: index(
        "ix_accounts_memberships_user_id",
      ).using("btree", table.userId.asc().nullsLast()),
      accountsMembershipsUserIdFkey: foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "AccountsMemberships_userId_fkey",
      }).onDelete("cascade"),
      accountsMembershipsAccountIdFkey: foreignKey({
        columns: [table.accountId],
        foreignColumns: [accounts.id],
        name: "AccountsMemberships_accountId_fkey",
      }).onDelete("cascade"),
      accountsMembershipsAccountRoleFkey: foreignKey({
        columns: [table.accountRole],
        foreignColumns: [roles.name],
        name: "AccountsMemberships_accountRole_fkey",
      }),
      accountsMembershipsCreatedByFkey: foreignKey({
        columns: [table.createdBy],
        foreignColumns: [users.id],
        name: "AccountsMemberships_createdBy_fkey",
      }),
      accountsMembershipsUpdatedByFkey: foreignKey({
        columns: [table.updatedBy],
        foreignColumns: [users.id],
        name: "AccountsMemberships_updatedBy_fkey",
      }),
      accountsMembershipsPkey: primaryKey({
        columns: [table.userId, table.accountId],
        name: "AccountsMemberships_pkey",
      }),
    };
  },
);

export const userAccountWorkspace = pgView("UserAccountWorkspace", {
  id: uuid(),
  name: varchar({ length: 255 }),
  pictureUrl: varchar({ length: 1000 }),
  subscriptionStatus: subscriptionStatus("subscription_status"),
})
  .with({ securityInvoker: true })
  .as(
    sql`SELECT "Accounts".id, "Accounts".name, "Accounts"."pictureUrl", ( SELECT "Subscriptions".status FROM "Subscriptions" WHERE "Subscriptions"."accountId" = "Accounts".id LIMIT 1) AS subscription_status FROM "Accounts" WHERE "Accounts"."primaryOwnerUserId" = (( SELECT auth.uid() AS uid)) AND "Accounts"."isPersonalAccount" = true LIMIT 1`,
  );

export const userAccounts = pgView("UserAccounts", {
  id: uuid(),
  name: varchar({ length: 255 }),
  pictureUrl: varchar({ length: 1000 }),
  slug: text(),
  role: varchar({ length: 50 }),
})
  .with({ securityInvoker: true })
  .as(
    sql`SELECT account.id, account.name, account."pictureUrl", account.slug, membership."accountRole" AS role FROM "Accounts" account JOIN "AccountsMemberships" membership ON account.id = membership."accountId" WHERE membership."userId" = (( SELECT auth.uid() AS uid)) AND account."isPersonalAccount" = false AND (account.id IN ( SELECT "AccountsMemberships"."accountId" FROM "AccountsMemberships" WHERE "AccountsMemberships"."userId" = (( SELECT auth.uid() AS uid))))`,
  );

export const notificationsRelations = relations(notifications, ({ one }) => ({
  account: one(accounts, {
    fields: [notifications.accountId],
    references: [accounts.id],
  }),
}));

export const accountsRelations = relations(accounts, ({ one, many }) => ({
  notifications: many(notifications),
  usersInAuth_primaryOwnerUserId: one(users, {
    fields: [accounts.primaryOwnerUserId],
    references: [users.id],
    relationName: "accounts_primaryOwnerUserId_usersInAuth_id",
  }),
  usersInAuth_createdBy: one(users, {
    fields: [accounts.createdBy],
    references: [users.id],
    relationName: "accounts_createdBy_usersInAuth_id",
  }),
  usersInAuth_updatedBy: one(users, {
    fields: [accounts.updatedBy],
    references: [users.id],
    relationName: "accounts_updatedBy_usersInAuth_id",
  }),
  invitations: many(invitations),
  billingCustomers: many(billingCustomers),
  subscriptions: many(subscriptions),
  orders: many(orders),
  tasks: many(tasks),
  waitlists: many(waitlist),
  accountsMemberships: many(accountsMemberships),
}));

export const usersInAuthRelations = relations(users, ({ many }) => ({
  accounts_primaryOwnerUserId: many(accounts, {
    relationName: "accounts_primaryOwnerUserId_usersInAuth_id",
  }),
  accounts_createdBy: many(accounts, {
    relationName: "accounts_createdBy_usersInAuth_id",
  }),
  accounts_updatedBy: many(accounts, {
    relationName: "accounts_updatedBy_usersInAuth_id",
  }),
  invitations: many(invitations),
  tasks_createdBy: many(tasks, {
    relationName: "tasks_createdBy_usersInAuth_id",
  }),
  tasks_updatedBy: many(tasks, {
    relationName: "tasks_updatedBy_usersInAuth_id",
  }),
  accountsMemberships_userId: many(accountsMemberships, {
    relationName: "accountsMemberships_userId_usersInAuth_id",
  }),
  accountsMemberships_createdBy: many(accountsMemberships, {
    relationName: "accountsMemberships_createdBy_usersInAuth_id",
  }),
  accountsMemberships_updatedBy: many(accountsMemberships, {
    relationName: "accountsMemberships_updatedBy_usersInAuth_id",
  }),
}));

export const rolePermissionsRelations = relations(
  rolePermissions,
  ({ one }) => ({
    role: one(roles, {
      fields: [rolePermissions.role],
      references: [roles.name],
    }),
  }),
);

export const rolesRelations = relations(roles, ({ many }) => ({
  rolePermissions: many(rolePermissions),
  invitations: many(invitations),
  accountsMemberships: many(accountsMemberships),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  account: one(accounts, {
    fields: [invitations.accountId],
    references: [accounts.id],
  }),
  usersInAuth: one(users, {
    fields: [invitations.invitedBy],
    references: [users.id],
  }),
  role: one(roles, {
    fields: [invitations.role],
    references: [roles.name],
  }),
}));

export const billingCustomersRelations = relations(
  billingCustomers,
  ({ one, many }) => ({
    account: one(accounts, {
      fields: [billingCustomers.accountId],
      references: [accounts.id],
    }),
    subscriptions: many(subscriptions),
    orders: many(orders),
  }),
);

export const subscriptionsRelations = relations(
  subscriptions,
  ({ one, many }) => ({
    account: one(accounts, {
      fields: [subscriptions.accountId],
      references: [accounts.id],
    }),
    billingCustomer: one(billingCustomers, {
      fields: [subscriptions.billingCustomerId],
      references: [billingCustomers.id],
    }),
    subscriptionItems: many(subscriptionItems),
  }),
);

export const subscriptionItemsRelations = relations(
  subscriptionItems,
  ({ one }) => ({
    subscription: one(subscriptions, {
      fields: [subscriptionItems.subscriptionId],
      references: [subscriptions.id],
    }),
  }),
);

export const ordersRelations = relations(orders, ({ one, many }) => ({
  account: one(accounts, {
    fields: [orders.accountId],
    references: [accounts.id],
  }),
  billingCustomer: one(billingCustomers, {
    fields: [orders.billingCustomerId],
    references: [billingCustomers.id],
  }),
  orderItems: many(orderItems),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  account: one(accounts, {
    fields: [tasks.accountId],
    references: [accounts.id],
  }),
  usersInAuth_createdBy: one(users, {
    fields: [tasks.createdBy],
    references: [users.id],
    relationName: "tasks_createdBy_usersInAuth_id",
  }),
  usersInAuth_updatedBy: one(users, {
    fields: [tasks.updatedBy],
    references: [users.id],
    relationName: "tasks_updatedBy_usersInAuth_id",
  }),
}));

export const waitlistRelations = relations(waitlist, ({ one }) => ({
  account: one(accounts, {
    fields: [waitlist.accountId],
    references: [accounts.id],
  }),
}));

export const accountsMembershipsRelations = relations(
  accountsMemberships,
  ({ one }) => ({
    usersInAuth_userId: one(users, {
      fields: [accountsMemberships.userId],
      references: [users.id],
      relationName: "accountsMemberships_userId_usersInAuth_id",
    }),
    account: one(accounts, {
      fields: [accountsMemberships.accountId],
      references: [accounts.id],
    }),
    role: one(roles, {
      fields: [accountsMemberships.accountRole],
      references: [roles.name],
    }),
    usersInAuth_createdBy: one(users, {
      fields: [accountsMemberships.createdBy],
      references: [users.id],
      relationName: "accountsMemberships_createdBy_usersInAuth_id",
    }),
    usersInAuth_updatedBy: one(users, {
      fields: [accountsMemberships.updatedBy],
      references: [users.id],
      relationName: "accountsMemberships_updatedBy_usersInAuth_id",
    }),
  }),
);
