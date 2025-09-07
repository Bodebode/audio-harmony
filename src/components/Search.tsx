import { useState } from "react";
import { Search as SearchIcon, PlayCircle, Heart, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const mockSearchResults = [
  {
    type: "song",
    title: "Midnight Dreams",
    artist: "Bode Nathaniel",
    album: "Late Night Vibes",
    duration: "3:45",
    image: "/placeholder.svg"
  },
  {
    type: "song", 
    title: "Ocean Waves",
    artist: "Bode Nathaniel",
    album: "Peaceful Moments",
    duration: "4:20",
    image: "/placeholder.svg"
  },
  {
    type: "album",
    title: "Afrobeats Collection",
    artist: "Bode Nathaniel",
    year: "2024",
    image: "/placeholder.svg"
  },
  {
    type: "playlist",
    title: "Chill Vibes",
    description: "Perfect for relaxing evenings",
    songs: 24,
    image: "/placeholder.svg"
  }
];

export const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredResults, setFilteredResults] = useState(mockSearchResults);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredResults(mockSearchResults);
    } else {
      const filtered = mockSearchResults.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.artist?.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredResults(filtered);
    }
  };

  return (
    <section id="search" className="p-6">
      <div className="mb-6">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Search for songs, artists, albums..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 h-12 text-lg bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary transition-all duration-200"
          />
        </div>
      </div>

      {searchQuery === "" ? (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-foreground mb-4">Browse Categories</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {["Afrobeats", "Pop", "R&B", "Hip Hop", "Jazz", "Acoustic", "Chill", "Workout"].map((category) => (
                <Card key={category} className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20 hover:from-primary/30 hover:to-primary/10 transition-all duration-300 cursor-pointer group">
                  <CardContent className="p-6">
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors">{category}</h4>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">
            {filteredResults.length} results for "{searchQuery}"
          </h3>
          
          <div className="space-y-3">
            {filteredResults.map((item, index) => (
              <Card key={index} className="bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/70 transition-all duration-200 group cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                      <PlayCircle className="h-6 w-6 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground truncate">{item.title}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {item.type}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground truncate">
                        {item.type === "song" && `${item.artist} • ${item.album}`}
                        {item.type === "album" && `${item.artist} • ${item.year}`}
                        {item.type === "playlist" && `${item.description} • ${item.songs} songs`}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.type === "song" && (
                        <span className="text-sm text-muted-foreground">{item.duration}</span>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};