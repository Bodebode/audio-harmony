
import { Menu, Search, ShoppingCart, Home, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { SearchModal } from "./SearchModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { PremiumBadge } from "./premium/PremiumBadge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";

export const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { user, profile, isGuest, signOut } = useAuth();

  const handleCartClick = () => {
    // TODO: Navigate to merch store
  };

  const handleSignOut = async () => {
    if (isGuest) {
      navigate('/auth');
    } else {
      await signOut();
    }
  };

  const handleUpgradeToPremium = () => {
    navigate('/premium');
  };

  return (
    <>
      <header className="p-6 flex justify-between items-center">
        <Button variant="ghost" size="icon" className="text-white" asChild>
          <SidebarTrigger>
            <Menu className="h-6 w-6" />
          </SidebarTrigger>
        </Button>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:text-[#1EAEDB] hover:bg-white/10 transition-colors duration-200 rounded-full"
          >
            <Home className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:text-[#1EAEDB] hover:bg-white/10 transition-colors duration-200 rounded-full"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:text-[#1EAEDB] hover:bg-white/10 transition-colors duration-200 rounded-full"
            onClick={handleCartClick}
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:text-[#1EAEDB] hover:bg-white/10 transition-colors duration-200 rounded-full"
              >
                <Avatar className="h-5 w-5">
                  <AvatarFallback className="bg-[#1EAEDB] text-white text-xs">
                    {isGuest ? 'G' : profile?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-black/90 border-white/10" align="end">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="w-8 h-8 bg-gradient-to-r from-[#1EAEDB] to-[#0FA0CE] rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="flex flex-col space-y-1 leading-none flex-1">
                  {isGuest ? (
                    <>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">Guest User</p>
                      </div>
                      <p className="w-[200px] truncate text-sm text-white/70">
                        Browsing as guest
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white">
                          {profile?.display_name || user?.email}
                        </p>
                        <PremiumBadge size="sm" variant="solid" showText={false} />
                      </div>
                      <p className="w-[200px] truncate text-sm text-white/70">
                        {profile?.is_premium ? 'Premium Member' : 'Free User'}
                      </p>
                    </>
                  )}
                </div>
              </div>
              <DropdownMenuSeparator className="bg-white/10" />
              {!isGuest && (
                <>
                  <DropdownMenuItem className="text-white hover:bg-white/10">
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-white hover:bg-white/10">
                    {profile?.is_premium ? 'Manage Subscription' : 'Upgrade to Premium'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/10" />
                </>
              )}
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="text-white hover:bg-white/10"
              >
                {isGuest ? 'Sign Up' : 'Sign Out'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
