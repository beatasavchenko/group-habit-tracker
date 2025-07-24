"use client";

import { SessionProvider, useSession } from "next-auth/react";
import LayoutWrapper from "./layoutWrapper";

export default function SessionWrapper({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <SessionProvider>
      <LayoutWrapper>{children}</LayoutWrapper>
    </SessionProvider>
  );
}
