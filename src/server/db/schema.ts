// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { is, sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  index,
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

export const tags = createTable("tags", {
  id: bigint("id", { mode: "number", unsigned: true })
    .primaryKey()
    .autoincrement(),
  icon: text("icon"),
  name: text("name"),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
});

export const groups = createTable("groups", {
  id: bigint("id", { mode: "number", unsigned: true })
    .primaryKey()
    .autoincrement(),
  name: text("name"),
  members: text("members").$type<number[]>(),
  image: text("image"),
  habits: text("habits").$type<number[]>(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
});

export const communities = createTable("communities", {
  id: bigint("id", { mode: "number", unsigned: true })
    .primaryKey()
    .autoincrement(),
  name: text("name"),
  tags: text("tags").$type<number[]>(),
  members: text("members").$type<number[]>(),
  image: text("image"),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
});

export const habits = createTable("habits", {
  id: bigint("id", { mode: "number", unsigned: true })
    .primaryKey()
    .autoincrement(),
  name: text("name"),
  description: text("description"),
  basicGoal: text("basicGoal").$type<string>(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().$onUpdate(() => new Date()),
});

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
