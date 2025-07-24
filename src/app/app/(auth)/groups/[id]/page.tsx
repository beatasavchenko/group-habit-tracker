"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Palette, SendHorizontal } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { LatestPost } from "~/app/_components/post";
import { useGroupRedirect } from "~/app/hooks/useGroupRedirect";
import { CreateTabs } from "~/components/CreateTabs";
import { Header } from "~/components/Header";
import PageLayout from "~/components/PageLayout";
import { ModeToggle } from "~/components/ui/mode-toggle";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  DB_HabitType_Zod_Create,
  DB_MessageType_Zod_Create,
  DB_UserHabitType_Zod_Create,
  type Message,
} from "~/lib/types";
import { api } from "~/trpc/react";
import { HexColorPicker } from "react-colorful";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { frequencyEnum } from "~/lib/types";
import { toast } from "sonner";
import { MessageBar } from "~/components/MessageBar";
import { useSession } from "next-auth/react";
import { parseMentionsAndHabits, toPusherKey } from "~/lib/utils";
import dayjs from "dayjs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Card, CardContent } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import JoinHabitDialog from "~/components/habits/dialogs/JoinHabitDialog";
import AddHabitDialog from "~/components/habits/dialogs/AddHabitDialog";
import { pusherClient } from "~/lib/pusher";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import { Button } from "~/components/ui/button";
import { useMessageStore } from "~/app/stores/messageStore";

export default function GroupPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const { group: groupData } = useGroupRedirect(params.id);

  // useEffect(() => {
  //   if (habitId && habitDetails.data) {
  //     joinForm.setValue("goal", habitDetails.data?.goal);
  //   }
  // }, [habitId, habitDetails.data]);

  const messageData = api.message.getGroupMessages.useQuery(
    {
      groupId: Number(groupData?.group.id),
    },
    { enabled: !!groupData?.group.id },
  );

  const { data: session, status } = useSession();

  const userId = session?.user?.id;

  const scrollRef = useRef<HTMLDivElement>(null);
  const [atBottom, setAtBottom] = useState(true);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      const threshold = 50;
      const isAtBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
      setAtBottom(isAtBottom);
    };

    el.addEventListener("scroll", handleScroll);
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!messageData.data) return;

    setMessages((prev) => {
      const existingIds = new Set(prev.map((m) => m.id));
      const merged = [...prev];

      for (const msg of messageData.data) {
        if (!existingIds.has(msg.id)) merged.push(msg);
      }

      return merged;
    });
  }, [messageData.data]);

  const { group } = useGroupRedirect(params.id);
  const clearUnread = useMessageStore((s) => s.clearUnread);

  useEffect(() => {
    if (group?.group.id) {
      clearUnread(group?.group.id);
    }
  }, [group?.group.id]);

  return (
    <div className="static flex h-screen w-full flex-col">
      <Header
        info={groupData}
        name={groupData?.group?.name ?? "My Group"}
        button={
          <div className="ml-auto">
            <AddHabitDialog groupData={groupData ?? null} />
          </div>
        }
      />
      <ScrollArea
        ref={scrollRef}
        className="h-[calc(100vh-40px)] w-full overflow-y-auto px-8 py-4"
      >
        <div className="flex h-full flex-col-reverse justify-end gap-5">
          {messages?.map((message) => {
            const isOwnMessage = message.userId === userId;
            const isEventMessage = message.type === "event";

            return (
              <div
                key={message.id}
                className={`flex w-full ${
                  isEventMessage
                    ? "justify-center"
                    : isOwnMessage
                      ? "justify-end"
                      : "justify-start"
                }`}
              >
                <Card className="border-gray-200">
                  <CardContent className="w-[30vw] rounded-xl px-6 py-3">
                    <div
                      className={`${
                        isEventMessage
                          ? "text-center"
                          : isOwnMessage
                            ? "text-right"
                            : "text-left"
                      }`}
                    >
                      {parseMentionsAndHabits(
                        message.contents,
                        message.habitId ?? undefined,
                      )}
                    </div>

                    {isEventMessage &&
                      message.eventType === "habit_created" && (
                        <JoinHabitDialog
                          groupData={groupData ?? null}
                          message={message}
                        />
                      )}

                    {!isEventMessage && (
                      <div className="text-muted-foreground mt-2 flex justify-end text-sm">
                        {dayjs(message.createdAt).format("MMM D, YYYY HH:mm")}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
        {!atBottom && (
          <Button
            className="fixed right-4 bottom-20 rounded bg-blue-500 px-3 py-1 text-white"
            onClick={() =>
              scrollRef.current?.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: "smooth",
              })
            }
          >
            New messages
          </Button>
        )}
      </ScrollArea>
      <MessageBar info={groupData} setMessages={setMessages} />
    </div>
  );
}
