import {
  DB_HabitType_Zod_Create,
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
  getHabitById,
  joinHabit,
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
});
