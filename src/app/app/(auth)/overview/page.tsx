"use client";

import dayjs from "dayjs";
import {
  EllipsisVertical,
  Flame,
  Grid2x2,
  Grid3x3,
  SquareCheck,
  SquareCheckBig,
  SquarePlus,
  Table,
} from "lucide-react";
import React from "react";
import { toast } from "sonner";
import HabitStreakComponent from "~/components/HabitStreakComponent";
import GroupInfoForm from "~/components/settings/forms/info/GroupInfoForm";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent } from "~/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Progress } from "~/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import ViewHabitComponent from "~/components/ViewHabitComponent";
import type { colors, weekDays } from "~/lib/types";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export default function Overview() {
  const utils = api.useUtils();

  const userHabits = api.habit.getUserHabits.useQuery();

  return (
    <div className="p-6">
      <Tabs defaultValue="week">
        <TabsList className="mb-4 grid w-full grid-cols-3">
          <TabsTrigger value="week">
            <Grid2x2 />
            Weekly View
          </TabsTrigger>
          <TabsTrigger value="month">
            <Table />
            Monthly View
          </TabsTrigger>
          <TabsTrigger value="year">
            <Grid3x3 />
            Yearly View
          </TabsTrigger>
        </TabsList>
        <TabsContent value="week">
          <ViewHabitComponent
            userHabits={userHabits.data ?? null}
            view="week"
          />
        </TabsContent>
        <TabsContent value="month">
          <ViewHabitComponent
            userHabits={userHabits.data ?? null}
            view="month"
          />
        </TabsContent>
        <TabsContent value="year">
          <ViewHabitComponent
            userHabits={userHabits.data ?? null}
            view="year"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
