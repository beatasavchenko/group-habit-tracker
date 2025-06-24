import type { ReactElement } from "react";
import { z } from "zod";

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

export const Partial_DB_UserType_Zod = DB_UserType_Zod.partial().extend({
  id: DB_UserType_Zod.shape.id,
});
