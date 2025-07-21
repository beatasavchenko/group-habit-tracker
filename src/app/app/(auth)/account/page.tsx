"use client";

import { useSession } from "next-auth/react";
import React from "react";
import { AvatarCropper } from "~/components/AvatarCropper";
import StreakComponent from "~/components/StreakComponent";
import { Skeleton } from "~/components/ui/skeleton";
import UserInfoComponent from "~/components/UserInfoComponent";
import { api } from "~/trpc/react";

export default function AccountPage() {
  const { data: session, status } = useSession();

  return (
    <div className="p-6">
      <UserInfoComponent session={session} status={status} />
    </div>
  );
}
