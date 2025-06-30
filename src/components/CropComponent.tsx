import type { group } from "console";
import ReactCrop, { type Crop, type PixelCrop } from "react-image-crop";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Slider } from "./ui/slider";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

type CropComponentProps = {
  selectedImage: File | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<File | null>>;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function CropComponent({
  selectedImage,
  setSelectedImage,
  dialogOpen,
  setDialogOpen,
}: CropComponentProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [aspect, setAspect] = useState<number | undefined>(16 / 9);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    if (aspect) {
      const { width, height } = e.currentTarget;
      // setCrop(centerAspectCrop(width, height, aspect));
    }
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>
        <Avatar className="h-24 w-24 rounded-full grayscale">
          {/* <AvatarImage
            src={group?.groups.image ?? ""}
            alt={group?.groups.name}
          />
          <AvatarFallback className="rounded-full">
            {group?.groups.name.charAt(0).toUpperCase()}
          </AvatarFallback> */}
        </Avatar>
      </DialogTrigger>
      <DialogContent className="flex h-[90vh] w-[90vw] flex-col">
        <DialogTitle>Crop image</DialogTitle>
        <ReactCrop
          crop={crop}
          onChange={(_, percentCrop) => setCrop(percentCrop)}
          onComplete={(c) => setCompletedCrop(c)}
          aspect={aspect}
          className="w-full"
        >
          {/* <Avatar className="h-24 w-24 rounded-full grayscale">
            <AvatarImage src={imgSrc ?? ""} alt={group?.groups.name} />
            <AvatarFallback className="rounded-full">
              {group?.groups.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar> */}
        </ReactCrop>
        <DialogFooter>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
