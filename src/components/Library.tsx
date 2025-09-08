import { PlayCircle, Plus, ChevronDown, Play, Pause } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { SkeletonGrid } from "@/components/ui/skeleton-loader";
import { useState, useEffect } from "react";

const sampleSongs = [
  { id: 1, title: "Song 1", duration: "3:45" },
  { id: 2, title: "Song 2", duration: "4:20" },
  { id: 3, title: "Song 3", duration: "3:15" },
  { id: 4, title: "Song 4", duration: "3:50" },
  { id: 5, title: "Song 5", duration: "4:10" },
  { id: 6, title: "Song 6", duration: "3:30" },
  { id: 7, title: "Song 7", duration: "4:05" },
  { id: 8, title: "Song 8", duration: "3:55" },
  { id: 9, title: "Song 9", duration: "4:15" },
  { id: 10, title: "Song 10", duration: "3:40" }
];

export const Library = () => {
  const { toast } = useToast();
  const [playlists, setPlaylists] = useState<{ id: number; name: string; songs: number[]; }[]>([]);
  const [playingSongId, setPlayingSongId] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAlbumPlaying, setIsAlbumPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  // Detect mobile devices and simulate loading state
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(isMobileDevice || isTouchDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Get playlists from localStorage (shared with Playlists component)
  useEffect(() => {
    const stored = localStorage.getItem('music-playlists');
    if (stored) {
      try {
        const parsedPlaylists = JSON.parse(stored);
        setPlaylists(parsedPlaylists);
      } catch (e) {
        console.error('Error parsing stored playlists:', e);
      }
    }

    const handleStorageChange = () => {
      const updated = localStorage.getItem('music-playlists');
      if (updated) {
        try {
          const parsedPlaylists = JSON.parse(updated);
          setPlaylists(parsedPlaylists);
        } catch (e) {
          console.error('Error parsing updated playlists:', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 1000); // Poll for updates

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleAddToPlaylist = (playlistId: number, songId: number) => {
    setPlaylists(currentPlaylists => 
      currentPlaylists.map(playlist => {
        if (playlist.id === playlistId) {
          if (playlist.songs.includes(songId)) {
            toast({
              title: "Already in playlist",
              description: "This song is already in the selected playlist",
              variant: "destructive",
            });
            return playlist;
          }
          toast({
            title: "Success",
            description: "Song added to playlist successfully",
          });
          return {
            ...playlist,
            songs: [...playlist.songs, songId],
          };
        }
        return playlist;
      })
    );
  };

  const handlePlaySong = (songId: number) => {
    setPlayingSongId(songId);
    toast({
      title: "Now Playing",
      description: `Playing ${sampleSongs.find(s => s.id === songId)?.title}`,
    });
  };

  const handleAlbumPlayPause = () => {
    setIsAlbumPlaying(!isAlbumPlaying);
    if (!isAlbumPlaying) {
      // Start playing the first song
      setPlayingSongId(sampleSongs[0].id);
      toast({
        title: "Playing Album",
        description: "Started playing Alkebulan album",
      });
    } else {
      // Pause the album
      setPlayingSongId(null);
      toast({
        title: "Paused",
        description: "Album playback paused",
      });
    }
  };

  return (
    <section id="library" className="p-6">
      <Card className="glass-card gradient-mesh-1 relative overflow-hidden">
        {/* Gradient overlay animation */}
        <div className="absolute inset-0 gradient-aurora opacity-50 animate-gentle-pulse pointer-events-none" />
        
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-[#FEF7CD] relative">
                Alkebulan
                <div className="absolute -inset-1 bg-gradient-to-r from-[#1EAEDB]/20 via-transparent to-[#FEF7CD]/10 blur-sm -z-10 opacity-50" />
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAlbumPlayPause}
                disabled={isLoading}
                className={`h-8 w-8 rounded-full transition-all duration-300 backdrop-blur-sm ${
                  isAlbumPlaying 
                    ? 'text-[#1EAEDB] bg-[#1EAEDB]/30 shadow-[0_0_20px_rgba(30,174,219,0.3)]' 
                    : 'text-[#FEF7CD] hover:text-[#1EAEDB] hover:bg-[#1EAEDB]/20 hover:shadow-[0_0_15px_rgba(30,174,219,0.2)]'
                }`}
              >
                {isAlbumPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 text-[#FEF7CD] hover:text-[#1EAEDB] hover:bg-[#1EAEDB]/20 transition-all duration-300 backdrop-blur-sm"
            >
              <ChevronDown 
                className={`h-5 w-5 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : 'rotate-0'
                }`} 
              />
            </Button>
          </div>
          
          {isExpanded && (
            <div className="space-y-2 animate-accordion-down">
              {isLoading ? (
                <SkeletonGrid count={10} className="animate-fade-in" />
              ) : (
                sampleSongs.map((song, index) => (
                  <div
                    key={song.id}
                    className="glass-item group flex items-center justify-between p-3 rounded-lg cursor-pointer transform animate-fade-in gradient-mesh-2"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Shimmer overlay for extra sparkle */}
                    <div className="absolute inset-0 gradient-shimmer opacity-0 group-hover:opacity-100 rounded-lg" />
                    
                    <div className="flex items-center gap-3 relative z-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 rounded-full transition-all duration-300 backdrop-blur-sm ${
                          playingSongId === song.id 
                            ? 'text-[#1EAEDB] bg-[#1EAEDB]/30 animate-pulse shadow-[0_0_15px_rgba(30,174,219,0.4)]' 
                            : 'text-[#F2FCE2] hover:text-[#1EAEDB] hover:bg-[#1EAEDB]/20 opacity-0 group-hover:opacity-100'
                        }`}
                        onClick={() => handlePlaySong(song.id)}
                      >
                        <PlayCircle className="h-4 w-4" />
                      </Button>
                      <span className={`transition-all duration-300 ${
                        playingSongId === song.id ? 'text-[#1EAEDB] font-medium' : 'text-[#F2FCE2] group-hover:text-[#FEF7CD]'
                      }`}>
                        {song.title}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 relative z-10">
                      <span className="text-[#F2FCE2]/60 group-hover:text-[#F2FCE2]/90 transition-colors duration-300 text-sm font-mono">
                        {song.duration}
                      </span>
                      {!isMobile && (
                        <DropdownMenu 
                          open={openDropdown === song.id}
                          onOpenChange={(open) => setOpenDropdown(open ? song.id : null)}
                        >
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-[#F2FCE2] hover:text-[#1EAEDB] hover:bg-[#1EAEDB]/20 transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(openDropdown === song.id ? null : song.id);
                              }}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="backdrop-blur-xl bg-black/80 border-[#1EAEDB]/20">
                            {playlists.map((playlist) => (
                              <DropdownMenuItem
                                key={playlist.id}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToPlaylist(playlist.id, song.id);
                                  setOpenDropdown(null);
                                }}
                                className="hover:bg-[#1EAEDB]/10 text-[#F2FCE2] hover:text-[#FEF7CD] transition-colors"
                              >
                                Add to {playlist.name}
                              </DropdownMenuItem>
                            ))}
                            {playlists.length === 0 && (
                              <DropdownMenuItem disabled className="text-[#F2FCE2]/50">
                                Create a playlist first to add songs
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                      {isMobile && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#F2FCE2] hover:text-[#1EAEDB] hover:bg-[#1EAEDB]/20 transition-all duration-300 opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (playlists.length === 0) {
                              toast({
                                title: "No playlists",
                                description: "Create a playlist first to add songs",
                                variant: "destructive",
                              });
                            } else {
                              toast({
                                title: "Feature Note",
                                description: "Tap and hold to add to playlist (coming soon)",
                              });
                            }
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};