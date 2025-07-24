"use client";

import {
  Calendar,
  CalendarCheck2,
  CalendarDays,
  Check,
  ChevronsUpDown,
  Command,
  Home,
  Inbox,
  LogOut,
  PlusCircleIcon,
  Router,
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
import React, { useState } from "react";
import { ModeToggle } from "./ui/mode-toggle";
import Link from "next/link";
import { Separator } from "@radix-ui/react-separator";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/dist/server/api-utils";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { useMessageStore } from "~/app/stores/messageStore";

export const communitySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  habitName: z
    .string()
    .min(2, "Habit name must be at least 2 characters.")
    .optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters.")
    .optional(),
  dailyGoal: z.number().optional(), //TODO: think about it
  tags: z.array(z.string()).min(1, "Select at least one tag."),
});

export const groupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  friends: z.array(z.string()).optional(),
});

export const formSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("group"),
    group: groupSchema,
  }),
  z.object({
    type: z.literal("community"),
    community: communitySchema,
  }),
]);

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
    defaultValues: {
      type: "group",
      group: {
        name: "",
        friends: [],
      },
    },
  });

  const [tab, setTab] = React.useState<"community" | "group">("group");

  const [open, setOpen] = React.useState(false);

  const updateUser = api.user.updateUser.useMutation();

  const { data: session } = useSession();

  const [selectedTags, setSelectedTags] = React.useState<
    string[] | undefined
  >();

  const [selectedFriends, setSelectedFriends] = React.useState<
    string[] | undefined
  >();

  const router = useRouter();

  const [dialogOpen, setDialogOpen] = useState(false);

  const utils = api.useUtils();

  const params = useParams<{ id: string }>();

  const createGroup = api.group.createGroup.useMutation({
    onMutate: () => {
      toast.loading("Creating group...");
    },
    onSuccess: (data) => {
      toast.dismiss();
      toast.success("Group created successfully!");
      setDialogOpen(false);
      router.push(`/app/groups/${data?.groups.groupUsername}`);
      utils.group.getGroupsForUser.invalidate();
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Error creating group.");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (values.type === "group") createGroup.mutate(values.group);
  };

  const { data: groups } = api.group.getGroupsForUser.useQuery();

  const unreadGroups = useMessageStore((s) => s.unreadGroups);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="relative h-[calc(100vh-30px)]">
            <SidebarMenu className="h-full">
              <NavUser
                user={{
                  ...session?.user,
                  name: session?.user.name || "User",
                  email: session?.user.email || "user@example.com",
                  image: session?.user.image || "default.jpg",
                }}
              />
              <Dialog
                open={dialogOpen}
                onOpenChange={() => setDialogOpen(!dialogOpen)}
              >
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center justify-start"
                  >
                    <PlusCircleIcon />
                    <span>Quick Create</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create your community or a group</DialogTitle>
                    <DialogDescription>
                      You can either create new or join existing communities.
                    </DialogDescription>
                  </DialogHeader>
                  <CreateTabs
                    form={form}
                    tab={tab}
                    setTab={setTab}
                    selectedTags={selectedTags}
                    setSelectedTags={setSelectedTags}
                    selectedFriends={selectedFriends}
                    setSelectedFriends={setSelectedFriends}
                  />
                  <DialogFooter>
                    <Button
                      onClick={() => {
                        form.handleSubmit(onSubmit)();
                      }}
                      disabled={createGroup.isPending}
                    >
                      Save changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              {/* <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Label className="relative h-10 w-full">
                    <Search className="absolute top-1/2 left-3 z-10 -translate-y-1/2 transform text-gray-500" />
                    <Input />
                  </Label>
                </PopoverTrigger>
                <PopoverContent className="popover-content-width-full flex w-sm flex-col gap-4 border-0 p-0 py-4">
                  {allCommunities
                    .filter((community) =>
                      community.name
                        .toLowerCase()
                        .includes(
                          form.watch("community.name")?.toLowerCase() || "",
                        ),
                    )
                    .map((community) => (
                      <Link key={community.id} href={community.url}>
                        {community.name}
                      </Link>
                    ))}
                </PopoverContent>
              </Popover> */}
              <SidebarMenuItem key={"overview"}>
                <SidebarMenuButton asChild>
                  <Link href={"/app/overview"}>
                    <CalendarCheck2 />
                    <span>Habit overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem key={"calendar"}>
                <SidebarMenuButton asChild>
                  <Link href={"/app/calendar"}>
                    <CalendarDays />
                    <span>Calendar</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {groups && groups.length > 0 && (
                <>
                  <SidebarGroupLabel>Groups</SidebarGroupLabel>
                  {groups?.map((group) => {
                    const hasUnread = unreadGroups.has(group.id);
                    return (
                      <SidebarMenuItem key={group.id}>
                        <SidebarMenuButton asChild>
                          <a
                            className={`flex w-full items-center py-4 ${group.groupUsername === params.id && "bg-accent"}`}
                            href={`${process.env.NEXT_PUBLIC_BASE_URL}app/groups/${group.groupUsername}`}
                          >
                            <Avatar className="h-8 w-8 rounded-full">
                              <AvatarImage
                                src={group.image ?? ""}
                                alt={group.name}
                              />
                              <AvatarFallback className="rounded-full">
                                {group.name.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex w-full items-center justify-between">
                              <span>{group.name}</span>
                              {hasUnread && (
                                <span className="h-2 w-2 rounded-full bg-red-500" />
                              )}
                            </div>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </>
              )}
              {/* {communities && communities.length > 0 && (
                <>
                  <SidebarGroupLabel>Communities</SidebarGroupLabel>
                  {communities.map((community) => (
                    <SidebarMenuItem key={community.id}>
                      <SidebarMenuButton asChild>
                        <a href={community.url}>
                          <Avatar className="h-8 w-8 rounded-full">
                            <AvatarImage
                              src={community.image}
                              alt={community.name}
                            />
                            <AvatarFallback className="rounded-full">
                              {community.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span>{community.name}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </>
              )} */}
            </SidebarMenu>
            <div className="absolute right-0 bottom-0">
              <ModeToggle />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
