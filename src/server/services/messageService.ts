import type { DB_HabitType_Create, DB_MessageType_Create } from "~/lib/types";
import { habits, messages } from "../db/schema";
import { db } from "../db";
import { asc, desc, eq } from "drizzle-orm";

export async function getMessageById(id: number) {
  const message = await db
    .selectDistinct()
    .from(messages)
    .where(eq(messages.id, id));

  return message[0] ?? null;
}

export async function createMessage(messageToCreate: DB_MessageType_Create) {
  let message;
  try {
    message = await db
      .insert(messages)
      .values({
        ...messageToCreate,
      })
      .$returningId();
  } catch (error) {
    console.log("error", error);
  }

  if (!message?.[0]) return null;
  return await getMessageById(message[0]?.id);
}

export async function getGroupMessages(id: number) {
  const foundMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.groupId, id))
    .orderBy(asc(messages.createdAt));

  return foundMessages ?? [];
}
