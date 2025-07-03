import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { DB_UserType_Zod } from "~/lib/types";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  findUserByEmail,
  findUserById,
  getUsersByUsernameOrEmail,
  getUsersByUsernameOrEmailForGroup,
  updateUser,
} from "~/server/services/userService";

export const userRouter = createTRPCRouter({
  updateUser: protectedProcedure
    .input(DB_UserType_Zod.partial())
    .mutation(async ({ ctx, input }) => {
      const res = await updateUser(ctx.userId, { ...input });
      return res ?? null;
    }),
  getUsersByUsernameOrEmail: protectedProcedure
    .input(
      z.object({
        username: z.string().optional(),
        email: z.string().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!input) return null;
      const res = await getUsersByUsernameOrEmail(
        ctx.userId,
        input.username,
        input.email,
      );
      return res ?? null;
    }),
  getUsersByUsernameOrEmailForGroup: protectedProcedure
    .input(
      z.object({
        username: z.string().optional(),
        email: z.string().optional(),
        groupId: z.number(),
      }),
    )
    .query(async ({ ctx, input }) => {
      if (!input) return null;
      const res = await getUsersByUsernameOrEmailForGroup(
        ctx.userId,
        input.groupId,
        input.username,
        input.email,
      );
      return res ?? null;
    }),
  getUserById: protectedProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!input) return null;
      const res = await findUserById(input.userId);
      return res ?? null;
    }),
});
