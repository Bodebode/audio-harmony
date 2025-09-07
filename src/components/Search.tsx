import { useState, useMemo } from "react";
import { Search as SearchIcon, PlayCircle, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";

const sampleSongs = [
  { id: 1, title: "Afrobeat Fusion", artist: "Bode Nathaniel", duration: "3:45" },
  { id: 2, title: "Electronic Dreams", artist: "Tech Master", duration: "4:20" },
  { id: 3, title: "Jazz Evening", artist: "Smooth Collective", duration: "3:15" },
  { id: 4, title: "Rock Anthem", artist: "Thunder Band", duration: "3:50" },
  { id: 5, title: "Pop Sensation", artist: "Star Voice", duration: "4:10" },
  { id: 6, title: "Classical Motion", artist: "Orchestra Plus", duration: "3:30" },
  { id: 7, title: "Hip Hop Flow", artist: "Beat Master", duration: "4:05" },
  { id: 8, title: "Country Road", artist: "Nashville Sound", duration: "3:55" },
  { id: 9, title: "Reggae Vibes", artist: "Island Rhythm", duration: "4:15" },
  { id: 10, title: "Blues Soul", artist: "Deep Voice", duration: "3:40" }
];

const samplePlaylists = [
  { id: 1, name: "My Favorites", songCount: 25 },
  { id: 2, name: "Workout Mix", songCount: 15 },
  { id: 3, name: "Chill Vibes", songCount: 30 },
  { id: 4, name: "Party Time", songCount: 20 }
];

export const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [playingSongId, setPlayingSongId] = useState<number | null>(null);
  const { toast } = useToast();

  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) return sampleSongs;
    return sampleSongs.filter(song => 
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredPlaylists = useMemo(() => {
    if (!searchQuery.trim()) return samplePlaylists;
    return samplePlaylists.filter(playlist => 
      playlist.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handlePlaySong = (songId: number) => {
    setPlayingSongId(songId);
    toast({
      title: "Now Playing",
      description: `Playing ${sampleSongs.find(s => s.id === songId)?.title}`,
    });
  };

  const handleAddToPlaylist = (songId: number) => {
    toast({
      title: "Added to playlist",
      description: "Song added successfully",
    });
  };

  return (
    <section id="search" className="p-6">
      <Card className="bg-black/40 backdrop-blur-lg border-[#1EAEDB]/10">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="relative group">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#F2FCE2]/50 transition-colors duration-200 group-focus-within:text-[#1EAEDB]" />
              <Input
                placeholder="Search songs, artists, playlists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/20 border-[#1EAEDB]/20 text-[#F2FCE2] placeholder:text-[#F2FCE2]/50 focus:border-[#1EAEDB]/50 focus:ring-[#1EAEDB]/20 transition-all duration-300 focus:bg-black/30 focus:shadow-lg focus:shadow-[#1EAEDB]/10"
              />
            </div>

            {searchQuery && (
              <div className="space-y-6 animate-fade-in">
                {/* Songs Results */}
                {filteredSongs.length > 0 && (
                  <div className="animate-scale-in">
                    <h3 className="text-lg font-semibold text-[#FEF7CD] mb-3 animate-fade-in">Songs</h3>
                    <div className="space-y-2">
                      {filteredSongs.map((song, index) => (
                        <div
                          key={song.id}
                          className="group flex items-center justify-between p-3 rounded-lg hover:bg-[#1EAEDB]/10 transition-all duration-300 cursor-pointer border border-transparent hover:border-[#1EAEDB]/20 hover:shadow-lg hover:shadow-[#1EAEDB]/10 hover:scale-[1.02] transform animate-fade-in"
                          style={{ animationDelay: `${index * 50}ms` }}
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
                    </div>
                  </div>
                )}

                {/* Playlists Results */}
                {filteredPlaylists.length > 0 && (
                  <div className="animate-scale-in" style={{ animationDelay: '100ms' }}>
                    <h3 className="text-lg font-semibold text-[#FEF7CD] mb-3 animate-fade-in">Playlists</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredPlaylists.map((playlist, index) => (
                        <div
                          key={playlist.id}
                          className="group p-4 rounded-lg bg-black/20 hover:bg-[#1EAEDB]/10 transition-all duration-300 cursor-pointer border border-transparent hover:border-[#1EAEDB]/20 hover:shadow-lg hover:shadow-[#1EAEDB]/10 hover:scale-105 transform animate-fade-in"
                          style={{ animationDelay: `${(index + filteredSongs.length) * 50}ms` }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-[#F2FCE2] group-hover:text-[#FEF7CD] transition-colors">
                                {playlist.name}
                              </h4>
                              <p className="text-sm text-[#F2FCE2]/70 group-hover:text-[#F2FCE2]/90">
                                {playlist.songCount} songs
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-[#F2FCE2] hover:text-[#1EAEDB] hover:bg-[#1EAEDB]/10 transition-all duration-200 opacity-0 group-hover:opacity-100"
                            >
                              <PlayCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* No Results */}
                {filteredSongs.length === 0 && filteredPlaylists.length === 0 && (
                  <div className="text-center py-8 animate-fade-in">
                    <p className="text-[#F2FCE2]/60 animate-pulse">No results found for "{searchQuery}"</p>
                    <p className="text-sm text-[#F2FCE2]/40 mt-1">Try a different search term</p>
                  </div>
                )}
              </div>
            )}

          </div>
        </CardContent>
      </Card>
    </section>
  );
};