import { zodResolver } from "@hookform/resolvers/zod";
import type { inferRouterOutputs } from "@trpc/server";
import { Check, Palette } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
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
import {
  colors,
  DB_HabitType_Zod_Create,
  weekDays,
} from "~/lib/types";
import type { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { HexColorPicker } from "react-colorful";
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import dayjs from "dayjs";

const units = ["times", "minutes", "hours"] as const;

const formSchema = DB_HabitType_Zod_Create.omit({ groupId: true }).extend({
  daySettings: z.enum(["every-day", "schedule", "num-days"]),
});

function AddHabitDialog({
  groupData,
}: {
  groupData: inferRouterOutputs<AppRouter>["group"]["getGroupByUsername"];
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: colors[0],
      frequency: "day",
      goal: 1,
      unit: "times",
      daySettings: "every-day",
      isEveryDay: true,
      enabledReminder: false,
    },
    mode: "onChange",
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const utils = api.useUtils();

  const createHabit = api.habit.createHabit.useMutation({
    onMutate: () => {
      toast.loading("Creating habit...");
    },
    onSuccess: (data) => {
      toast.dismiss();
      toast.success("Habit created successfully!");
      utils.message.getGroupMessages.invalidate({
        groupId: Number(groupData?.group.id),
      });
      setDialogOpen(false);
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Error creating habit.");
    },
  });

  const selectedColor = form.watch("color");
  const frequency = form.watch("frequency");
  const daySettings = form.watch("daySettings");

  const [selectedDays, setSelectedDays] = useState<boolean[]>([
    true,
    true,
    true,
    true,
    true,
    false,
    false,
  ]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const base = {
      name: values.name,
      color: values.color,
      goal: values.goal,
      unit: values.unit,
      frequency: values.frequency,
      enabledReminder: values.enabledReminder ?? false,
      reminderTime: values.reminderTime ?? dayjs().format("HH:mm:ss"),
      description: values.description ?? null,
      groupId: Number(groupData?.group.id),
    };

    let scheduleFields = {};

    if (values.daySettings === "every-day") {
      scheduleFields = { isEveryDay: true };
    } else if (values.daySettings === "schedule") {
      scheduleFields = {
        isEveryDay: false,
        specificDays: values.specificDays ?? [],
      };
    } else if (values.daySettings === "num-days") {
      scheduleFields = {
        isEveryDay: false,
        numDaysPerWeek: values.numDaysPerWeek ?? 7,
      };
    }

    createHabit.mutate({
      ...base,
      ...scheduleFields,
    });
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={() => setDialogOpen(!dialogOpen)}>
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
                          {colors.includes(
                            selectedColor as (typeof colors)[number],
                          ) ? (
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
                            onChange={(value) => form.setValue("color", value)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormControl>
                  <FormMessage className="text-left" />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2">
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        value={field.value ? Number(field.value) : ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          form.setValue("goal", Number(val));
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {units.map((unit) => (
                            <SelectItem key={unit} value={unit}>
                              {unit.replace(
                                unit.charAt(0),
                                unit.charAt(0).toUpperCase(),
                              )}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-left" />
                  </FormItem>
                )}
              />
            </div>
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
            {frequency === "day" && (
              <FormField
                control={form.control}
                name="daySettings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Days</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="every-day" id="every-day" />
                          <Label htmlFor="every-day">Every day</Label>
                        </div>

                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="schedule" id="schedule" />
                          <Label htmlFor="schedule">Set a schedule</Label>
                        </div>

                        {daySettings === "schedule" && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {weekDays.map((day, index) => (
                              <div
                                key={index}
                                onClick={() => {
                                  const updated = [...selectedDays];
                                  updated[index] = !updated[index];
                                  setSelectedDays(updated);
                                }}
                                className={`flex h-10 w-10 items-center justify-center rounded-full p-2 text-center ring-2 hover:cursor-pointer ${
                                  selectedDays[index]
                                    ? "bg-black text-white ring-0"
                                    : ""
                                }`}
                              >
                                {day.charAt(0).toUpperCase()}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="num-days" id="num-days" />
                          <Label htmlFor="num-days">
                            Number of days per week
                          </Label>
                        </div>

                        {daySettings === "num-days" && (
                          <FormField
                            control={form.control}
                            name="numDaysPerWeek"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="number"
                                    min={1}
                                    max={7}
                                    value={field.value || ""}
                                    onChange={(e) =>
                                      form.setValue(
                                        "numDaysPerWeek",
                                        Number(e.target.value),
                                      )
                                    }
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        )}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            )}
            <DialogFooter>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AddHabitDialog;
