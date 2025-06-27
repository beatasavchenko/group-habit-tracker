import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { DB_GroupType_Zod } from "~/lib/types";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  createGroup,
  getGroupById,
  getGroupByUsername,
  getGroupsForUser,
} from "~/server/services/groupService";

export const groupRouter = createTRPCRouter({
  createGroup: protectedProcedure
    .input(
      z.object({ name: z.string(), friends: z.array(z.string()).optional() }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user.username) return null;
      const res = await createGroup({
        ...input,
        userId: ctx.userId,
        friends: [...(input.friends ?? []), ctx.session?.user.username],
      });
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
      const res = await getGroupById(input.groupId);
      return res ?? null;
    }),
  getGroupByUsername: protectedProcedure
    .input(z.object({ groupUsername: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!input) return null;
      const res = await getGroupByUsername(input.groupUsername);
      return res ?? null;
    }),
});
