import React from "react";
import { Skeleton } from "./ui/skeleton";
import { AvatarCropper } from "./AvatarCropper";
import type z from "zod";
import { DB_UserType_Zod } from "~/lib/types";
import type { Session } from "next-auth";
import { api } from "~/trpc/react";
import StreakComponent from "./StreakComponent";
import HabitStreakComponent from "./HabitStreakComponent";
import dayjs from "dayjs";

export default function UserInfoComponent({
  session,
  status,
}: {
  session: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
}) {
  const updateUser = api.user.updateUser.useMutation();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex w-full items-center gap-6">
        {status === "loading" ? (
          <Skeleton className="h-24 w-24 rounded-full" />
        ) : session ? (
          <AvatarCropper
            isLoading={status === ("loading" as string)}
            name={session.user.name ?? "User"}
            initialImage={session.user.image ?? undefined}
            onSave={async (file) => {
              const formData = new FormData();
              formData.append("file", file);
              formData.append("previousImage", session.user.image ?? "");

              const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
              });

              const data = await res.json();

              if (!data?.url) {
                console.error("No URL returned from upload");
                return;
              }

              updateUser.mutate({
                image: data.url,
              });
            }}
          />
        ) : null}

        <div className="flex flex-col">
          {status === "loading" ? (
            <Skeleton className="h-[30px] w-[100px]" />
          ) : (
            <>
              <h1 className="truncate text-3xl font-bold">
                {session?.user.name}
              </h1>
              @{session?.user.username}
              <StreakComponent
                streakCount={session?.user.globalStreakCount ?? 0}
                lastLoggedAt={session?.user.globalStreakLastLoggedAt ?? null}
              />
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Streak Overview</h1>
        <HabitStreakComponent
          view={"year"}
          habitColor={"#2AAA8A"}
          currentDay={dayjs().day()}
          userId={session?.user.id}
        />
      </div>
    </div>
  );
}
