import type { DB_HabitType_Create } from "~/lib/types";
import { habits } from "../db/schema";
import { db } from "../db";
import { eq } from "drizzle-orm";

export async function findHabitById(id: number) {
  const habit = await db.selectDistinct().from(habits).where(eq(habits.id, id));

  return habit[0] ?? null;
}

export async function createHabit(habitToCreate: DB_HabitType_Create) {
  const habit = await db
    .insert(habits)
    .values({
      ...habitToCreate,
    })
    .$returningId();

  if (!habit[0]) return null;
  return await findHabitById(habit[0]?.id);
}
