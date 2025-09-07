import { useState, useEffect } from "react";
import { Home } from "./Home";
import { Search } from "./Search";
import { Library } from "./Library";
import { Playlists } from "./Playlists";
import { MusicPlayer } from "./MusicPlayer";

export const MainContent = () => {
  const [activeSection, setActiveSection] = useState("home");

  // Listen for hash changes to update active section
  const handleHashChange = (hash: string) => {
    const section = hash.replace("#", "") || "home";
    setActiveSection(section);
  };

  // Set up hash change listener
  useEffect(() => {
    const handleLocationChange = () => {
      handleHashChange(window.location.hash);
    };
    
    handleHashChange(window.location.hash);
    window.addEventListener("hashchange", handleLocationChange);
    
    return () => window.removeEventListener("hashchange", handleLocationChange);
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case "search":
        return <Search />;
      case "library":
        return <Library />;
      case "playlists":
        return <Playlists />;
      case "now-playing":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Now Playing</h2>
            <MusicPlayer />
          </div>
        );
      case "liked-songs":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-bold text-foreground mb-6">Liked Songs</h2>
            <div className="text-muted-foreground">Your liked songs will appear here.</div>
          </div>
        );
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-b from-background/50 to-background">
      {renderContent()}
    </div>
  );
};