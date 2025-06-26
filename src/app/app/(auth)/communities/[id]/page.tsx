import Link from "next/link";

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
import type { Community } from "~/lib/types";
import { api, HydrateClient } from "~/trpc/server";

export default async function CommunityPage() {
  const community: Community = {
    id: 1,
    name: "Water Drinkers",
    url: "/communities/1",
    image: "img.jpg",
  };

  return (
    <div className="flex h-screen w-full flex-col">
      <Header
        name={community.name}
        button={
          <div className="ml-auto">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="px-4">Join</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Join a community</DialogTitle>
                </DialogHeader>
                <DialogFooter>
                  <Button>Join</Button>
                  <Button>Join anonymously</Button>
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
