import {
  DB_HabitType_Zod_Create,
  DB_UserHabitLogType_Zod_Create,
  DB_UserHabitType_Zod_Create,
  Partial_DB_GroupType_Zod,
} from "~/lib/types";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  addGroupMembers,
  createGroup,
  deleteGroupMember,
  getGroupById,
  getGroupByUsername,
  getGroupsForUser,
  updateGroup,
} from "~/server/services/groupService";
import {
  createHabit,
  getGroupHabits,
  getHabitById,
  getHabitLogs,
  getLogsForUser,
  getUserHabits,
  joinHabit,
  logHabit,
} from "~/server/services/habitService";
import z from "zod";

export const habitRouter = createTRPCRouter({
  createHabit: protectedProcedure
    .input(DB_HabitType_Zod_Create)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user.username) return null;
      const res = await createHabit(input, ctx.session.user.id);
      return res ?? null;
    }),
  joinHabit: protectedProcedure
    .input(DB_UserHabitType_Zod_Create.omit({ userId: true }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user.username) return null;
      const res = await joinHabit({ ...input, userId: ctx.session.user.id });
      return res ?? null;
    }),
  getHabitById: protectedProcedure
    .input(z.object({ habitId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!input) return null;
      const res = await getHabitById(input.habitId);
      return res ?? null;
    }),
  getGroupHabits: protectedProcedure
    .input(z.object({ groupId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!input) return null;
      const res = await getGroupHabits(input.groupId);
      return res ?? null;
    }),
  getUserHabits: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.session?.user.id) return null;
    const res = await getUserHabits(ctx.session?.user.id);
    return res ?? null;
  }),
  logHabit: protectedProcedure
    .input(DB_UserHabitLogType_Zod_Create)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user.username) return null;
      const res = await logHabit(input, ctx.session.user.id);
      return res ?? null;
    }),
  getHabitLogs: protectedProcedure
    .input(
      z.object({
        userHabitId: z.number(),
        view: z.enum(["week", "month", "year"]),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user.username) return null;
      const res = await getHabitLogs(input.view, input.userHabitId);
      return res ?? null;
    }),
  getLogsForUser: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.session?.user.username) return null;
      const res = await getLogsForUser(ctx.session.user.id);
      return res ?? null;
    }),
});
