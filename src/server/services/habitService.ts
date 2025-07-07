import type { DB_HabitType_Create } from "~/lib/types";
import { habits } from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { createMessage } from "./messageService";
import { getUserById } from "./userService";

export async function getHabitById(id: number) {
  const habit = await db.selectDistinct().from(habits).where(eq(habits.id, id));

  return habit[0] ?? null;
}

export async function createHabit(
  habitToCreate: DB_HabitType_Create,
  userId: number,
) {
  const user = await getUserById(userId);

  if (!user) return null;

  const habit = await db
    .insert(habits)
    .values({
      ...habitToCreate,
    })
    .$returningId();

  if (!habit[0]) return null;

  const message = await createMessage({
    type: "event",
    eventType: "habit_created",
    contents: `@${user.username} created a new habit «${habitToCreate.name}».`,
    groupId: habitToCreate.groupId,
    userId: userId,
    habitId: habit[0].id,
  });

  if (!message) return null;

  return await getHabitById(habit[0]?.id);
}
