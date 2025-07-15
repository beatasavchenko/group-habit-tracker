import dayjs from "dayjs";
import React from "react";
import { weekDays, type colors } from "~/lib/types";
import { cn, getHabitColorIntensity } from "~/lib/utils";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";
import utc from "dayjs/plugin/utc";
import { api } from "~/trpc/react";
dayjs.extend(weekday);
dayjs.extend(isoWeek);
dayjs.extend(utc);

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function HabitStreakComponent({
  view,
  habitColor,
  currentDay,
  userHabitId,
}: {
  view: "week" | "month" | "year";
  habitColor: (typeof colors)[number];
  currentDay: number;
  userHabitId: number;
}) {
  const numberOfDaysInAMonth = dayjs().daysInMonth();
  let currentDayInAMonth = dayjs().date();

  const today = dayjs();
  const startOfMonth = today.startOf("month");
  const endOfMonth = today.endOf("month");

  const daysInMonth = today.daysInMonth();
  const firstDayOfWeek = (startOfMonth.day() + 6) % 7;
  const totalCells = 35;

  const prevMonth = startOfMonth.subtract(1, "month");
  const prevMonthDays = prevMonth.daysInMonth();

  const calendarDaysMonth = Array.from({ length: totalCells }, (_, i) => {
    const dayOffset = i - firstDayOfWeek;
    let date: dayjs.Dayjs;
    let day: number;
    let isCurrentMonth: boolean;

    if (dayOffset < 0) {
      date = today.startOf("month").subtract(firstDayOfWeek - i, "day");
      day = date.date();
      isCurrentMonth = false;
    } else if (dayOffset >= daysInMonth) {
      date = today.endOf("month").add(dayOffset - daysInMonth + 1, "day");
      day = date.date();
      isCurrentMonth = false;
    } else {
      date = today.startOf("month").add(dayOffset, "day");
      day = date.date();
      isCurrentMonth = true;
    }

    return {
      day,
      date,
      isCurrentMonth,
      isToday: date.isSame(today, "day"),
    };
  });

  const startDate = today.startOf("year").startOf("week").add(1, "day");
  const endDate = today.endOf("year").endOf("week").add(1, "day");

  const totalDays = endDate.diff(startDate, "day") + 1;

  const calendarDates = Array.from({ length: totalDays }, (_, i) => {
    const date = startDate.add(i, "day");
    return {
      date,
      isCurrentYear: date.year() === today.year(),
      isToday: date.isSame(today, "day"),
    };
  });

  const weeks = [];
  for (let i = 0; i < calendarDates.length; i += 7) {
    weeks.push(calendarDates.slice(i, i + 7));
  }

  const { data: habitLogs } = api.habit.getHabitLogs.useQuery({
    view,
    userHabitId,
  });

  const habitLogMap = new Map(
    (habitLogs ?? []).map((log) => [dayjs(log.date).format("YYYY-MM-DD"), log]),
  );

  console.log(habitLogs);

  const week = (
    <div className="flex gap-4">
      {weekDays.map((day, index) => {
        const date = dayjs()
          .startOf("week")
          .add(index + 1, "day");
        const log = habitLogMap.get(date.format("YYYY-MM-DD"));

        return (
          <div
            key={day}
            style={{
              backgroundColor: getHabitColorIntensity({
                value: log?.value ?? 0,
                goal: log?.goal ?? 1,
                color: habitColor,
              }),
            }}
            className={`flex h-16 w-16 items-center justify-center rounded-full ${
              currentDay === index + 1 ? "ring-2 ring-black" : ""
            }`}
          >
            <span>{day.charAt(0).toUpperCase()}</span>
          </div>
        );
      })}
    </div>
  );

  const month = (
    <div className="grid w-fit grid-cols-7 gap-2">
      {weekdays.map((day) => (
        <div key={day} className="text-muted-foreground text-center">
          {day}
        </div>
      ))}
      {calendarDaysMonth.map((dateObj, index) => {
        const log = habitLogMap.get(dateObj.date.format("YYYY-MM-DD"));

        return (
          <div
            key={index}
            style={
              dateObj.isCurrentMonth
                ? {
                    backgroundColor: getHabitColorIntensity({
                      value: log?.value ?? 0,
                      goal: log?.goal ?? 1,
                      color: habitColor,
                    }),
                  }
                : undefined
            }
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md text-sm",
              dateObj.isCurrentMonth
                ? dateObj.isToday
                  ? "bg-black ring-2 ring-black"
                  : undefined
                : "bg-muted text-muted-foreground opacity-60",
            )}
          >
            {dateObj.day}
          </div>
        );
      })}
    </div>
  );

  const year = (
    <div className="flex">
      <div className="mr-2 flex flex-col items-center justify-between py-[2px]">
        {weekdays.map((day, i) => (
          <div key={i} className="text-muted-foreground h-4 text-xs">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-flow-col grid-cols-53 grid-rows-7 gap-[2px]">
        {weeks.map((week, colIndex) =>
          week.map((dateObj, rowIndex) => {
            const log = habitLogMap.get(dateObj.date.format("YYYY-MM-DD"));

            return (
              <div
                key={`${colIndex}-${rowIndex}`}
                title={dateObj.date.format("ddd, MMM D")}
                style={
                  dateObj.isCurrentYear
                    ? {
                        backgroundColor: getHabitColorIntensity({
                          value: log?.value ?? 0,
                          goal: log?.goal ?? 1,
                          color: habitColor,
                        }),
                      }
                    : undefined
                }
                className={cn(
                  "h-4 w-4 rounded-sm transition-all",
                  dateObj.isToday ? "ring-2 ring-black" : "",
                  !dateObj.isCurrentYear
                    ? "bg-muted text-muted-foreground opacity-50"
                    : "",
                )}
              />
            );
          }),
        )}
      </div>
    </div>
  );

  switch (view) {
    case "week":
      return week;
    case "month":
      return month;
    case "year":
      return year;
  }
}
