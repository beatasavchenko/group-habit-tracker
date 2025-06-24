import { eq } from "drizzle-orm";
import { users, type DB_UserType } from "~/server/db/schema";
import { db } from "~/server/db";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
  NumberDictionary,
} from "unique-names-generator";

export async function findUserByEmail(email: string) {
  const user = await db
    .selectDistinct()
    .from(users)
    .where(eq(users.email, email));

  return user[0] ?? null;
}

export async function findUserById(id: number) {
  const user = await db.selectDistinct().from(users).where(eq(users.id, id));

  return user[0] ?? null;
}

export async function createUser(userToCreate: Partial<DB_UserType>) {
  if (!userToCreate.email) {
    return null;
  }
  const numberDictionary = NumberDictionary.generate({ min: 100, max: 999 });
  const username = uniqueNamesGenerator({
    dictionaries: [adjectives, animals, numberDictionary],
    separator: "",
    style: "lowerCase",
    length: 3,
  });

  const user = await db
    .insert(users)
    .values({
      ...userToCreate,
      email: userToCreate.email,
      username,
      isVerified: false,
      code: null,
      codeExpiresAt: null,
    })
    .$returningId();

  if (!user[0]) return null;
  return await findUserById(user[0]?.id);
}

export async function updateUser(
  id: number,
  data: Partial<{
    email: string;
    code: string | null;
    isVerified: boolean;
    codeExpiresAt: Date | null;
  }>,
) {
  const user = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .$dynamic();

  if (!user[0]) return null;
  return await findUserById(user[0]?.insertId);
}

export async function getUsersByUsername(username: string) {
  const usersList = await db
    .selectDistinct()
    .from(users)
    .where(eq(users.username, username));

  return usersList.length > 0 ? usersList : null;
}
