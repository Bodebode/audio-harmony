import { useState, useMemo } from "react";
import { Search as SearchIcon, PlayCircle, Plus, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

const bodeSongs = [
  { id: 1, title: "Afrobeat Fusion", artist: "Bode Nathaniel", duration: "3:45" },
  { id: 2, title: "Midnight Groove", artist: "Bode Nathaniel", duration: "4:20" },
  { id: 3, title: "Urban Rhythm", artist: "Bode Nathaniel", duration: "3:15" },
  { id: 4, title: "Sunset Vibes", artist: "Bode Nathaniel", duration: "3:50" },
  { id: 5, title: "Electric Dreams", artist: "Bode Nathaniel", duration: "4:10" },
  { id: 6, title: "Soulful Journey", artist: "Bode Nathaniel", duration: "3:30" },
  { id: 7, title: "City Lights", artist: "Bode Nathaniel", duration: "4:05" },
  { id: 8, title: "Ocean Waves", artist: "Bode Nathaniel", duration: "3:55" },
  { id: 9, title: "Mountain High", artist: "Bode Nathaniel", duration: "4:15" },
  { id: 10, title: "Desert Wind", artist: "Bode Nathaniel", duration: "3:40" }
];

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [playingSongId, setPlayingSongId] = useState<number | null>(null);
  const { toast } = useToast();

  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) return bodeSongs.slice(0, 6); // Show first 6 songs by default
    return bodeSongs.filter(song => 
      song.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handlePlaySong = (songId: number) => {
    setPlayingSongId(songId);
    toast({
      title: "Now Playing",
      description: `Playing ${bodeSongs.find(s => s.id === songId)?.title}`,
    });
  };

  const handleAddToPlaylist = (songId: number) => {
    toast({
      title: "Added to playlist",
      description: "Song added successfully",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl bg-black/95 border-[#1EAEDB]/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-[#1EAEDB]">
            Search Songs
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative group">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#F2FCE2]/50 transition-colors duration-200 group-focus-within:text-[#1EAEDB]" />
            <Input
              placeholder="Search songs by Bode Nathaniel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-black/20 border-[#1EAEDB]/20 text-[#F2FCE2] placeholder:text-[#F2FCE2]/50 focus:border-[#1EAEDB]/50 focus:ring-[#1EAEDB]/20"
              autoFocus
            />
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {filteredSongs.map((song, index) => (
              <div
                key={song.id}
                className="group flex items-center justify-between p-3 rounded-lg hover:bg-[#1EAEDB]/10 transition-all duration-300 cursor-pointer border border-transparent hover:border-[#1EAEDB]/20"
              >
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 rounded-full transition-all duration-200 ${
                      playingSongId === song.id 
                        ? 'text-[#1EAEDB] bg-[#1EAEDB]/20 animate-pulse' 
                        : 'text-[#F2FCE2] hover:text-[#1EAEDB] hover:bg-[#1EAEDB]/10 opacity-0 group-hover:opacity-100'
                    }`}
                    onClick={() => handlePlaySong(song.id)}
                  >
                    <PlayCircle className="h-4 w-4" />
                  </Button>
                  <div>
                    <p className={`font-medium transition-colors ${
                      playingSongId === song.id ? 'text-[#1EAEDB]' : 'text-[#F2FCE2] group-hover:text-[#FEF7CD]'
                    }`}>
                      {song.title}
                    </p>
                    <p className="text-sm text-[#F2FCE2]/70 group-hover:text-[#F2FCE2]/90">
                      {song.artist}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#F2FCE2]/60 text-sm group-hover:text-[#F2FCE2]/80">
                    {song.duration}
                  </span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-[#F2FCE2] hover:text-[#1EAEDB] hover:bg-[#1EAEDB]/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleAddToPlaylist(song.id)}>
                        Add to My Favorites
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAddToPlaylist(song.id)}>
                        Add to Workout Mix
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAddToPlaylist(song.id)}>
                        Create new playlist
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
            
            {filteredSongs.length === 0 && searchQuery && (
              <div className="text-center py-8">
                <p className="text-[#F2FCE2]/60">No songs found for "{searchQuery}"</p>
                <p className="text-sm text-[#F2FCE2]/40 mt-1">Try a different search term</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};