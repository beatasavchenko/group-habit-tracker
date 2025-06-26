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

export default async function DashboardPage() {
  return <div className="flex h-screen w-full flex-col">Open a tab</div>;
}
