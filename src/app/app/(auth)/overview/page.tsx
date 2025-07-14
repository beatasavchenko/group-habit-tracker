"use client";

import dayjs from "dayjs";
import {
  Grid2x2,
  Grid3x3,
  SquareCheck,
  SquareCheckBig,
  SquarePlus,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import HabitStreakComponent from "~/components/HabitStreakComponent";
import GroupInfoForm from "~/components/settings/forms/info/GroupInfoForm";
import { Card, CardContent } from "~/components/ui/card";
import { Progress } from "~/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { colors, weekDays } from "~/lib/types";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function Overview() {
  const utils = api.useUtils();

  const userHabits = api.habit.getUserHabits.useQuery();
  const logHabit = api.habit.logHabit.useMutation({
    onMutate: () => {
      toast.loading("Logging progress...");
    },
    onSuccess: async (data) => {
      toast.dismiss();
      toast.success("Progress logged successfully!");
      await utils.habit.getUserHabits.invalidate();
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Error logging progress.");
    },
  });

  const currentDay = dayjs().day();

  return (
    <div className="p-6">
      <Tabs defaultValue="week">
        <TabsList className="mb-4 grid w-full grid-cols-3">
          <TabsTrigger value="week">
            <Grid2x2 />
            Weekly View
          </TabsTrigger>
          <TabsTrigger value="month">
            <Grid2x2 />
            Monthly View
          </TabsTrigger>
          <TabsTrigger value="year">
            <Grid3x3 />
            Yearly View
          </TabsTrigger>
        </TabsList>
        <TabsContent className="flex flex-col gap-6" value="week">
          {userHabits.data?.map((habit) => (
            <Card key={habit.userHabit.id}>
              <CardContent className="flex flex-col gap-4">
                <div className="flex w-full justify-between">
                  <div
                    className="flex items-center justify-center rounded-lg px-3 py-2 text-center"
                    style={{ backgroundColor: habit.habit.color }}
                  >
                    {habit.habit?.name}
                  </div>
                  <button
                    disabled={habit.habitLog?.value === habit.userHabit.goal}
                    className="hover:cursor-pointer disabled:cursor-not-allowed"
                    onClick={() =>
                      logHabit.mutate({ userHabitId: habit.userHabit.id })
                    }
                  >
                    {habit.habitLog?.value === habit.userHabit.goal ? (
                      <SquareCheck size={"42"} />
                    ) : (
                      <SquarePlus size={"42"} />
                    )}
                  </button>
                </div>
                <div className="flex w-full items-center justify-between">
                  <div className="w-fit">
                    {`${habit.habitLog?.value ?? 0} / ${habit.userHabit.goal} ${habit.habit.unit.replace(habit.habit.unit.charAt(0), habit.habit.unit.charAt(0).toUpperCase())}`}
                  </div>
                  <Progress
                    className="w-[80%]"
                    value={
                      ((habit.habitLog?.value ?? 0) * 100) /
                      habit.userHabit.goal
                    }
                  />
                </div>
                <HabitStreakComponent
                  view="week"
                  habitColor={habit.habit.color as (typeof colors)[number]}
                  currentDay={currentDay}
                />
                <HabitStreakComponent
                  view="month"
                  habitColor={habit.habit.color as (typeof colors)[number]}
                  currentDay={currentDay}
                />
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
