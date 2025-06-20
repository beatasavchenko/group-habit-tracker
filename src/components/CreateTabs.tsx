"use client";

import React from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  ChevronsUpDown,
  Check,
  Dumbbell,
  HeartPulse,
  Sprout,
  ChartLine,
  SquareLibrary,
  Wallet,
  Palette,
  Brain,
  Bath,
  BadgeEuro,
  MessageCircleHeart,
  Sparkles,
  FolderOpen,
  GraduationCap,
  Wand,
} from "lucide-react";
import { cn } from "~/lib/utils";
import { Badge } from "~/components/ui/badge";
import type { Friend, Tag } from "~/lib/types";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { formSchema } from "./app-sidebar";
import { SelectedFriends } from "./SelectedFriends";
import ComboboxComponent from "./ComboboxComponent";

const tags: Tag[] = [
  {
    value: "fitness",
    label: "Fitness",
    icon: <Dumbbell />,
  },
  {
    value: "health",
    label: "Health",
    icon: <HeartPulse />,
  },
  {
    value: "productivity",
    label: "Productivity",
    icon: <ChartLine />,
  },
  {
    value: "studying",
    label: "Studying",
    icon: <SquareLibrary />,
  },
  {
    value: "work",
    label: "Work",
    icon: <Wallet />,
  },
  {
    value: "hobby",
    label: "Hobby",
    icon: <Palette />,
  },
  {
    value: "selfcare",
    label: "Self-care",
    icon: <Bath />,
  },
  {
    value: "mentalhealth",
    label: "Mental Health",
    icon: <Brain />,
  },
  {
    value: "finance",
    label: "Finance",
    icon: <BadgeEuro />,
  },
  {
    value: "social",
    label: "Social",
    icon: <MessageCircleHeart />,
  },
  {
    value: "spirituality",
    label: "Spirituality",
    icon: <Wand />,
  },
  {
    value: "organization",
    label: "Organization",
    icon: <FolderOpen />,
  },
  {
    value: "learning",
    label: "Learning",
    icon: <GraduationCap />,
  },
  {
    value: "creativity",
    label: "Creativity",
    icon: <Sparkles />,
  },
  {
    value: "environment",
    label: "Environment",
    icon: <Sprout />,
  },
];

const friends: Friend[] = [
  {
    id: 1,
    name: "Alice",
    image: "https://example.com/images/alice.jpg",
  },
  {
    id: 2,
    name: "Bob",
    image: "https://example.com/images/bob.jpg",
  },
];

export function CreateTabs({
  form,
}: {
  form: ReturnType<typeof useForm<z.infer<typeof formSchema>>>;
}) {
  const [open, setOpen] = React.useState(false);
  const [openGuests, setOpenGuests] = React.useState(false);
  const [selectedTags, setSelectedTags] = React.useState<
    string[] | undefined
  >();

  const [selectedFriends, setSelectedFriends] = React.useState<
    number[] | undefined
  >();
  const [friendEmails, setFriendEmails] = React.useState<
    string[] | undefined
  >();

  const [inputValue, setInputValue] = React.useState("");

  function onTabChange() {
    setSelectedTags(undefined);
    setSelectedFriends(undefined);
    setOpen(false);
    setOpenGuests(false);
    setFriendEmails(undefined);
    form.reset();
  }

  return (
    <Tabs defaultValue="community" onValueChange={onTabChange} className="">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="community">Community</TabsTrigger>
        <TabsTrigger value="group">Group</TabsTrigger>
      </TabsList>
      <TabsContent value="community">
        <Card>
          <CardHeader>
            <CardTitle>Community</CardTitle>
            <CardDescription>
              Create your own community for a habit. Communities are always
              public.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Form {...form}>
              <form className="space-y-3">
                <FormField
                  control={form.control}
                  name="community.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          id="name"
                          placeholder="Water drinkers"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="community.tags"
                  render={({ field }) => (
                    <ComboboxComponent
                      label="Tags"
                      items={tags}
                      selectedValues={selectedTags}
                      setSelectedValues={setSelectedTags}
                      getItemValue={(tag: Tag) => tag.value}
                      getItemLabel={(tag: Tag) => tag.label}
                      placeholder="Search tags..."
                    />
                  )}
                />

                <div className="mt-2 flex flex-wrap gap-2">
                  {tags
                    .filter((tag) => selectedTags?.includes(tag.value))
                    .map((tag) => (
                      <Badge key={tag.value}>
                        {tag.icon}
                        {tag.label}
                      </Badge>
                    ))}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="group">
        <Card>
          <CardHeader>
            <CardTitle>Group</CardTitle>
            <CardDescription>
              Create your own group for multiple habits. Groups are always
              private, you can invite people to join.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Form {...form}>
              <form className="space-y-3">
                <FormField
                  control={form.control}
                  name="group.name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          id="name"
                          placeholder="My friend group"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="group.friends"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Guests</FormLabel>
                      <FormControl>
                        <ComboboxComponent
                          label="Invite friends"
                          items={friends}
                          selectedValues={selectedFriends?.map(String)}
                          setSelectedValues={(ids) => {
                            if (Array.isArray(ids)) {
                              setSelectedFriends(ids.map(Number));
                            }
                          }}
                          getItemValue={(friend: Friend) =>
                            friend.id.toString()
                          }
                          getItemLabel={(friend: Friend) => friend.name}
                          placeholder="Search or invite..."
                          allowCustomInput
                          onCustomValueAdd={(email) =>
                            setFriendEmails([...(friendEmails ?? []), email])
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <SelectedFriends />
              </form>
            </Form>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
