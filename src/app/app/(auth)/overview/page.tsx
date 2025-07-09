"use client";

import { Grid2x2, Grid3x3, SquareCheckBig } from "lucide-react";
import React from "react";
import GroupInfoForm from "~/components/settings/forms/info/GroupInfoForm";
import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { api } from "~/trpc/react";

export default function Overview() {
  const userHabits = api.habit.getUserHabits.useQuery();
  const logHabit = api.habit.logHabit.useMutation();
  return (
    <div>
      <Tabs defaultValue="week">
        <TabsList className="grid w-full grid-cols-3">
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
        <TabsContent value="week">
          {userHabits.data?.map((habit) => (
            <Card key={habit.userHabit.id}>
              <CardContent className="flex items-center justify-between">
                <div>{habit.habit?.name}</div>
                <Progress value={habit.habitLog?.value * 100 / habit.userHabit.goal} />
                <SquareCheckBig
                  onClick={() =>
                    logHabit.mutate({ userHabitId: habit.userHabit.id })
                  }
                />
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
