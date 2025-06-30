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
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import { EllipsisVertical, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import type { group } from "console";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type HeaderProps = {
  name: string;
  button: React.ReactNode;
  info?: inferRouterOutputs<AppRouter>["group"]["getGroupByUsername"];
};

export function Header(props: HeaderProps) {
  const { name, button, info } = props;
  const router = useRouter();

  return (
    <>
      <div className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <SidebarTrigger />
        <Button
          variant={"ghost"}
          onClick={() => {
            router.push(
              "/app/groups/" + info?.groups.groupUsername + "/settings",
            );
          }}
          className="absolute left-1/2 -z-0 w-full -translate-x-1/2 transform px-8 py-8 text-xl font-semibold"
        >
          {name}
        </Button>
        <div className="z-20">{button}</div>
      </div>
      <Separator className="bg-sidebar-border w-full" />
    </>
  );
}
