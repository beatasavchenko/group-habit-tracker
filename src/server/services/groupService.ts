import { generateOtp } from "~/lib/utils";
import { sendVerificationEmail } from "./emailService";
import { createUser, findUserByEmail, updateUser } from "./userService";
import { DB_GroupType_Zod } from "~/lib/types";
import dayjs from "dayjs";
import {
  adjectives,
  animals,
  NumberDictionary,
  uniqueNamesGenerator,
} from "unique-names-generator";
import z from "zod";
import { groups } from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

export async function findGroupById(id: number) {
  const user = await db.selectDistinct().from(groups).where(eq(groups.id, id));

  return user[0] ?? null;
}

export async function createGroup(
  groupToCreate: z.infer<typeof DB_GroupType_Zod>,
) {
  if (!groupToCreate.name) {
    return null;
  }
  const numberDictionary = NumberDictionary.generate({
    min: 10000,
    max: 99999,
  });
  const groupUsername = uniqueNamesGenerator({
    dictionaries: [[groupToCreate.name], numberDictionary],
    separator: "",
    style: "lowerCase",
    length: 2,
  });

  const group = await db
    .insert(groups)
    .values({
      ...groupToCreate,
      name: groupToCreate.name,
      groupUsername,
    })
    .$returningId();

  if (!group[0]) return null;
  return await findGroupById(group[0]?.id);
}
