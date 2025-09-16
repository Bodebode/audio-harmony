
import { Menu, Search, ShoppingCart, Home, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { SearchModal } from "./SearchModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";
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
  const { user, profile, isGuest, signOut, exitGuestMode } = useAuth();
  const { isAdmin } = useAdmin();

  const handleCartClick = () => {
    navigate('/merch');
  };

  const handleSignOut = async () => {
    if (isGuest) {
      exitGuestMode();
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
      <header className="p-4 md:p-6 flex justify-between items-center">
        {/* Mobile-optimized sidebar trigger */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white h-11 w-11 md:h-10 md:w-10" 
          asChild
        >
          <SidebarTrigger>
            <Menu className="h-6 w-6" />
          </SidebarTrigger>
        </Button>
        
        {/* Mobile-optimized navigation with larger touch targets */}
        <div className="flex items-center gap-1 md:gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:text-[#1EAEDB] hover:bg-white/10 transition-colors duration-200 rounded-full h-11 w-11 md:h-10 md:w-10"
            onClick={() => navigate('/')}
          >
            <Home className="h-6 w-6 md:h-5 md:w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:text-[#1EAEDB] hover:bg-white/10 transition-colors duration-200 rounded-full h-11 w-11 md:h-10 md:w-10"
            onClick={() => setIsSearchOpen(true)}
            data-search-trigger
          >
            <Search className="h-6 w-6 md:h-5 md:w-5" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white hover:text-[#1EAEDB] hover:bg-white/10 transition-colors duration-200 rounded-full h-11 w-11 md:h-10 md:w-10"
            onClick={handleCartClick}
          >
            <ShoppingCart className="h-6 w-6 md:h-5 md:w-5" />
          </Button>

          {/* User Menu with larger touch target */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-white hover:text-[#1EAEDB] hover:bg-white/10 transition-colors duration-200 rounded-full h-11 w-11 md:h-10 md:w-10"
              >
                <Avatar className="h-6 w-6 md:h-5 md:w-5">
                  <AvatarFallback className="bg-[#1EAEDB] text-white text-sm md:text-xs">
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
                  <DropdownMenuItem 
                    onClick={() => navigate('/profile')}
                    className="text-white hover:bg-white/10 cursor-pointer"
                  >
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => navigate('/premium')}
                    className="text-white hover:bg-white/10 cursor-pointer"
                  >
                    {profile?.is_premium ? 'Manage Subscription' : 'Upgrade to Premium'}
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem 
                      onClick={() => navigate('/admin')}
                      className="text-white hover:bg-white/10 cursor-pointer"
                    >
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
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
