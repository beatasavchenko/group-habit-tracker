import dayjs from "dayjs";
import React from "react";
import { weekDays, type colors } from "~/lib/types";

export default function HabitStreakComponent({
  view,
  habitColor,
  currentDay,
}: {
  view: "week" | "month" | "year";
  habitColor: (typeof colors)[number];
  currentDay: number;
}) {
  const numberOfDaysInAMonth = dayjs().daysInMonth();
  const numberOfDaysInAYear = dayjs()
    .startOf("year")
    .diff(dayjs().endOf("year"));
  if (currentDay === 0) currentDay = 7;
  if (view === "week") {
    console.log(currentDay);

    return (
      <div className="flex gap-4">
        {weekDays.map((day, index) => (
          <div
            style={{ backgroundColor: habitColor }}
            className={`flex h-24 w-24 items-center justify-center rounded-full ${
              currentDay === index + 1 ? "ring-4 ring-black" : ""
            }`}
            key={day}
          >
            <span>{day.charAt(0).toUpperCase()}</span>
          </div>
        ))}
      </div>
    );
  } else if (view === "month") {
    return (
      <div className="flex flex-wrap gap-4">
        {Array.from({ length: numberOfDaysInAMonth }, (_, index) => (
          <div
            style={{ backgroundColor: habitColor }}
            className={`flex h-8 w-8 items-center justify-center rounded-md ${
              currentDay === index + 1 ? "ring-4 ring-black" : ""
            }`}
            key={index}
          >
            <span>{index + 1}</span>
          </div>
        ))}
      </div>
    );
  }
}
