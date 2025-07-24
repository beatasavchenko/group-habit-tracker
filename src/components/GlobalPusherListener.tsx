import { useEffect } from "react";
import { toast } from "sonner";
import { useMessageStore } from "~/app/stores/messageStore";
import { pusherClient } from "~/lib/pusher";
import type { Message } from "~/lib/types";
import { toPusherKey } from "~/lib/utils";

export default function GlobalPusherHandler({ userId }: { userId: number }) {
  const addUnread = useMessageStore((s) => s.addUnread);

  useEffect(() => {
    console.log(userId);

    if (!userId) return;

    const groupChannel = toPusherKey("all-groups");

    pusherClient.subscribe(groupChannel);

    const handler = (message: Message) => {
      if (userId === message.userId) return;

      toast(`New message in group ${message.groupId}`);
      addUnread(message.groupId);
    };

    pusherClient.bind("incoming-message", handler);

    return () => {
      pusherClient.unbind("incoming-message", handler);
      pusherClient.unsubscribe(groupChannel);
    };
  }, [userId]);

  return null;
}
