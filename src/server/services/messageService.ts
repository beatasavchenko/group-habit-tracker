import type { DB_HabitType_Create, DB_MessageType_Create } from "~/lib/types";
import { habits, messages } from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

export async function findMessageById(id: number) {
  const message = await db
    .selectDistinct()
    .from(messages)
    .where(eq(messages.id, id));

  return message[0] ?? null;
}

export async function createMessage(messageToCreate: DB_MessageType_Create) {
  const message = await db
    .insert(messages)
    .values({
      ...messageToCreate,
    })
    .$returningId();

  if (!message[0]) return null;
  return await findMessageById(message[0]?.id);
}

export async function getGroupMessages(id: number) {
  const foundMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.groupId, id));

  return foundMessages ?? [];
}
