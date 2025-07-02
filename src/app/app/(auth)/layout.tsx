"use client";

import { useUserRedirect } from "~/app/hooks/useUserRedirect";
import PageLayout from "~/components/PageLayout";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useUserRedirect();
  return <PageLayout>{children}</PageLayout>;
}
