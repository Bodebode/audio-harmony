import { useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SearchResult {
  id: string;
  title: string;
  artist: string;
  type: 'song' | 'album' | 'artist' | 'playlist';
  image?: string;
}

const mockResults: SearchResult[] = [
  { id: "1", title: "Midnight Dreams", artist: "Bode Nathaniel", type: "song" },
  { id: "2", title: "Ocean Waves", artist: "Bode Nathaniel", type: "song" },
  { id: "3", title: "Best of Bode", artist: "Bode Nathaniel", type: "playlist" },
  { id: "4", title: "Acoustic Sessions", artist: "Bode Nathaniel", type: "album" },
];

export const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (value: string) => {
    setQuery(value);
    setIsSearching(true);
    
    // Mock search delay
    setTimeout(() => {
      if (value.length > 0) {
        const filtered = mockResults.filter(
          item => 
            item.title.toLowerCase().includes(value.toLowerCase()) ||
            item.artist.toLowerCase().includes(value.toLowerCase())
        );
        setResults(filtered);
      } else {
        setResults([]);
      }
      setIsSearching(false);
    }, 300);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'song': return 'text-green-400';
      case 'album': return 'text-blue-400';
      case 'artist': return 'text-purple-400';
      case 'playlist': return 'text-orange-400';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search for songs, artists, albums..."
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="pl-10 pr-10 bg-background/50 border-0 focus-visible:ring-1 focus-visible:ring-primary"
        />
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {query && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Search Results</h2>
          
          {isSearching ? (
            <div className="text-muted-foreground">Searching...</div>
          ) : results.length > 0 ? (
            <div className="grid gap-2">
              {results.map((result) => (
                <Card key={result.id} className="p-4 hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
                      <SearchIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{result.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className={getTypeColor(result.type)}>
                          {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                        </span>
                        <span>•</span>
                        <span>{result.artist}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-muted-foreground">No results found for "{query}"</div>
          )}
        </div>
      )}

      {!query && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Browse All</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {['Pop', 'Rock', 'Hip Hop', 'Electronic', 'Jazz', 'Classical', 'Country', 'R&B'].map((genre) => (
              <Card key={genre} className="aspect-square p-6 bg-gradient-to-br from-primary/20 to-accent/20 hover:from-primary/30 hover:to-accent/30 transition-colors cursor-pointer">
                <h3 className="text-lg font-bold">{genre}</h3>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};