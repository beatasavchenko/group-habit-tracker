import type {
  DB_HabitType_Create,
  DB_UserHabitType_Create,
  DB_UserHabitLogType_Zod_Create,
} from "~/lib/types";
import { habitLogs, habits, userHabits } from "../db/schema";
import { db } from "../db";
import { eq, and } from "drizzle-orm";
import { createMessage } from "./messageService";
import { getUserById } from "./userService";
import dayjs from "dayjs";

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

export async function getGroupHabits(id: number) {
  const foundGroups = await db
    .select()
    .from(habits)
    .where(eq(habits.groupId, id));

  return foundGroups ?? [];
}

export async function getUserHabits(id: number) {
  const habitId = await db
    .selectDistinct()
    .from(userHabits)
    .where(eq(userHabits.id, id));

  if (!habitId[0]?.habitId) return null;

  const rows = await db
    .select({
      userHabit: userHabits,
      habit: habits,
      habitLog: habitLogs,
    })
    .from(userHabits)
    .innerJoin(habits, eq(habits.id, habitId[0]?.habitId))
    .innerJoin(habitLogs, eq(habitLogs.userHabitId, id))
    .where(eq(userHabits.id, id));

  return rows ?? [];
}

export async function logHabit(habitDetails: DB_UserHabitLogType_Zod_Create) {
  const prevValue = await db
    .select({ value: habitLogs.value })
    .from(habitLogs)
    .where(
      and(
        eq(habitLogs.userHabitId, habitDetails.userHabitId),
        eq(habitLogs.date, dayjs().toDate()),
      ),
    );

  if (!prevValue?.[0]) return null;

  const habitLog = await db
    .insert(habitLogs)
    .values({
      ...habitDetails,
      value: prevValue[0].value++,
    })
    .$returningId();

  if (!habitLog[0]) return null;

  return habitLog[0];
}
