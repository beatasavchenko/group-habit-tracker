import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import PageLayout from "~/components/PageLayout";
import { Button } from "~/components/ui/button";
import { ModeToggle } from "~/components/ui/mode-toggle";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  // void api.post.getLatest.prefetch();

  return <></>;
}
