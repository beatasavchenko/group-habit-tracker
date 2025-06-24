import { z } from "zod";
import { DB_UserType_Zod, Partial_DB_UserType_Zod } from "~/lib/types";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  findUserByEmail,
  getUsersByUsername,
  updateUser,
} from "~/server/services/userService";

export const userRouter = createTRPCRouter({
  createUser: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      return {
        greeting: "Hello",
      };
    }),
  updateUser: publicProcedure
    .input(Partial_DB_UserType_Zod)
    .mutation(async ({ ctx, input }) => {
      const res = await updateUser(input.id, { ...input });
      return res ?? null;
    }),
  getUsersByUsername: publicProcedure
    .input(z.object({ username: z.string() }).nullable())
    .mutation(async ({ ctx, input }) => {
      if (!input) return [];
      const res = await getUsersByUsername(input.username);
      return res ?? null;
    }),
});
