import { ContentGrid, RecentlyPlayed, MadeForYou, PopularAlbums } from "./ContentGrid";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlayCircle, Shuffle } from "lucide-react";

const featuredPlaylist = {
  title: "Today's Top Hits",
  description: "The most played songs right now",
  songs: 50,
  duration: "3h 12m"
};

export const Home = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="px-6 pt-6">
        <Card className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-primary/10 to-background/50 backdrop-blur-sm border-border/50">
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <div className="w-32 h-32 bg-primary/30 rounded-lg flex items-center justify-center">
                <PlayCircle className="h-16 w-16 text-primary" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wide">Featured Playlist</p>
                  <h1 className="text-4xl font-bold text-foreground mb-2">{featuredPlaylist.title}</h1>
                  <p className="text-foreground/80 mb-4">{featuredPlaylist.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {featuredPlaylist.songs} songs • {featuredPlaylist.duration}
                  </p>
                </div>
                
                <div className="flex items-center gap-4">
                  <Button size="lg" className="h-12 px-8">
                    <PlayCircle className="h-5 w-5 mr-2" />
                    Play
                  </Button>
                  <Button variant="outline" size="lg" className="h-12 px-8">
                    <Shuffle className="h-5 w-5 mr-2" />
                    Shuffle
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Quick Access */}
      <section className="px-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Good afternoon</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            "Liked Songs",
            "Recently Played", 
            "Discover Weekly",
            "Release Radar",
            "Daily Mix 1",
            "Chill Hits"
          ].map((item) => (
            <Card 
              key={item}
              className="bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/70 transition-all duration-200 cursor-pointer group"
            >
              <CardContent className="p-0">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-primary/20 flex items-center justify-center">
                    <PlayCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 px-4">
                    <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                      {item}
                    </h3>
                  </div>
                  <div className="pr-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <PlayCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Content Sections */}
      <RecentlyPlayed />
      <MadeForYou />
      <PopularAlbums />
      
      {/* Jump back in */}
      <section className="px-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Jump back in</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card 
              key={i}
              className="bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/70 transition-all duration-200 cursor-pointer group"
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="aspect-square bg-primary/20 rounded-lg flex items-center justify-center">
                    <PlayCircle className="h-8 w-8 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="font-medium text-foreground text-sm truncate">Mix {i}</h4>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};