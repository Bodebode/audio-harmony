import { Play, Heart, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ContentItem {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
  type: 'album' | 'playlist' | 'artist';
}

interface ContentGridProps {
  title: string;
  items: ContentItem[];
  showViewAll?: boolean;
  columns?: number;
}

const mockAlbums: ContentItem[] = [
  { id: "1", title: "Midnight Sessions", subtitle: "Bode Nathaniel", type: "album" },
  { id: "2", title: "Ocean Dreams", subtitle: "Bode Nathaniel", type: "album" },
  { id: "3", title: "Acoustic Stories", subtitle: "Bode Nathaniel", type: "album" },
  { id: "4", title: "Electronic Vibes", subtitle: "Bode Nathaniel", type: "album" },
  { id: "5", title: "Live Sessions", subtitle: "Bode Nathaniel", type: "album" },
  { id: "6", title: "Greatest Hits", subtitle: "Bode Nathaniel", type: "album" },
];

const mockPlaylists: ContentItem[] = [
  { id: "1", title: "My Favorites", subtitle: "50 songs", type: "playlist" },
  { id: "2", title: "Chill Vibes", subtitle: "32 songs", type: "playlist" },
  { id: "3", title: "Workout Mix", subtitle: "28 songs", type: "playlist" },
  { id: "4", title: "Late Night", subtitle: "41 songs", type: "playlist" },
  { id: "5", title: "Road Trip", subtitle: "67 songs", type: "playlist" },
];

export const ContentGrid = ({ 
  title, 
  items, 
  showViewAll = false, 
  columns = 5 
}: ContentGridProps) => {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3", 
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  }[columns] || "grid-cols-5";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold hover:underline cursor-pointer">{title}</h2>
        {showViewAll && (
          <Button variant="link" className="text-muted-foreground hover:text-foreground">
            Show all
          </Button>
        )}
      </div>
      
      <div className={`grid ${gridCols} gap-4`}>
        {items.slice(0, columns * 2).map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

const ContentCard = ({ item }: { item: ContentItem }) => {
  return (
    <Card className="group bg-background/50 hover:bg-accent/50 transition-all duration-200 cursor-pointer p-4 border-0">
      <div className="relative aspect-square mb-4">
        <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
          {item.type === 'playlist' ? (
            <div className="text-4xl">🎵</div>
          ) : (
            <div className="text-4xl">💿</div>
          )}
        </div>
        
        {/* Play Button Overlay */}
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 translate-y-2 group-hover:translate-y-0">
          <Button 
            size="sm" 
            className="rounded-full h-12 w-12 bg-primary hover:bg-primary/90 shadow-xl"
          >
            <Play className="h-5 w-5 fill-current" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-1">
        <h3 className="font-semibold text-sm truncate">{item.title}</h3>
        <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
      </div>
    </Card>
  );
};

// Pre-configured grid components for common use cases
export const AlbumsGrid = () => (
  <ContentGrid 
    title="Popular Albums" 
    items={mockAlbums} 
    showViewAll 
    columns={5} 
  />
);

export const PlaylistsGrid = () => (
  <ContentGrid 
    title="Made for You" 
    items={mockPlaylists} 
    showViewAll 
    columns={5} 
  />
);

export const RecentlyPlayedGrid = () => (
  <ContentGrid 
    title="Recently Played" 
    items={mockAlbums.slice(0, 6)} 
    showViewAll 
    columns={6} 
  />
);