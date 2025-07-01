"use client";

import type { inferRouterOutputs } from "@trpc/server";
import { EllipsisVertical, Upload } from "lucide-react";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { AvatarCropper } from "~/components/AvatarCropper";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";
import type { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";

export default function Settings() {
  const params = useParams<{ id: string }>();

  const utils = api.useUtils();

  const { data: group, isLoading } = api.group.getGroupByUsername.useQuery({
    groupUsername: params.id,
  });

  const updateGroup = api.group.updateGroup.useMutation({
    onMutate: () => {
      toast.loading("Updating group image...");
    },
    onSuccess: (data) => {
      toast.dismiss();
      toast.success("Group image updated successfully!");
      utils.group.getGroupByUsername.invalidate({ groupUsername: params.id });
    },
    onError: (error) => {
      toast.dismiss();
      toast.error("Error updating group image.");
    },
  });

  const isUpdating = isLoading || updateGroup.isPending;

  return (
    <div className="m-8 flex w-full items-center justify-center">
      <EllipsisVertical />
      {isLoading ? (
        <Skeleton className="h-24 w-24 rounded-full" />
      ) : (
        <>
          {group && (
            <AvatarCropper
              isLoading={isUpdating}
              name={group?.groups.name}
              initialImage={group?.groups.image ?? undefined}
              onSave={async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                formData.append("previousImage", group.groups.image as string);

                const res = await fetch("/api/upload", {
                  method: "POST",
                  body: formData,
                });

                const data = await res.json();

                if (!data?.url) {
                  console.error("No URL returned from upload");
                  return;
                }

                const relativeUrl = data.url;

                updateGroup.mutate({
                  id: group?.groups.id,
                  image: relativeUrl,
                });
              }}
            />
          )}
        </>
      )}
      <div className="flex flex-col justify-between">
        {isLoading ? (
          <Skeleton className="h-[30px] w-[100px]" />
        ) : (
          <h1 className="truncate text-3xl font-bold">{group?.groups.name}</h1>
        )}
        <div>20 Members</div>
      </div>
    </div>
  );
}
