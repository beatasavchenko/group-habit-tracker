import { zodResolver } from "@hookform/resolvers/zod";
import type { inferRouterOutputs } from "@trpc/server";
import { Check, Palette } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
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
import { colors, DB_HabitType_Zod_Create } from "~/lib/types";
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

const units = ["times", "minutes", "hours"] as const;

export const formSchema = DB_HabitType_Zod_Create.omit({ groupId: true });

function AddHabitDialog({
  groupData,
}: {
  groupData: inferRouterOutputs<AppRouter>["group"]["getGroupByUsername"];
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      color: colors[0] as string,
      frequency: "day",
      goal: 1,
      unit: "times",
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    createHabit.mutate({ ...values, groupId: Number(groupData?.group.id) });
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
                      <Select defaultValue="times">
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
