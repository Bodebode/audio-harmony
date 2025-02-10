
import { Menu, PlayCircle, User, Mail, Library, ListMusic } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Menu items for the sidebar
const sidebarItems = [
  {
    title: "Now Playing",
    icon: PlayCircle,
    url: "#now-playing"
  },
  {
    title: "Library",
    icon: Library,
    url: "#library"
  },
  {
    title: "Playlists",
    icon: ListMusic,
    url: "#playlists"
  },
  {
    title: "About Artist",
    icon: User,
    url: "#about"
  },
  {
    title: "Contact",
    icon: Mail,
    url: "#contact"
  }
];

// Sample songs data (to be replaced with real data later)
const sampleSongs = [
  { id: 1, title: "Song 1", duration: "3:45" },
  { id: 2, title: "Song 2", duration: "4:20" },
  { id: 3, title: "Song 3", duration: "3:15" },
  { id: 4, title: "Song 4", duration: "3:50" },
  { id: 5, title: "Song 5", duration: "4:10" },
  { id: 6, title: "Song 6", duration: "3:30" },
  { id: 7, title: "Song 7", duration: "4:05" },
  { id: 8, title: "Song 8", duration: "3:55" },
  { id: 9, title: "Song 9", duration: "4:15" },
  { id: 10, title: "Song 10", duration: "3:40" }
];

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-[#0FA0CE] via-[#222222] to-[#1EAEDB]">
        {/* Sidebar */}
        <Sidebar className="border-r border-white/10">
          <SidebarContent>
            <SidebarGroup>
              <div className="p-4">
                <h1 className="text-2xl font-bold text-[#1EAEDB]">Bode Nathaniel</h1>
              </div>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton>
                        <a href={item.url} className="flex items-center gap-2 text-[#222222] hover:text-[#1EAEDB] font-medium">
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <header className="p-6 flex justify-between items-center">
            <Button variant="ghost" size="icon" className="text-white" asChild>
              <SidebarTrigger>
                <Menu className="h-6 w-6" />
              </SidebarTrigger>
            </Button>
            <div className="flex gap-4 flex-wrap">
              <Button variant="ghost" className="text-white hover:text-[#1EAEDB]">
                <a href="https://twitter.com/BN_officially" target="_blank" rel="noopener noreferrer">Twitter</a>
              </Button>
              <Button variant="ghost" className="text-white hover:text-[#1EAEDB]">
                <a href="https://instagram.com/bn_majestic" target="_blank" rel="noopener noreferrer">Instagram</a>
              </Button>
              <Button variant="ghost" className="text-white hover:text-[#1EAEDB]">
                <a href="https://www.tiktok.com/@bodenathaniel" target="_blank" rel="noopener noreferrer">TikTok</a>
              </Button>
              <Button variant="ghost" className="text-white hover:text-[#1EAEDB]">
                <a href="https://open.spotify.com/artist/6ybapGF4VVYMYKTKAJPoR7" target="_blank" rel="noopener noreferrer">Spotify</a>
              </Button>
              <Button variant="ghost" className="text-white hover:text-[#1EAEDB]">
                <a href="https://www.youtube.com/c/BodeNathaniel" target="_blank" rel="noopener noreferrer">YouTube</a>
              </Button>
              <Button variant="ghost" className="text-white hover:text-[#1EAEDB]">
                <a href="https://www.bodenathaniel.com" target="_blank" rel="noopener noreferrer">Website</a>
              </Button>
            </div>
          </header>

          {/* Now Playing Section */}
          <section id="now-playing" className="p-6">
            <Card className="bg-black/40 backdrop-blur-lg border-[#1EAEDB]/10">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex flex-col justify-center">
                    <div className="w-full aspect-square bg-[#222222] rounded-lg shadow-2xl"></div>
                  </div>
                  <div className="flex flex-col justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-[#FEF7CD] mb-2">Now Playing</h2>
                      <p className="text-[#F2FCE2]">Song Title</p>
                    </div>
                    <div className="space-y-4">
                      <div className="h-40 overflow-y-auto bg-black/20 rounded p-4">
                        <p className="text-[#F2FCE2]">Lyrics will appear here...</p>
                      </div>
                      <div className="flex justify-center gap-4">
                        {/* Audio controls will go here */}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Bio Section */}
          <section id="about" className="p-6">
            <Card className="bg-black/40 backdrop-blur-lg border-[#1EAEDB]/10">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-[#FEF7CD] mb-4">About Bode Nathaniel</h2>
                <p className="text-[#F2FCE2] leading-relaxed">
                  British Nigerian musician Bode Nathaniel is well-known in the African music community. He is a gifted musician who has carved out a niche for himself as a fascinating performer and talented songwriter with his distinctive blend of African rhythms and Afrobeat influences.
                </p>
                <p className="text-[#F2FCE2] leading-relaxed mt-4">
                  His music transcends national boundaries, incorporating colorful energy and contagious beats while drawing inspiration from his African background. His works demonstrate his command of the Afrobeat genre as he deftly combines traditional African components with modern sounds.
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Songs List */}
          <section id="library" className="p-6">
            <Card className="bg-black/40 backdrop-blur-lg border-[#1EAEDB]/10">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold text-[#FEF7CD] mb-4">Library</h2>
                <div className="space-y-2">
                  {sampleSongs.map((song) => (
                    <div
                      key={song.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-[#1EAEDB]/5 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <PlayCircle className="h-5 w-5 text-[#F2FCE2]" />
                        <span className="text-[#F2FCE2]">{song.title}</span>
                      </div>
                      <span className="text-[#F2FCE2]">{song.duration}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
