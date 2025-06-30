"use client";

import type { inferRouterOutputs } from "@trpc/server";
import { EllipsisVertical, Upload } from "lucide-react";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { CropComponent } from "~/components/CropComponent";
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
import type { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";

export default function Settings() {
  const params = useParams<{ id: string }>();

  const { data: group } = api.group.getGroupByUsername.useQuery({
    groupUsername: params.id,
  });

  const [avatarUrl, setAvatarUrl] = useState(group?.groups.image ?? "");
  const [file, setFile] = useState<File | null>(null);

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [cropOpen, setCropOpen] = useState(false);

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (data.url) {
      setAvatarUrl(data.url);
      setSettingsOpen(false);
      setCropOpen(true);
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    (hiddenFileInput.current as HTMLInputElement | null)?.click();
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleUpload(file);
    }
  };

  const hiddenFileInput = useRef(null);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState("");

  return (
    <div className="m-8 flex w-full items-center justify-center">
      <EllipsisVertical />
      <div className="flex w-[50vw] items-center gap-4">
        <div className="group relative flex w-fit" onClick={handleClick}>
          {/* <Input
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            ref={hiddenFileInput}
            className="hidden"
          />
          <CropComponent
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
            selectedImage={avatarUrl}
            setSelectedImage={setAvatarUrl}
          /> */}
          <Upload className="hover absolute right-0 bottom-0 hidden group-focus-within:block group-hover:block" />
        </div>
        <div className="flex flex-col justify-between">
          <h1 className="truncate text-3xl font-bold">{group?.groups.name}</h1>
          <div>20 Members</div>
        </div>
      </div>
    </div>
  );
}
