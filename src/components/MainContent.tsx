import { useState, useEffect } from "react";
import { ListMusic, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Home } from "@/components/Home";
import { Search } from "@/components/Search";
import { Library } from "@/components/Library";
import { Playlists } from "@/components/Playlists";
import { QueueSidebar } from "@/components/QueueSidebar";

export const MainContent = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isQueueOpen, setIsQueueOpen] = useState(false);

  const handleNavigation = () => {
    const hash = window.location.hash;
    if (hash) {
      const section = hash.replace('#', '');
      setActiveSection(section);
    }
  };

  // Listen for hash changes
  useEffect(() => {
    handleNavigation();
    window.addEventListener('hashchange', handleNavigation);
    return () => window.removeEventListener('hashchange', handleNavigation);
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'search':
        return <Search />;
      case 'library':
        return <Library />;
      case 'playlists':
        return <Playlists />;
      case 'liked-songs':
        return <div className="p-6"><h1 className="text-2xl font-bold">Liked Songs</h1></div>;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex-1 flex">
      {/* Main Content Area */}
      <div className="flex-1 bg-gradient-to-b from-background/80 to-background overflow-hidden">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-4 bg-background/50 backdrop-blur-sm border-b border-border">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="bg-background/50"
              onClick={() => window.history.back()}
            >
              ←
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="bg-background/50"
              onClick={() => window.history.forward()}
            >
              →
            </Button>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsQueueOpen(!isQueueOpen)}
              className={isQueueOpen ? "bg-accent" : ""}
            >
              <ListMusic className="h-4 w-4 mr-2" />
              Queue
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="h-full">
          {renderContent()}
        </div>
      </div>

      {/* Queue Sidebar */}
      <QueueSidebar 
        isOpen={isQueueOpen} 
        onClose={() => setIsQueueOpen(false)} 
      />
    </div>
  );
};