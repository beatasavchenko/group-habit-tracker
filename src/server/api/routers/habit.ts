import {
  DB_HabitType_Zod_Create,
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
  findGroupById,
  findGroupByUsername,
  getGroupsForUser,
  updateGroup,
} from "~/server/services/groupService";
import { createHabit } from "~/server/services/habitService";
import z from "zod";

export const habitRouter = createTRPCRouter({
  createHabit: protectedProcedure
    .input(DB_HabitType_Zod_Create)
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user.username) return null;
      const res = await createHabit(input);
      return res ?? null;
    }),
  getGroupsForUser: protectedProcedure.query(async ({ ctx, input }) => {
    const res = await getGroupsForUser(ctx.userId);
    return res ?? [];
  }),
  getGroupById: protectedProcedure
    .input(z.object({ groupId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!input) return null;
      const res = await findGroupById(input.groupId);
      return res ?? null;
    }),
  getGroupByUsername: protectedProcedure
    .input(z.object({ groupUsername: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!input) return null;
      const res = await findGroupByUsername(input.groupUsername);
      return res ?? null;
    }),
  updateGroup: protectedProcedure
    .input(Partial_DB_GroupType_Zod)
    .mutation(async ({ ctx, input }) => {
      const res = await updateGroup(input.id, { ...input });
      return res ?? null;
    }),
  addGroupMembers: protectedProcedure
    .input(
      z.object({
        groupId: z.number(),
        groupUsername: z.string(),
        members: z.array(
          z.object({
            usernameOrEmail: z.string(),
            role: z.enum(["admin", "member"]),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user.username) return null;
      const res = await addGroupMembers(
        ctx.userId,
        input.groupId,
        input.groupUsername,
        [
          ...(input.members ?? []),
          {
            usernameOrEmail: ctx.session?.user.username,
            role: "member" as const,
          },
        ],
      );
      return res ?? null;
    }),
  deleteGroupMember: protectedProcedure
    .input(
      z.object({
        groupId: z.number(),
        groupMemberId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user.username) return null;
      const res = await deleteGroupMember(input.groupId, input.groupMemberId);
      return res ?? null;
    }),
});
