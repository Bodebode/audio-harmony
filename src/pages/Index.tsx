
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Library } from "@/components/Library";
import { AboutArtist } from "@/components/AboutArtist";
import { BottomBanner } from "@/components/BottomBanner";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-[#0FA0CE] via-[#222222] to-[#1EAEDB]">
        <AppSidebar />
        <div className="flex-1 overflow-auto pb-16">
          <Header />
          <MusicPlayer />
          <Library />
          <AboutArtist />
        </div>
      </div>
      <BottomBanner />
    </SidebarProvider>
  );
};

export default Index;
