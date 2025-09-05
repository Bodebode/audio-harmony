
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export const Header = () => {
  return (
    <header className="p-6 flex justify-between items-center">
      <Button variant="ghost" size="icon" className="text-white" asChild>
        <SidebarTrigger>
          <Menu className="h-6 w-6" />
        </SidebarTrigger>
      </Button>
      <div className="flex gap-4 flex-wrap">
        <Button variant="ghost" className="text-white hover:text-[#1EAEDB]">
          <a href="https://open.spotify.com/artist/6ybapGF4VVYMYKTKAJPoR7" target="_blank" rel="noopener noreferrer">Spotify</a>
        </Button>
        <Button variant="ghost" className="text-white hover:text-[#1EAEDB]">
          <a href="https://www.bodenathaniel.com" target="_blank" rel="noopener noreferrer">Website</a>
        </Button>
      </div>
    </header>
  );
};
