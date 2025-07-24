"use client";

import { useSession } from "next-auth/react";
import GlobalPusherHandler from "~/components/GlobalPusherListener";

export default function LayoutWrapper({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = useSession();
  return (
    <>
      <GlobalPusherHandler userId={Number(session.data?.user.id)} />
      {children}
    </>
  );
}
