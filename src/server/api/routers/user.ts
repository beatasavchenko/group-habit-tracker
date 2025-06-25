import { z } from "zod";
import { DB_UserType_Zod, Partial_DB_UserType_Zod } from "~/lib/types";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  findUserByEmail,
  getUsersByUsername,
  updateUser,
} from "~/server/services/userService";

export const userRouter = createTRPCRouter({
  updateUser: publicProcedure
    .input(Partial_DB_UserType_Zod)
    .mutation(async ({ ctx, input }) => {
      const res = await updateUser(input.id, { ...input });
      return res ?? null;
    }),
  getUsersByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!input) return [];
      const res = await getUsersByUsername(input.username);
      return res ?? null;
    }),
});
