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
  getUsersByUsernameOrEmail,
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
      const res = await getUsersByUsernameOrEmail(input.username, input.email);
      return res ?? null;
    }),
});
