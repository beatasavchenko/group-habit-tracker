"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Palette } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

import { LatestPost } from "~/app/_components/post";
import { useGroupRedirect } from "~/app/hooks/useGroupRedirect";
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ModeToggle } from "~/components/ui/mode-toggle";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { DB_HabitType_Zod_Create } from "~/lib/types";
import { api } from "~/trpc/react";
import { HexColorPicker } from "react-colorful";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { frequencyEnum } from "~/lib/types";
import { toast } from "sonner";

const colors = [
  "#54478c",
  "#2c699a",
  "#048ba8",
  "#0db39e",
  "#16db93",
  "#83e377",
  "#b9e769",
  "#efea5a",
  "#f1c453",
  "#f29e4c",
];

export const formSchema = DB_HabitType_Zod_Create.omit({ groupId: true });

export default function GroupPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: colors[0] as string,
      frequency: "day",
    },
    mode: "onChange",
  });

  const { group: groupData } = useGroupRedirect(params.id);

  const [dialogOpen, setDialogOpen] = useState(false);

  const createHabit = api.habit.createHabit.useMutation({
    onMutate: () => {
      toast.loading("Creating habit...");
    },
    onSuccess: (data) => {
      toast.dismiss();
      toast.success("Habit created successfully!");
      setDialogOpen(false);
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Error creating habit.");
    },
  });

  const selectedColor = form.watch("color");
  const frequency = form.watch("frequency");

  console.log(form.formState.errors);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(form.formState);

    createHabit.mutate({ ...values, groupId: Number(groupData?.group.id) });
  }

  return (
    <div className="flex h-screen w-full flex-col">
      <Header
        info={groupData}
        name={groupData?.group?.name ?? "My Group"}
        button={
          <div className="ml-auto">
            <Dialog
              open={dialogOpen}
              onOpenChange={() => setDialogOpen(!dialogOpen)}
            >
              <DialogTrigger asChild>
                <Button className="px-4">Add a habit</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create a habit</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    className="space-y-6 text-right"
                    onSubmit={form.handleSubmit(onSubmit)}
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input
                              className="w-96"
                              placeholder="Drink water"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-left" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="color"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color</FormLabel>
                          <FormControl>
                            <div className="flex flex-wrap items-center gap-2">
                              {colors.map((color) => (
                                <div
                                  onClick={() => form.setValue("color", color)}
                                  key={color}
                                  style={{
                                    backgroundColor: color,
                                  }}
                                  className={`flex h-8 w-8 items-center justify-center rounded-full hover:cursor-pointer ${selectedColor === color ? "border-2 border-black dark:border-white" : "border-0"}`}
                                >
                                  <Check
                                    className={`${selectedColor === color ? "flex" : "hidden"}`}
                                  />
                                </div>
                              ))}
                              <Popover>
                                <PopoverTrigger>
                                  {colors.includes(selectedColor) ? (
                                    <Palette size={32} />
                                  ) : (
                                    <div
                                      style={{
                                        backgroundColor: selectedColor,
                                      }}
                                      className="h-8 w-8 rounded-full border-2 border-black hover:cursor-pointer dark:border-white"
                                    />
                                  )}
                                </PopoverTrigger>
                                <PopoverContent>
                                  <HexColorPicker
                                    color={selectedColor}
                                    onChange={(value) =>
                                      form.setValue("color", value)
                                    }
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </FormControl>
                          <FormMessage className="text-left" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="frequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frequency</FormLabel>
                          <FormControl>
                            <Tabs
                              value={frequency}
                              onValueChange={(value: string) =>
                                form.setValue(
                                  "frequency",
                                  value as "day" | "week" | "month",
                                )
                              }
                            >
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="day">Daily</TabsTrigger>
                                <TabsTrigger value="week">Weekly</TabsTrigger>
                                <TabsTrigger value="month">Monthly</TabsTrigger>
                              </TabsList>
                            </Tabs>
                          </FormControl>
                          <FormMessage className="text-left" />
                        </FormItem>
                      )}
                    />
                    <DialogFooter>
                      <Button type="submit">Create</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        }
      />
      <ScrollArea className="h-[calc(100vh-40px)]"></ScrollArea>
    </div>
  );
}
