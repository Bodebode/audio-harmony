
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Library } from "@/components/Library";
import { About } from "@/components/About";
import { ContactForm } from "@/components/ContactForm";
import { Playlists } from "@/components/Playlists";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-[#0FA0CE] via-[#222222] to-[#1EAEDB]">
        <AppSidebar />
        <div className="flex-1 overflow-auto">
          <Header />
          <MusicPlayer />
          <Playlists />
          <About />
          <Library />
          <ContactForm />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
