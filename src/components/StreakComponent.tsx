import dayjs from "dayjs";
import { Flame } from "lucide-react";
import React from "react";

export default function StreakComponent({
  streakCount,
  lastLoggedAt,
  value,
}: {
  streakCount: number;
  lastLoggedAt: Date | null;
  value?: number;
}) {
  return (
    <div
      className={`flex w-18 items-center justify-center gap-1 rounded-lg ${dayjs(lastLoggedAt).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD") && !value ? "bg-orange-500" : (value ?? 0) > 0 ? "bg-orange-500" : "bg-gray-500"} px-3 py-2 text-center text-white`}
    >
      <Flame className="h-6 w-6" />
      <span className="text-xl">{streakCount}</span>
    </div>
  );
}
