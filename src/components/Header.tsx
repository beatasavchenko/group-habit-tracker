import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";
import { SidebarTrigger } from "./ui/sidebar";
import { EllipsisVertical } from "lucide-react";

type HeaderProps = {
  name: string;
  button: React.ReactNode;
};

export function Header(props: HeaderProps) {
  const { name, button } = props;
  return (
    <>
      <div className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
        <SidebarTrigger />
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant={"ghost"}
              onClick={() => {}}
              className="absolute left-1/2 -z-0 w-full -translate-x-1/2 transform px-8 py-8 text-xl font-semibold"
            >
              {name}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Group Info</DialogTitle>
              <EllipsisVertical />
            </DialogHeader>
            <DialogFooter>
              <Button>Join</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <div className="z-20">{button}</div>
      </div>
      <Separator className="bg-sidebar-border w-full" />
    </>
  );
}
