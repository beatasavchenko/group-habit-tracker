"use client";

import {
  Calendar,
  Check,
  ChevronsUpDown,
  Command,
  Home,
  Inbox,
  PlusCircleIcon,
  Search,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { CreateTabs } from "./CreateTabs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "cmdk";
import { cn } from "~/lib/utils";
import React from "react";
import { ModeToggle } from "./ui/mode-toggle";
import Link from "next/link";
import { Separator } from "@radix-ui/react-separator";

const communitySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  habitName: z.string().min(2, "Habit name must be at least 2 characters."),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters."),
  dailyGoal: z.number(), //TODO: think about it
  tags: z.array(z.string()).min(1, "Select at least one tag."),
});

const groupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  friends: z.array(z.string()).optional(),
});

export const formSchema = z.union([
  z.object({ community: communitySchema }),
  z.object({ group: groupSchema }),
]);

const groups = [
  {
    id: 1,
    name: "Family",
    url: "/groups/1",
    image: "img.jpg",
  },
  {
    id: 2,
    name: "Team",
    url: "/groups/2",
    image: "img.jpg",
  },
];

const communities = [
  {
    id: 1,
    name: "Water Drinkers",
    url: "/communities/1",
    image: "img.jpg",
  },
  {
    id: 2,
    name: "Yoga Enthusiasts",
    url: "/communities/2",
    image: "img.jpg",
  },
];

const allCommunities = [
  {
    id: 1,
    name: "Water Drinkers",
    url: "/communities/1",
    image: "img.jpg",
  },
  {
    id: 2,
    name: "Yoga Enthusiasts",
    url: "/communities/2",
    image: "img.jpg",
  },
  {
    id: 3,
    name: "Plant Waterers",
    url: "/communities/3",
    image: "img.jpg",
  },
  {
    id: 4,
    name: "Study Buddies",
    url: "/communities/4",
    image: "img.jpg",
  },
];

export function AppSidebar() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // defaultValues: {
    //   community: {
    //     name: "",
    //     tags: [],
    //   },
    //   group: {
    //     name: "",
    //     friends: [],
    //   },
    // },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const [open, setOpen] = React.useState(false);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <ModeToggle />
              <NavUser
                user={{ name: "Kitty", email: "kitty@example.com", avatar: "" }}
              />
              <Dialog>
                <DialogTrigger asChild>
                  <SidebarMenuButton
                    tooltip="Quick Create"
                    className="hover:text-primary-foreground active:text-primary-foreground min-w-8 duration-200 ease-linear"
                  >
                    <PlusCircleIcon />
                    <span>Quick Create</span>
                  </SidebarMenuButton>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create your community or a group</DialogTitle>
                    <DialogDescription>
                      You can either create new or join existing communities.
                    </DialogDescription>
                  </DialogHeader>
                  <CreateTabs form={form} />
                  <DialogFooter>
                    <Button
                      type="submit"
                      onClick={() => onSubmit(form.getValues())}
                    >
                      Save changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Label className="relative h-10 w-full">
                    <Search className="absolute top-1/2 left-3 z-10 -translate-y-1/2 transform text-gray-500" />
                    <Input />
                  </Label>
                </PopoverTrigger>
                <PopoverContent className="flex w-sm flex-col gap-4 border-0 p-0 py-4">
                  {allCommunities
                    .filter((community) =>
                      community.name
                        .toLowerCase()
                        .includes(
                          form.watch("community.name")?.toLowerCase() || "",
                        ),
                    )
                    .map((community) => (
                      <Link href={community.url}>{community.name}</Link>
                    ))}
                </PopoverContent>
              </Popover>
              <SidebarGroupLabel>Communities</SidebarGroupLabel>
              {communities.map((community) => (
                <SidebarMenuItem key={community.id}>
                  <SidebarMenuButton asChild>
                    <a href={community.url}>
                      <Avatar className="h-8 w-8 rounded-lg grayscale">
                        <AvatarImage
                          src={community.image}
                          alt={community.name}
                        />
                        <AvatarFallback className="rounded-lg">
                          {community.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{community.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarGroupLabel>Groups</SidebarGroupLabel>
              {groups.map((group) => (
                <SidebarMenuItem key={group.id}>
                  <SidebarMenuButton asChild>
                    <a href={group.url}>
                      <Avatar className="h-8 w-8 rounded-lg grayscale">
                        <AvatarImage src={group.image} alt={group.name} />
                        <AvatarFallback className="rounded-lg">
                          {group.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span>{group.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <Separator className="bg-sidebar-border mx-2 w-auto" />
              <SidebarMenuItem key={"calendar"}>
                <SidebarMenuButton asChild>
                  <Link href={"/calendar"}>
                    <Calendar />
                    <span>Calendar</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
