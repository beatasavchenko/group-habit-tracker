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
        <div className="absolute left-1/2 -translate-x-1/2 transform text-xl font-semibold">
          {name}
        </div>
        {button}
      </div>
      <Separator className="bg-sidebar-border w-full" />
    </>
  );
}
