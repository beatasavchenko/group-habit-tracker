import dayjs from "dayjs";
import { customType } from "drizzle-orm/singlestore-core";
import { spec } from "node:test/reporters";
import type { ReactElement } from "react";
import { z } from "zod";
import { habits, type DB_GroupMemberType } from "~/server/db/schema";

export type Tag = {
  value: string;
  label: string;
  icon: ReactElement;
};

export type Friend = {
  id: number;
  name: string;
  image: string;
};

export type Community = {
  id: number;
  name: string;
  url: string;
  image: string;
};

export const DB_UserType_Zod = z.object({
  id: z.number().int().nonnegative(),
  username: z.string().min(1),
  name: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  email: z.string().email(),
  code: z.string().optional().nullable(),
  codeExpiresAt: z.date().optional().nullable(),
  isVerified: z.boolean(),
  friends: z.array(z.number()).optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().optional().nullable(),
});

export const DB_GroupType_Zod = z.object({
  id: z.number().int().nonnegative(),
  groupUsername: z.string().min(1),
  description: z.string().optional(),
  name: z.string(),
  inviteCode: z.string(),
  image: z.string().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date().optional().nullable(),
});

export const Partial_DB_GroupType_Zod = DB_GroupType_Zod.partial().extend({
  id: DB_GroupType_Zod.shape.id,
});

export type GroupMember = DB_GroupMemberType & {
  email: string;
  username: string;
  name: string | null;
  image: string | null;
};

export type SelectedValue = {
  usernameOrEmail: string;
  role: "admin" | "member";
};

export const frequencyEnum = ["day", "week", "month"] as const;

export const DB_HabitType_Zod_Create = z.object({
  name: z.string(),
  color: z.string(),
  goal: z.number().nullable(),
  unit: z.string(),
  frequency: z.enum(["day", "week", "month"]),
  isEveryDay: z.boolean().optional(),
  specificDays: z.array(z.number()).optional(),
  numDaysPerWeek: z.number().min(1).max(7).optional(),
  enabledReminder: z.boolean().optional(),
  reminderTime: z.string().optional(),
  description: z.string().optional().nullable(),
  groupId: z.number(),
});

export type DB_HabitType_Create = z.infer<typeof DB_HabitType_Zod_Create>;

export const DB_UserHabitType_Zod_Create = z.object({
  goal: z.number().nullable(),
  frequency: z.enum(frequencyEnum),
  habitId: z.number(),
  userId: z.number(),
  groupId: z.number(),
});

export type DB_UserHabitType_Create = z.infer<
  typeof DB_UserHabitType_Zod_Create
>;

export const typeEnum = ["message", "event"] as const;
export const eventTypeEnum = [
  "habit_created",
  "habit_completed",
  "streak_updated",
] as const;

export const DB_MessageType_Zod_Create = z.object({
  type: z.enum(typeEnum),
  eventType: z.enum(eventTypeEnum).optional(),
  contents: z.string(),
  groupId: z.number(),
  userId: z.number(),
  habitId: z.number().optional(),
});

export type DB_MessageType_Create = z.infer<typeof DB_MessageType_Zod_Create>;

export const DB_UserHabitLogType_Zod_Create = z.object({
  userHabitId: z.number(),
});

export type DB_UserHabitLogType_Zod_Create = z.infer<
  typeof DB_UserHabitLogType_Zod_Create
>;

export const dateOnly = customType<{
  data: string;
  driverData: string;
}>({
  dataType() {
    return "date";
  },
});

export const colors = [
  "#54478c",
  "#2c699a",
  "#048ba8",
  "#0db39e",
  "#16db93",
  "#83e377",
  "#b9e769",
  "#efea5a",
  "#f1c453",
  "#f29e4c",
] as const;

export const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
