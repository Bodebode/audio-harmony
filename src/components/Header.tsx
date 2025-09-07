
import { Menu, Search, ShoppingCart, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState } from "react";
import { SearchModal } from "./SearchModal";
import { useToast } from "@/components/ui/use-toast";

export const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { toast } = useToast();

  const handleCartClick = () => {
    toast({
      title: "Merch Store",
      description: "Redirecting to merchandise store...",
    });
    // TODO: Navigate to merch store
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
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
