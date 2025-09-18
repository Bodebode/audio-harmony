
import { PlayCircle, User, Mail, Library, Heart, Crown, ChevronDown, Settings } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { PremiumBadge } from "./premium/PremiumBadge";
import { usePremium } from "@/hooks/usePremium";
import { useAuth } from "@/hooks/useAuth";
import { 
  Sidebar as SidebarComponent, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton 
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";

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
  const { isGuest, profile } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const isAdmin = profile?.is_admin || profile?.role === 'admin';

  const handlePremiumClick = () => {
    navigate('/premium');
  };

  const handleArrowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleManyMoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/premium');
  };

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
               
               {/* Admin Access */}
               {isAdmin && (
                 <SidebarMenuItem className="animate-fade-in" style={{ animationDelay: `${sidebarItems.length * 0.1}s` }}>
                   <SidebarMenuButton className="hover:bg-red-500/20 transition-all duration-300 group">
                     <Link 
                       to="/admin" 
                       className="flex items-center gap-2 text-red-400 hover:text-red-300 font-medium w-full transition-all duration-300"
                     >
                       <Settings className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                       <span className="group-hover:translate-x-1 transition-transform duration-200">Admin Panel</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
               )}
               
              {isGuest ? (
                <SidebarMenuItem className="animate-fade-in" style={{ animationDelay: `${sidebarItems.length * 0.1}s` }}>
                  <SidebarMenuButton className="hover:bg-gradient-to-r hover:from-[#1EAEDB]/20 hover:to-[#0FA0CE]/20 transition-all duration-300 group">
                     <Link 
                       to="/auth" 
                       className="flex items-center gap-2 text-[#1EAEDB] font-medium w-full"
                     >
                      <User className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                      <span className="group-hover:translate-x-1 transition-transform duration-200">Sign Up for Free</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ) : !isPremiumActive && (
                <SidebarMenuItem className="animate-fade-in" style={{ animationDelay: `${sidebarItems.length * 0.1}s` }}>
                  <Collapsible open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
                    <SidebarMenuButton className="hover:bg-gradient-to-r hover:from-yellow-500/20 hover:to-amber-500/20 transition-all duration-300 group">
                      <div className="flex items-center gap-2 w-full">
                        <Crown className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                        <span 
                          onClick={handlePremiumClick}
                          className="group-hover:translate-x-1 transition-transform duration-200 text-yellow-500 font-medium cursor-pointer hover:text-yellow-400 flex-1"
                        >
                          Upgrade to Premium
                        </span>
                        <CollapsibleTrigger asChild>
                          <ChevronDown 
                            onClick={handleArrowClick}
                            className="h-4 w-4 transition-transform duration-200 cursor-pointer hover:scale-110 text-yellow-500"
                            style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          />
                        </CollapsibleTrigger>
                      </div>
                    </SidebarMenuButton>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton className="text-white/70 hover:text-yellow-500 transition-colors">
                            <span className="text-xs">• No advertisements</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton className="text-white/70 hover:text-yellow-500 transition-colors">
                            <span className="text-xs">• Exclusive premium songs</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton className="text-white/70 hover:text-yellow-500 transition-colors">
                            <span className="text-xs">• Offline Access</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton className="text-white/70 hover:text-yellow-500 transition-colors">
                            <span className="text-xs">• VIP Merch Access</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                          <SidebarMenuSubButton 
                            onClick={handleManyMoreClick}
                            className="text-white/70 hover:text-yellow-500 transition-colors cursor-pointer"
                          >
                            <span className="text-xs font-bold">& Many More</span>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                </SidebarMenuItem>
               )}
               
               {/* Support the Artist Section */}
               <SidebarMenuItem className="animate-fade-in mt-2" style={{ animationDelay: `${sidebarItems.length * 0.1 + 0.1}s` }}>
                 <SidebarMenuButton className="hover:bg-gradient-to-r hover:from-pink-500/20 hover:to-red-500/20 transition-all duration-300 group">
                   <Link 
                     to="/support" 
                     className="flex items-center gap-2 text-pink-400 hover:text-pink-300 font-medium w-full transition-all duration-300"
                   >
                     <Heart className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                     <span className="group-hover:translate-x-1 transition-transform duration-200">Support the Artist</span>
                   </Link>
                 </SidebarMenuButton>
               </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarComponent>
  );
};
