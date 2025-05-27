import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { CreateTabs } from "~/components/CreateTabs";
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
    <div className="h-screen w-full">
      <div className="fixed h-9 w-full text-center">
        <div className="">{community.name}</div>
        <Separator className="bg-sidebar-border mx-2 w-auto" />
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Join</Button>
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
  );
}
