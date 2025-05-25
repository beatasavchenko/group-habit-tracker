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
import type { Tag } from "~/lib/types";

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

export function CreateTabs() {
  const [open, setOpen] = React.useState(false);
  const [selectedTags, setSelectedTags] = React.useState<
    string[] | undefined
  >();

  return (
    <Tabs defaultValue="community" className="">
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
            <div className="space-y-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Water drinkers" />
              <Label htmlFor="tags">Tags</Label>
              <div id="tags">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {selectedTags?.length
                        ? tags
                            .filter((tag) => selectedTags.includes(tag.value))
                            .map((tag) => tag.label)
                            .join(", ")
                        : "Select tags..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search a tag..." />
                      <CommandList>
                        <CommandEmpty>No tag found.</CommandEmpty>
                        <CommandGroup>
                          {tags.map((tag) => (
                            <CommandItem
                              key={tag.value}
                              value={tag.value}
                              onSelect={(currentValue) => {
                                if (selectedTags?.includes(currentValue)) {
                                  setSelectedTags(
                                    selectedTags.filter(
                                      (tag) => tag !== currentValue,
                                    ),
                                  );
                                } else {
                                  setSelectedTags([
                                    ...(selectedTags ?? []),
                                    currentValue,
                                  ]);
                                }
                              }}
                            >
                              {tag.icon}
                              {tag.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  selectedTags?.includes(tag.value)
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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
              </div>
            </div>
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
            <div className="space-y-3">
              <Label htmlFor="current">Name</Label>
              <Input id="current" defaultValue="My friend group" />
              <Label htmlFor="guests">Guests</Label>
              <div id="guests">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {selectedTags?.length
                        ? tags
                            .filter((tag) => selectedTags.includes(tag.value))
                            .map((tag) => tag.label)
                            .join(", ")
                        : "Select tags..."}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search a tag..." />
                      <CommandList>
                        <CommandEmpty>No tag found.</CommandEmpty>
                        <CommandGroup>
                          {tags.map((tag) => (
                            <CommandItem
                              key={tag.value}
                              value={tag.value}
                              onSelect={(currentValue) => {
                                if (selectedTags?.includes(currentValue)) {
                                  setSelectedTags(
                                    selectedTags.filter(
                                      (tag) => tag !== currentValue,
                                    ),
                                  );
                                } else {
                                  setSelectedTags([
                                    ...(selectedTags ?? []),
                                    currentValue,
                                  ]);
                                }
                              }}
                            >
                              {tag.icon}
                              {tag.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  selectedTags?.includes(tag.value)
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
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
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
