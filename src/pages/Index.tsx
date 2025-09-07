
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { MainContent } from "@/components/MainContent";
import { QueueSidebar } from "@/components/QueueSidebar";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <MainContent />
        </div>
        <QueueSidebar />
      </div>
    </SidebarProvider>
  );
};

export default Index;
