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
      <main className="flex w-full flex-col">
        <ScrollArea className="h-screen">
          <div className="container flex flex-col">
            <SidebarTrigger />
            {children}
          </div>
        </ScrollArea>
      </main>
    </SidebarProvider>
  );
}
