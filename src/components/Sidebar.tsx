
import { PlayCircle, Search, Home, Library, ListMusic, Heart } from "lucide-react";
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
    title: "Your Library",
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
  }
];

export const AppSidebar = () => {
  return (
    <SidebarComponent className="border-r border-sidebar-border">
      <SidebarContent>
        <SidebarGroup>
          <div className="p-4">
            <h1 className="text-2xl font-bold text-sidebar-primary">Bode Nathaniel</h1>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton>
                  <a href={item.url} className="flex items-center gap-3 text-sidebar-foreground hover:text-sidebar-primary font-medium">
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
