import type { ReactElement } from "react";
import { z } from "zod";
import { habits } from "~/server/db/schema";

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
