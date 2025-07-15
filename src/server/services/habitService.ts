import type {
  DB_HabitType_Create,
  DB_UserHabitType_Create,
  DB_UserHabitLogType_Zod_Create,
  frequencyEnum,
} from "~/lib/types";
import { habitLogs, habits, userHabits, users } from "../db/schema";
import { db } from "../db";
import { eq, and, sql, inArray, gte, lte } from "drizzle-orm";
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
  const today = dayjs().startOf("day").format("YYYY-MM-DD");

  const rows = await db
    .select({
      userHabit: userHabits,
      habit: habits,
      habitLog: habitLogs,
    })
    .from(userHabits)
    .innerJoin(habits, eq(userHabits.habitId, habits.id))
    .leftJoin(
      habitLogs,
      and(
        eq(habitLogs.userHabitId, userHabits.id),
        sql`DATE(${habitLogs.date}) = ${today}`,
      ),
    )
    .where(eq(userHabits.userId, userId));

  return rows;
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
  const today = dayjs().startOf("day");
  const yesterday = today.subtract(1, "day");

  const [user] = await db.select().from(users).where(eq(users.id, userId));
  const [userHabit] = await db
    .select({
      userHabit: userHabits,
      habit: habits,
    })
    .from(userHabits)
    .innerJoin(habits, eq(habits.id, userHabits.habitId))
    .where(eq(userHabits.id, habitDetails.userHabitId));

  if (!user || !userHabit) return null;

  const [existingLog] = await db
    .select()
    .from(habitLogs)
    .where(
      and(
        eq(habitLogs.userHabitId, habitDetails.userHabitId),
        sql`DATE(${habitLogs.date}) = ${today.format("YYYY-MM-DD")}`,
      ),
    );

  if (existingLog) {
    if (existingLog.value >= userHabit.userHabit.goal) return;

    const newValue = existingLog.value + 1;

    await db
      .update(habitLogs)
      .set({ value: newValue })
      .where(eq(habitLogs.id, existingLog.id));

    if (newValue === userHabit.userHabit.goal) {
      await createMessage({
        type: "event",
        eventType: "habit_completed",
        contents: `@${user.username} completed a daily goal for habit «${userHabit.habit.name}».`,
        groupId: userHabit.habit.groupId,
        userId,
        habitId: userHabit.habit.id,
      });
    }

    return { id: existingLog.id, value: newValue };
  }

  const [logId] = await db
    .insert(habitLogs)
    .values({ ...habitDetails, goal: userHabit.userHabit.goal, value: 1 })
    .$returningId();

  const isYesterday = dayjs(userHabit.userHabit.lastLoggedAt).isSame(
    yesterday,
    "day",
  );
  const isToday = dayjs(userHabit.userHabit.lastLoggedAt).isSame(today, "day");

  await db
    .update(userHabits)
    .set({
      streakCount: isYesterday
        ? userHabit.userHabit.streakCount + 1
        : isToday
          ? userHabit.userHabit.streakCount
          : 1,
      lastLoggedAt: today.toDate(),
    })
    .where(eq(userHabits.id, habitDetails.userHabitId));

  let globalStreak = 1;
  if (dayjs(user.globalLastLoggedAt).isSame(yesterday, "day")) {
    globalStreak = user.globalStreakCount + 1;
  }

  await db
    .update(users)
    .set({
      globalStreakCount: globalStreak,
      globalLastLoggedAt: today.toDate(),
    })
    .where(eq(users.id, userId));

  await createMessage({
    type: "event",
    eventType: "streak_updated",
    contents: `@${user.username} has prolonged their streak to ${globalStreak} days.`,
    groupId: userHabit.habit.groupId,
    userId,
  });

  return { id: logId, value: 1 };
}

export async function getHabitLogs(
  view: "week" | "month" | "year",
  userHabitId: number,
) {
  const today = dayjs().startOf("day");

  switch (view) {
    case "week": {
      const weekStart = dayjs().startOf("week").toDate();
      const weekEnd = dayjs().endOf("week").toDate();

      const habitLog = await db
        .select({
          date: habitLogs.date,
          value: habitLogs.value,
          goal: habitLogs.goal,
        })
        .from(habitLogs)
        .where(
          and(
            eq(habitLogs.userHabitId, userHabitId),
            gte(habitLogs.date, weekStart),
            lte(habitLogs.date, weekEnd),
          ),
        );

      return habitLog;
    }

    case "month": {
      const monthStart = dayjs().startOf("month").toDate();
      const monthEnd = dayjs().endOf("month").toDate();

      const habitLog = await db
        .select({
          date: habitLogs.date,
          value: habitLogs.value,
          goal: userHabits.goal,
        })
        .from(habitLogs)
        .innerJoin(userHabits, eq(habitLogs.userHabitId, userHabits.id))
        .where(
          and(
            eq(habitLogs.userHabitId, userHabitId),
            gte(habitLogs.date, monthStart),
            lte(habitLogs.date, monthEnd),
          ),
        );

      return habitLog;
    }

    case "year": {
      const yearStart = dayjs().startOf("year").toDate();
      const yearEnd = dayjs().endOf("year").toDate();

      const habitLog = await db
        .select({
          date: habitLogs.date,
          value: habitLogs.value,
          goal: userHabits.goal,
        })
        .from(habitLogs)
        .innerJoin(userHabits, eq(habitLogs.userHabitId, userHabits.id))
        .where(
          and(
            eq(habitLogs.userHabitId, userHabitId),
            gte(habitLogs.date, yearStart),
            lte(habitLogs.date, yearEnd),
          ),
        );

      return habitLog;
    }
  }
}
