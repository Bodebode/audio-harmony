
import { PlayCircle, Search, Library, ListMusic, Heart, Home } from "lucide-react";
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
    title: "Home",
    icon: Home,
    url: "#home"
  },
  {
    title: "Search",
    icon: Search,
    url: "#search"
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
    title: "Liked Songs",
    icon: Heart,
    url: "#liked-songs"
  },
  {
    title: "Now Playing",
    icon: PlayCircle,
    url: "#now-playing"
  }
];

export const AppSidebar = () => {
  return (
    <SidebarComponent className="border-r border-border/50 bg-background/95 backdrop-blur-lg">
      <SidebarContent>
        <SidebarGroup>
          <div className="p-4">
            <h1 className="text-2xl font-bold text-primary">Bode Nathaniel</h1>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton>
                    <a href={item.url} className="flex items-center gap-2 text-foreground/80 hover:text-primary font-medium transition-colors duration-200">
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
