import type { DB_HabitType_Create, DB_UserHabitType_Create } from "~/lib/types";
import { habits, userHabits } from "../db/schema";
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
      goal: habitToCreate.goal ?? 1,
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

export async function joinHabit(habitToCreate: DB_UserHabitType_Create) {
  const user = await getUserById(habitToCreate.userId);

  if (!user) return null;

  const existingHabit = await getHabitById(habitToCreate.habitId);

  if (!existingHabit) return null;

  const habit = await db
    .insert(userHabits)
    .values({
      ...habitToCreate,
      goal: habitToCreate.goal ?? 1,
    })
    .$returningId();

  if (!habit[0]) return null;

  const message = await createMessage({
    type: "event",
    eventType: "habit_created",
    contents: `@${user.username} joined a habit «${existingHabit.name}».`,
    groupId: habitToCreate.groupId,
    userId: habitToCreate.userId,
    habitId: habit[0].id,
  });

  if (!message) return null;

  return await getHabitById(habit[0]?.id);
}
