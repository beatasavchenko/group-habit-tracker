import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { verify } from "~/server/services/authService";

export const authRouter = createTRPCRouter({
  verify: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ ctx, input }) => {
      const res = await verify(input.email);
      return res ?? null;
    }),

  // getLatest: publicProcedure.query(async ({ ctx }) => {
  //   const post = await ctx.db.query.posts.findFirst({
  //     orderBy: (posts, { desc }) => [desc(posts.createdAt)],
  //   });

  //   return post ?? null;
  // }),
});
