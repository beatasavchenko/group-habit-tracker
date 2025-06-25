import { z } from "zod";
import { DB_GroupType_Zod } from "~/lib/types";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { createGroup } from "~/server/services/groupService";

export const groupRouter = createTRPCRouter({
  createGroup: publicProcedure
    .input(DB_GroupType_Zod)
    .mutation(async ({ ctx, input }) => {
      const res = await createGroup(input);
      return res ?? null;
    }),
});
