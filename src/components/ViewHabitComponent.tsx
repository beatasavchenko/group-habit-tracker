import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import dayjs from "dayjs";
import { Flame, SquareCheck, SquarePlus, EllipsisVertical } from "lucide-react";
import { logHabit } from "~/server/services/habitService";
import HabitStreakComponent from "./HabitStreakComponent";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";
import { toast } from "sonner";
import { api } from "~/trpc/react";
import type { colors } from "~/lib/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

type ViewHabitComponentProps = {
  userHabits: inferRouterOutputs<AppRouter>["habit"]["getUserHabits"];
  view: "week" | "month" | "year";
};

export default function ViewHabitComponent(props: ViewHabitComponentProps) {
  const { userHabits, view } = props;

  const utils = api.useUtils();

  const currentDay = dayjs().day();

  const logHabit = api.habit.logHabit.useMutation({
    onMutate: () => {
      toast.loading("Logging progress...");
    },
    onSuccess: async (data) => {
      toast.dismiss();
      toast.success("Progress logged successfully!");
      await utils.habit.getUserHabits.invalidate();
      await utils.habit.getHabitLogs.invalidate();
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Error logging progress.");
    },
  });

  return (
    <Accordion
      className="flex flex-col gap-6"
      defaultValue="week"
      type="single"
      collapsible
    >
      <AccordionItem value="week">
        <AccordionTrigger>
          <h1 className="text-2xl font-bold">Daily Habits</h1>
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4">
          {userHabits?.map((habit) => (
            <Card key={habit.userHabit.id}>
              <CardContent
                className={`${habit.habitLog?.isCompleted && "opacity-70"} flex flex-col gap-4`}
              >
                <div className="flex w-full justify-between">
                  <div className="flex items-center gap-8">
                    <div
                      className={`flex items-center justify-center rounded-lg px-3 py-2 text-center ${habit.habitLog?.isCompleted && "line-through"}`}
                      style={{ backgroundColor: habit.habit.color }}
                    >
                      {habit.habit?.name}
                    </div>
                    <div
                      className={`flex items-center justify-center gap-1 rounded-lg ${dayjs(habit.userHabit.lastLoggedAt).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD") && (habit.habitLog?.value ?? 0) > 0 ? "bg-orange-500" : "bg-gray-500"} px-3 py-2 text-center text-white`}
                    >
                      <Flame className="h-6 w-6" />
                      <span className="text-xl">
                        {habit.userHabit.streakCount}
                      </span>
                    </div>
                  </div>
                  <button
                    disabled={habit.habitLog?.value === habit.userHabit.goal}
                    className="hover:cursor-pointer disabled:cursor-not-allowed"
                    onClick={() =>
                      logHabit.mutate({ userHabitId: habit.userHabit.id })
                    }
                  >
                    {habit.habitLog?.isCompleted ? (
                      <SquareCheck
                        style={{ color: habit.habit.color }}
                        size={"42"}
                      />
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
                <div className="flex items-center justify-between">
                  <HabitStreakComponent
                    view={view}
                    habitColor={habit.habit.color as (typeof colors)[number]}
                    currentDay={currentDay}
                    userHabitId={habit.userHabit.id}
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <EllipsisVertical
                        className="h-8 w-8 cursor-pointer"
                        // className={member.userId !== userId ? "block" : "hidden"}
                      />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel
                      // onClick={() => {
                      //   setDeleteMemberDialogOpen(true);
                      //   setMemberIdToDelete(member.userId);
                      // }}
                      >
                        Edit Habit
                      </DropdownMenuLabel>
                      <DropdownMenuLabel
                      // onClick={() => {
                      //   setDeleteMemberDialogOpen(true);
                      //   setMemberIdToDelete(member.userId);
                      // }}
                      >
                        Leave Habit
                      </DropdownMenuLabel>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
