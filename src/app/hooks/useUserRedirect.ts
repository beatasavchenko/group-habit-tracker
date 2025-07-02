"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "~/trpc/react";

export function useUserRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const userId = session?.user?.id;

  const { data: user, isLoading } = api.user.getUserById.useQuery(
    { userId: Number(userId) },
    { enabled: !!userId },
  );

  useEffect(() => {
    if (status === "authenticated" && !isLoading && !user) {
      signOut({ callbackUrl: "/app/login" });
    }
  }, [status, isLoading, user]);

  return { user, isLoading };
}
