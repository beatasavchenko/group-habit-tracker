"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { LatestPost } from "~/app/_components/post";
import { CreateTabs } from "~/components/CreateTabs";
import { Header } from "~/components/Header";
import PageLayout from "~/components/PageLayout";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { ModeToggle } from "~/components/ui/mode-toggle";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/react";

export default function GroupPage() {
  const params = useParams<{ id: string }>();

  const { data: group } = api.group.getGroupByUsername.useQuery({
    groupUsername: params.id,
  });

  return (
    <div className="flex h-screen w-full flex-col">
      <Header
        name={group?.groups?.name ?? "My Group"}
        button={
          <div className="ml-auto">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="px-4">Invite</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    Invite your friends or family members to the group
                  </DialogTitle>
                </DialogHeader>
                <DialogFooter>
                  <Button>Join</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
      />
      <ScrollArea className="h-[calc(100vh-40px)]"></ScrollArea>
    </div>
  );
}
