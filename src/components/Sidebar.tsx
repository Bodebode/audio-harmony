
import { PlayCircle, User, Mail, Library, Heart, ExternalLink, Crown } from "lucide-react";
import { Link } from "react-router-dom";
import { PremiumBadge } from "./premium/PremiumBadge";
import { usePremium } from "@/hooks/usePremium";
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
    url: "/about-artist",
    isRoute: true
  },
  {
    title: "Contact",
    icon: Mail,
    url: "#contact"
  }
];

export const AppSidebar = () => {
  const { isPremiumActive } = usePremium();

  return (
    <SidebarComponent className="border-r border-white/10 bg-black/95 backdrop-blur-lg">
      <SidebarContent className="bg-black/60">
        <SidebarGroup>
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-[#1EAEDB] bg-clip-text text-transparent animate-fade-in">
                Bode Nathaniel
              </h1>
              <PremiumBadge size="sm" variant="glow" showText={false} />
            </div>
            {isPremiumActive && (
              <p className="text-xs text-yellow-500 font-medium">Premium Member</p>
            )}
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item, index) => (
                <SidebarMenuItem key={item.title} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                  <SidebarMenuButton className="hover:bg-[#1EAEDB]/20 hover-scale transition-all duration-300 group">
                    {item.isRoute ? (
                      <Link 
                        to={item.url} 
                        className="flex items-center gap-2 text-white hover:text-[#1EAEDB] font-medium transition-all duration-300"
                      >
                        <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                        <span className="group-hover:translate-x-1 transition-transform duration-200">{item.title}</span>
                      </Link>
                    ) : (
                      <a 
                        href={item.url} 
                        className="flex items-center gap-2 text-white hover:text-[#1EAEDB] font-medium transition-all duration-300"
                      >
                        <item.icon className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                        <span className="group-hover:translate-x-1 transition-transform duration-200">{item.title}</span>
                      </a>
                    )}
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
