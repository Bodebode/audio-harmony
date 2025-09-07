
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
    </header>
  );
};
