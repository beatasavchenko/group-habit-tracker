import { eq } from "drizzle-orm";
import { users } from "~/server/db/schema";
import { db } from "~/server/db";

export async function findUserByEmail(email: string) {
  const user = await db
    .selectDistinct()
    .from(users)
    .where(eq(users.email, email));

  return user ?? null;
}

export async function createUser(email: string) {
  const user = await db
    .insert(users)
    .values({
      email,
    })
    .$dynamic();

  return user[0] ?? null;
}

export async function updateUser(
  id: number,
  data: Partial<{ email: string; code: string; isVerified: boolean }>,
) {
  const user = await db
    .update(users)
    .set(data)
    .where(eq(users.id, id))
    .$dynamic();

  return user;
}
