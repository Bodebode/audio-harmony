import { ScrollArea } from "@/components/ui/scroll-area";
import { AlbumsGrid, PlaylistsGrid, RecentlyPlayedGrid } from "@/components/ContentGrid";
import { Button } from "@/components/ui/button";

export const Home = () => {
  const currentTime = new Date().getHours();
  const greeting = 
    currentTime < 12 ? "Good morning" :
    currentTime < 18 ? "Good afternoon" : 
    "Good evening";

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-8">
        {/* Greeting */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{greeting}</h1>
        </div>

        {/* Quick Access Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: "Liked Songs", subtitle: "64 songs" },
            { title: "My Playlist #1", subtitle: "23 songs" },
            { title: "Recently Played", subtitle: "Mixed playlist" },
            { title: "Discover Weekly", subtitle: "Fresh music" },
            { title: "Release Radar", subtitle: "New releases" },
            { title: "Daily Mix 1", subtitle: "Mixed for you" },
          ].map((item) => (
            <Button
              key={item.title}
              variant="ghost"
              className="h-20 justify-start bg-background/50 hover:bg-accent/50 transition-colors group"
            >
              <div className="flex items-center gap-4 w-full">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded flex items-center justify-center">
                  <span className="text-2xl">🎵</span>
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.subtitle}</p>
                </div>
              </div>
            </Button>
          ))}
        </div>

        {/* Content Grids */}
        <div className="space-y-8">
          <RecentlyPlayedGrid />
          <AlbumsGrid />
          <PlaylistsGrid />
        </div>
      </div>
    </ScrollArea>
  );
};