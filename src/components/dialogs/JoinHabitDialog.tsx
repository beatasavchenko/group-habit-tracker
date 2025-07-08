import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Select, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Button } from "../ui/button";
import { DB_UserHabitType_Zod_Create } from "~/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type z from "zod";
import { api } from "~/trpc/react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";

export const formSchema = DB_UserHabitType_Zod_Create.omit({
  groupId: true,
  habitId: true,
  userId: true,
});

function JoinHabitDialog({
  groupData,
  message,
}: {
  groupData: inferRouterOutputs<AppRouter>["group"]["getGroupByUsername"];
  message: inferRouterOutputs<AppRouter>["message"]["getGroupMessages"][number];
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  const utils = api.useUtils();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      goal: 1,
      frequency: "day",
    },
    mode: "onChange",
  });

  const [habitId, setHabitId] = useState<number | null>(null);

  const habitDetails = api.habit.getHabitById.useQuery(
    {
      habitId: Number(habitId),
    },
    { enabled: !!habitId },
  );

  const joinHabit = api.habit.joinHabit.useMutation({
    onMutate: () => {
      toast.loading("Joining habit...");
    },
    onSuccess: (data) => {
      toast.dismiss();
      toast.success("Habit joined successfully!");
      utils.message.getGroupMessages.invalidate({
        groupId: Number(groupData?.group.id),
      });
      setDialogOpen(false);
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Error joining habit.");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    joinHabit.mutate({
      ...values,
      groupId: Number(groupData?.group.id),
      habitId: Number(habitId),
    });
  }

  const [unit, setUnit] = useState("times");

  useEffect(() => {
    if (habitDetails.data) {
      form.setValue("frequency", habitDetails.data?.frequency);
      form.setValue("goal", habitDetails.data?.goal);
      setUnit(habitDetails.data.unit);
    }
  }, [habitDetails.data]);

  // const frequency = form.watch("frequency");
  // const goal = form.watch("goal");

  return (
    <Dialog
      open={dialogOpen && !!habitDetails.data}
      onOpenChange={() => setDialogOpen(!dialogOpen)}
    >
      <DialogTrigger asChild>
        <div className="mt-2 flex justify-end">
          <Button
            onClick={() => {
              if (habitDetails.data) {
                form.reset({
                  goal: habitDetails.data.goal,
                  frequency: habitDetails.data.frequency,
                });
              }
              setHabitId(message.habitId);
              setDialogOpen(true);
            }}
            className="w-fit"
          >
            Join
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join a habit</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <Label className="text-2xl">{habitDetails.data?.name}</Label>
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <FormControl>
                    <Tabs
                      value={field.value}
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
              <div className="flex flex-col gap-2">
                <Label>Unit</Label>
                <span>
                  {unit.replace(unit.charAt(0), unit.charAt(0).toUpperCase())}
                </span>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Join</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default JoinHabitDialog;
