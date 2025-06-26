import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { DB_GroupType_Zod } from "~/lib/types";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  createGroup,
  getGroupById,
  getGroupsForUser,
} from "~/server/services/groupService";

export const groupRouter = createTRPCRouter({
  createGroup: publicProcedure
    .input(
      z.object({ name: z.string(), friends: z.array(z.string()).optional() }),
    )
    .mutation(async ({ ctx, input }) => {
      const res = await createGroup(input);
      return res ?? null;
    }),
  getGroupsForUser: publicProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session?.user.id;
      if (!userId) throw new TRPCError({ code: "UNAUTHORIZED" });

      const res = await getGroupsForUser(input.userId);
      return res ?? null;
    }),
  getGroupById: publicProcedure
    .input(z.object({ groupId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!input) return [];
      const res = await getGroupById(input.groupId);
      return res ?? null;
    }),
});
