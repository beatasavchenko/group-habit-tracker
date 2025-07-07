import {
  createMessage,
  getGroupMessages,
} from "~/server/services/messageService";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { DB_MessageType_Zod_Create } from "~/lib/types";
import z from "zod";

export const messageRouter = createTRPCRouter({
  createMessage: protectedProcedure
    .input(
      DB_MessageType_Zod_Create.omit({
        eventType: true,
        userId: true,
        habitId: true,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user.username) return null;

      // events are not to be sent from the client
      if (input.type === "event") return null;
      const res = await createMessage({
        ...input,
        userId: ctx.session.user.id,
      });
      return res ?? null;
    }),
  getGroupMessages: protectedProcedure
    .input(z.object({ groupId: z.number() }))
    .query(async ({ ctx, input }) => {
      const res = await getGroupMessages(input.groupId);
      return res ?? [];
    }),
});
