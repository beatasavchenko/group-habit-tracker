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
  group_username: z.string().min(1),
  name: z.string(),
  image: z.string().optional().nullable(),
  groupMembers: z.array(z.string()).optional().nullable(),
  habits: z.array(z.number()).optional().nullable(),
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

export const DB_HabitType_Zod = z.object({
  id: z.number().int().nonnegative(),
  name: z.string(),
  description: z.string().nullable(),
  color: z.string().nullable(),
  goal: z.number().nullable(),
  unit: z.string().nullable(),
  frequency: z.enum(frequencyEnum),
  groupId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date().nullable(),
});

export const DB_HabitType_Zod_Create = z.object({
  name: z.string(),
  description: z.string().optional().nullable(),
  color: z.string(),
  goal: z.number().optional().nullable(),
  unit: z.string().optional().nullable(),
  frequency: z.enum(frequencyEnum),
  groupId: z.number(),
});

export type DB_HabitType_Create = z.infer<typeof DB_HabitType_Zod_Create>;
