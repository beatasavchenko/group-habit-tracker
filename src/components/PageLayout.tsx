import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { AppSidebar } from "~/components/app-sidebar";
import { ScrollArea } from "./ui/scroll-area";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="mx-0 flex w-full flex-col px-0">
        <ScrollArea className="h-screen">
          <div className="flex w-full flex-col">{children}</div>
        </ScrollArea>
      </main>
    </SidebarProvider>
  );
}
