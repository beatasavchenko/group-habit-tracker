// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { is, relations, sql } from "drizzle-orm";
import { integer } from "drizzle-orm/gel-core";
import {
  bigint,
  boolean,
  index,
  int,
  primaryKey,
  singlestoreEnum,
  singlestoreTable,
  singlestoreTableCreator,
  text,
  timestamp,
} from "drizzle-orm/singlestore-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = singlestoreTableCreator(
  (name) => `group-habit-tracker_${name}`,
);

export const users = createTable(
  "users",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .primaryKey()
      .autoincrement(),
    username: text("username").notNull(),
    name: text("name"),
    image: text("image"),
    email: text("email").notNull(),
    code: text("code"),
    codeExpiresAt: timestamp("codeExpiresAt").defaultNow(),
    isVerified: boolean().notNull().default(false),
    friends: text("friends").$type<number[]>(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().$onUpdate(() => new Date()),
  },
  (t) => {
    return [
      index("email_idx").on(t.email),
      index("username_idx").on(t.username),
      sql`UNIQUE KEY users_email_unique (email)`,
      sql`UNIQUE KEY users_username_unique (username)`,
    ];
  },
);
export type DB_UserType = typeof users.$inferSelect;

export const usersRelations = relations(users, ({ many }) => ({
  groupMembers: many(groupMembers),
}));

// export const tags = createTable("tags", {
//   id: bigint("id", { mode: "number", unsigned: true })
//     .primaryKey()
//     .autoincrement(),
//   icon: text("icon"),
//   name: text("name"),
//   createdAt: timestamp().defaultNow().notNull(),
//   updatedAt: timestamp().$onUpdate(() => new Date()),
// });

export const groups = createTable(
  "groups",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .primaryKey()
      .autoincrement(),
    name: text("name").notNull(),
    groupUsername: text("group_username").notNull(),
    image: text("image"),
    habits: text("habits").$type<number[]>(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().$onUpdate(() => new Date()),
  },
  (t) => {
    return [
      index("group_username_idx").on(t.groupUsername),
      sql`UNIQUE KEY groups_username_unique (group_username)`,
    ];
  },
);
export type DB_GroupType = typeof groups.$inferSelect;

export const groupsRelations = relations(groups, ({ many }) => ({
  groupMembers: many(groupMembers),
  habits: many(habits),
}));

export const groupMembers = createTable(
  "group_members",
  {
    groupId: bigint("group_id", { mode: "number", unsigned: true }),
    userId: bigint("user_id", { mode: "number", unsigned: true }),
    role: text("role")
      .default("member")
      .$type<"owner" | "member" | "admin" | "pending">(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.groupId] })],
);

export const groupMemberRelations = relations(groupMembers, ({ one }) => ({
  user: one(users, {
    fields: [groupMembers.userId],
    references: [users.id],
  }),
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
}));
export type DB_GroupMemberType = typeof groupMembers.$inferSelect;

// export const communities = createTable("communities", {
//   id: bigint("id", { mode: "number", unsigned: true })
//     .primaryKey()
//     .autoincrement(),
//   name: text("name"),
//   tags: text("tags").$type<number[]>(),
//   members: text("members").$type<number[]>(),
//   image: text("image"),
//   createdAt: timestamp().defaultNow().notNull(),
//   updatedAt: timestamp().$onUpdate(() => new Date()),
// });

export const habits = createTable(
  "habits",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .primaryKey()
      .autoincrement(),
    name: text("name").notNull(),
    description: text("description"),
    color: text("color").default("#54478c").notNull(),
    goal: bigint("goal", { mode: "number", unsigned: true }),
    unit: text("unit"),
    frequency: singlestoreEnum(["day", "week", "month"]).notNull(),
    groupId: bigint("group_id", { mode: "number", unsigned: true }).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().$onUpdate(() => new Date()),
  },
  (t) => [primaryKey({ columns: [t.groupId] })],
);
export type DB_HabitType = typeof habits.$inferSelect;

export const personalHabit = createTable("personalHabits", {
  id: bigint("id", { mode: "number", unsigned: true })
    .primaryKey()
    .autoincrement(),
  habitId: bigint("habitId", { mode: "number", unsigned: true }),
  userId: bigint("userId", { mode: "number", unsigned: true }),
  groupId: bigint("groupId", { mode: "number", unsigned: true }),
  personalGoal: text("personalGoal").$type<string>(),
  basicGoal: text("basicGoal").$type<string>(),
  isCompleted: boolean().notNull().default(false),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
});

export const messages = createTable(
  "messages",
  {
    id: bigint("id", { mode: "number", unsigned: true })
      .primaryKey()
      .autoincrement(),
    type: singlestoreEnum(["message", "event"]).notNull(),
    contents: text("contents").notNull(),
    groupId: bigint("group_id", { mode: "number", unsigned: true }).notNull(),
    userId: bigint("user_id", { mode: "number", unsigned: true }),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().$onUpdate(() => new Date()),
  },
  (t) => [primaryKey({ columns: [t.userId, t.groupId] })],
);
export type DB_MessageType = typeof messages.$inferSelect;
