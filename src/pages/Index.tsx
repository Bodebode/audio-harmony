
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { MusicPlayer } from "@/components/MusicPlayer";
import { MainContent } from "@/components/MainContent";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <MainContent />
          <MusicPlayer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
