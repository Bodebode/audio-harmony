import { PlayCircle, Heart, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface GridItem {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  type: "album" | "playlist" | "artist";
}

interface ContentGridProps {
  title: string;
  items: GridItem[];
  layout?: "grid" | "horizontal";
}

const mockItems: GridItem[] = [
  {
    id: "1",
    title: "Afrobeats Essentials",
    subtitle: "The best of African rhythms",
    type: "playlist"
  },
  {
    id: "2", 
    title: "Late Night Vibes",
    subtitle: "Bode Nathaniel",
    type: "album"
  },
  {
    id: "3",
    title: "Chill Sessions",
    subtitle: "Perfect for relaxing",
    type: "playlist"
  },
  {
    id: "4",
    title: "Pop Hits",
    subtitle: "Current favorites",
    type: "playlist"
  },
  {
    id: "5",
    title: "Acoustic Sessions",
    subtitle: "Bode Nathaniel",
    type: "album"
  },
  {
    id: "6",
    title: "Workout Beats",
    subtitle: "High energy music",
    type: "playlist"
  }
];

export const ContentGrid = ({ 
  title, 
  items = mockItems, 
  layout = "grid" 
}: ContentGridProps) => {
  if (layout === "horizontal") {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground px-6">{title}</h2>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4 px-6 pb-4">
            {items.map((item) => (
              <Card 
                key={item.id} 
                className="w-48 shrink-0 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/70 transition-all duration-300 cursor-pointer group"
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="relative aspect-square bg-primary/20 rounded-lg overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle className="h-12 w-12 text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-110" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground truncate">{item.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">{item.subtitle}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <Button variant="ghost" className="text-primary hover:text-primary/80">
          Show all
        </Button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {items.map((item) => (
          <Card 
            key={item.id} 
            className="bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/70 transition-all duration-300 cursor-pointer group"
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="relative aspect-square bg-primary/20 rounded-lg overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle className="h-12 w-12 text-primary opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-110" />
                  </div>
                  
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">{item.subtitle}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const RecentlyPlayed = () => (
  <ContentGrid title="Recently Played" items={mockItems.slice(0, 4)} />
);

export const MadeForYou = () => (
  <ContentGrid title="Made For You" items={mockItems} layout="horizontal" />
);

export const PopularAlbums = () => (
  <ContentGrid title="Popular Albums" items={mockItems.slice(2)} layout="horizontal" />
);