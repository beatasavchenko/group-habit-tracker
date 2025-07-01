"use client";

import { useState, useCallback, useRef } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Slider } from "~/components/ui/slider";
import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Input } from "~/components/ui/input";
import { Upload } from "lucide-react";
import { NumberDictionary, uniqueNamesGenerator } from "unique-names-generator";
import { Skeleton } from "./ui/skeleton";

export function AvatarCropper({
  name = "Group",
  initialImage,
  onSave,
  isLoading,
}: {
  name?: string;
  initialImage?: string;
  onSave?: (file: File) => void;
  isLoading: boolean;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialImage);

  function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result?.toString() || "");
      setDialogOpen(true);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  }

  const onCropComplete = useCallback((_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const getCroppedImg = async (): Promise<File | null> => {
    if (!imageSrc || !croppedAreaPixels) return null;

    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => {
      image.onload = resolve;
    });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    const { width, height, x, y } = croppedAreaPixels;
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

    return new Promise<File | null>((resolve) => {
      const numberDictionary = NumberDictionary.generate({
        min: 10000,
        max: 99999,
      });
      const groupUsername = uniqueNamesGenerator({
        dictionaries: [[name.replace(/\s/g, "")], numberDictionary],
        separator: "",
        style: "lowerCase",
        length: 2,
      });

      canvas.toBlob((blob) => {
        if (!blob) return resolve(null);
        const file = new File([blob], `${groupUsername}.png`, {
          type: "image/png",
        });
        setPreviewUrl(URL.createObjectURL(blob));
        resolve(file);
      }, "image/png");
    });
  };

  const handleSave = async () => {
    const file = await getCroppedImg();
    if (file && onSave) {
      onSave(file);
    }
    setZoom(1);
    setDialogOpen(false);
  };

  return (
    <div>
      <div
        className={`group relative w-fit ${
          isLoading ? "cursor-not-allowed opacity-50" : "cursor-pointer"
        }`}
        onClick={() => {
          if (!isLoading) fileInputRef.current?.click();
        }}
      >
        <Input
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          ref={fileInputRef}
          className="hidden"
        />
        <Avatar className="h-24 w-24 rounded-full">
          <AvatarImage src={previewUrl} alt={name} />
          <AvatarFallback>{name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="absolute -right-1 -bottom-1 hidden rounded-full bg-gray-500 p-2 group-hover:block">
          <Upload className="text-white" />
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="flex flex-col items-center gap-4">
          <DialogTitle>Crop your avatar</DialogTitle>

          <div className="bg-muted relative h-[300px] w-full">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>

          <Slider
            value={[zoom]}
            min={1}
            max={3}
            step={0.1}
            onValueChange={(val) => setZoom(val[0] ?? 1)}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
