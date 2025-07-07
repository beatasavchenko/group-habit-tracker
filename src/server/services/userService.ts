import { and, eq, like, ne, not, notInArray, or, sql } from "drizzle-orm";
import {
  groupMembers,
  groups,
  users,
  type DB_UserType,
} from "~/server/db/schema";
import { db } from "~/server/db";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
  NumberDictionary,
} from "unique-names-generator";

export async function getUserByEmail(email: string) {
  const user = await db
    .selectDistinct()
    .from(users)
    .where(eq(users.email, email));

  return user[0] ?? null;
}

export async function getUserByUsername(username: string) {
  const user = await db
    .selectDistinct()
    .from(users)
    .where(eq(users.username, username));

  return user[0] ?? null;
}

export async function getUserById(id: number) {
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
  return await getUserById(user[0]?.id);
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
  return await getUserById(user[0]?.insertId);
}

export async function getUsersByUsernameOrEmail(
  userId: number,
  username?: string,
  email?: string,
) {
  const usersList = await db
    .select()
    .from(users)
    .where(
      and(
        or(
          like(sql`LOWER(${users.username})`, `%${username?.toLowerCase()}%`),
          like(sql`LOWER(${users.email})`, `%${email?.toLowerCase()}%`),
        ),
        ne(users.id, userId),
      ),
    );

  return usersList.length > 0 ? usersList : null;
}

export async function getUsersByUsernameOrEmailForGroup(
  userId: number,
  groupId: number,
  username?: string,
  email?: string,
) {
  const usersList = await db
    .select()
    .from(users)
    .where(
      and(
        or(
          like(sql`LOWER(${users.username})`, `%${username?.toLowerCase()}%`),
          like(sql`LOWER(${users.email})`, `%${email?.toLowerCase()}%`),
        ),
        ne(users.id, userId),
        notInArray(
          users.id,
          db
            .select({ userId: groupMembers.userId })
            .from(groupMembers)
            .where(eq(groupMembers.groupId, groupId)),
        ),
      ),
    );

  return usersList.length > 0 ? usersList : null;
}
