import type {
  DB_HabitType_Create,
  DB_UserHabitType_Create,
  DB_UserHabitLogType_Zod_Create,
} from "~/lib/types";
import { habitLogs, habits, userHabits, users } from "../db/schema";
import { db } from "../db";
import { eq, and, sql } from "drizzle-orm";
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

export async function getUserHabits(userId: number) {
  const userHabit = await db
    .select()
    .from(userHabits)
    .where(eq(userHabits.userId, userId));

  if (!userHabit[0]?.habitId) return null;

  const rows = await db
    .select({
      userHabit: userHabits,
      habit: habits,
      habitLog: habitLogs,
    })
    .from(userHabits)
    .innerJoin(habits, eq(habits.id, userHabit[0]?.habitId))
    .leftJoin(habitLogs, eq(habitLogs.userHabitId, userHabit[0]?.id))
    .where(eq(userHabits.userId, userId));

  return rows ?? [];
}

export async function getUserHabitById(userId: number, id: number) {
  const userHabit = await db
    .select()
    .from(userHabits)
    .where(
      and(eq(userHabits.userId, userId), eq(userHabits.id, userHabits.id)),
    );

  if (!userHabit[0]?.habitId) return null;

  const rows = await db
    .select({
      userHabit: userHabits,
      habit: habits,
      habitLog: habitLogs,
    })
    .from(userHabits)
    .innerJoin(habits, eq(habits.id, userHabit[0]?.habitId))
    .leftJoin(habitLogs, eq(habitLogs.userHabitId, userHabit[0]?.id))
    .where(
      and(eq(userHabits.userId, userId), eq(userHabits.id, userHabits.id)),
    );

  return rows[0] ?? null;
}

export async function logHabit(
  habitDetails: DB_UserHabitLogType_Zod_Create,
  userId: number,
) {
  const userHabit = await getUserHabitById(userId, habitDetails.userHabitId);

  const user = await db.select().from(users).where(eq(users.id, userId));

  const today = dayjs().format("YYYY-MM-DD");

  const prevValue = await db
    .select({ value: habitLogs.value, date: habitLogs.date })
    .from(habitLogs)
    .where(
      and(
        eq(habitLogs.userHabitId, habitDetails.userHabitId),
        sql`DATE(${habitLogs.date}) = ${today}`,
      ),
    );

  console.log(prevValue);

  let habitLog;
  if (prevValue[0]) {
    if (prevValue[0].value === userHabit?.userHabit.goal) return;

    const newValue = prevValue[0].value + 1;

    habitLog = await db.update(habitLogs).set({ value: newValue });

    if (newValue === userHabit?.userHabit.goal) {
      await createMessage({
        type: "event",
        eventType: "habit_completed",
        contents: `@${user[0]?.username} completed a daily goal for a habit «${userHabit.habit.name}».`,
        groupId: userHabit.habit.groupId,
        userId,
        habitId: userHabit.habit.id,
      });
    }

    if (!habitLog[0]) return null;

    return habitLog[0];
  }
  habitLog = await db
    .insert(habitLogs)
    .values({
      ...habitDetails,
      value: 1,
    })
    .$returningId();

  if (!habitLog[0]) return null;

  return habitLog[0];
}
