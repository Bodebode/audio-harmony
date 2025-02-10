
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Library } from "@/components/Library";
import { About } from "@/components/About";
import { ContactForm } from "@/components/ContactForm";
import { Playlists } from "@/components/playlists/Playlists";
import { LikedSongs } from "@/components/LikedSongs";

const sampleSongs = [
  { id: 1, title: "Song 1", duration: "3:45", likes: [] },
  { id: 2, title: "Song 2", duration: "4:20", likes: [] },
  { id: 3, title: "Song 3", duration: "3:15", likes: [] },
  { id: 4, title: "Song 4", duration: "3:50", likes: [] },
  { id: 5, title: "Song 5", duration: "4:10", likes: [] },
  { id: 6, title: "Song 6", duration: "3:30", likes: [] },
  { id: 7, title: "Song 7", duration: "4:05", likes: [] },
  { id: 8, title: "Song 8", duration: "3:55", likes: [] },
  { id: 9, title: "Song 9", duration: "4:15", likes: [] },
  { id: 10, title: "Song 10", duration: "3:40", likes: [] }
];

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-[#0FA0CE] via-[#222222] to-[#1EAEDB]">
        <AppSidebar />
        <div className="flex-1 overflow-auto">
          <Header />
          <div className="grid grid-cols-12 gap-4 p-6">
            <div className="col-span-3">
              <LikedSongs songs={sampleSongs} currentUserId="current-user" />
            </div>
            <div className="col-span-9">
              <MusicPlayer />
              <Playlists />
              <About />
              <Library />
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
