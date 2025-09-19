import { Home, Menu, Library, Crown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePremium } from "@/hooks/usePremium";
import { PremiumBadge } from "./premium/PremiumBadge";
import { useSidebar } from "@/components/ui/sidebar";

export const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isGuest } = useAuth();
  const { isPremiumActive } = usePremium();
  const { toggleSidebar } = useSidebar();

  const navItems = [
    {
      icon: Home,
      label: "Home",
      path: "/",
      onClick: () => navigate("/")
    },
    {
      icon: Menu,
      label: "Menu",
      path: "/menu",
      onClick: () => toggleSidebar()
    },
    {
      icon: Library,
      label: "Library",
      path: "/library",
      onClick: () => {
        // Scroll to library section
        const librarySection = document.getElementById('library');
        if (librarySection) {
          librarySection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    {
      icon: Crown,
      label: "Premium", 
      path: "/premium",
      onClick: () => navigate("/premium")
    },
    {
      icon: User,
      label: isGuest ? "Sign Up" : "Profile",
      path: isGuest ? "/auth" : "/profile",
      onClick: () => navigate(isGuest ? "/auth" : "/profile")
    }
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-t border-white/10 pb-safe-area-inset-bottom">
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Button
              key={item.path}
              variant="ghost"
              onClick={item.onClick}
              className={`flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-0 flex-1 max-w-20 ${
                active 
                  ? 'text-[#1EAEDB]' 
                  : 'text-white/70 hover:bg-[#1EAEDB]/20 hover:text-[#1EAEDB]'
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${active ? 'text-[#1EAEDB]' : ''}`} />
                {item.label === "Premium" && isPremiumActive && (
                  <div className="absolute -top-1 -right-1">
                    <PremiumBadge size="sm" variant="solid" showText={false} />
                  </div>
                )}
              </div>
              <span className={`text-xs font-medium leading-none ${
                active ? 'text-[#1EAEDB]' : 'text-white/70'
              }`}>
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};