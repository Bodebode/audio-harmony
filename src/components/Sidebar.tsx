
import { PlayCircle, User, Mail, Library, ListMusic, Heart, ExternalLink } from "lucide-react";
import { 
  Sidebar as SidebarComponent, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem 
} from "@/components/ui/sidebar";

const sidebarItems = [
  {
    title: "Now Playing",
    icon: PlayCircle,
    url: "#now-playing"
  },
  {
    title: "Playlists",
    icon: ListMusic,
    url: "#playlists"
  },
  {
    title: "Library",
    icon: Library,
    url: "#library"
  },
  {
    title: "Liked Songs",
    icon: Heart,
    url: "#liked-songs"
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

export const AppSidebar = () => {
  return (
    <SidebarComponent className="border-r border-white/10 bg-black/80 backdrop-blur-lg">
      <SidebarContent className="bg-black/40">
        <SidebarGroup>
          <div className="p-4">
            <h1 className="text-2xl font-bold text-white">Bode Nathaniel</h1>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton className="hover:bg-[#1EAEDB]/20 transition-colors duration-200">
                    <a 
                      href={item.url} 
                      className="flex items-center gap-2 text-white hover:text-[#1EAEDB] font-medium transition-colors duration-200"
                    >
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
    </SidebarComponent>
  );
};
