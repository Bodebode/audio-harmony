
import { PlayCircle, User, Mail, Library, ListMusic } from "lucide-react";
import { Sidebar as SidebarComponent, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

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

export const AppSidebar = () => {
  return (
    <SidebarComponent className="border-r border-white/10">
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
    </SidebarComponent>
  );
};
