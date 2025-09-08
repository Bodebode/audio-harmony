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
import { useState } from "react";

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
      <Card className="bg-black/40 backdrop-blur-lg border-[#1EAEDB]/10">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-[#FEF7CD]">Alkebulan</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAlbumPlayPause}
                className={`h-8 w-8 rounded-full transition-all duration-200 ${
                  isAlbumPlaying 
                    ? 'text-[#1EAEDB] bg-[#1EAEDB]/20' 
                    : 'text-[#FEF7CD] hover:text-[#1EAEDB] hover:bg-[#1EAEDB]/10'
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
              className="h-8 w-8 text-[#FEF7CD] hover:text-[#1EAEDB] hover:bg-[#1EAEDB]/10 transition-all duration-200"
            >
              <ChevronDown 
                className={`h-5 w-5 transition-transform duration-200 ${
                  isExpanded ? 'rotate-180' : 'rotate-0'
                }`} 
              />
            </Button>
          </div>
          {isExpanded && (
            <div className="space-y-2 animate-accordion-down">
              {sampleSongs.map((song, index) => (
              <div
                key={song.id}
                className="group flex items-center justify-between p-3 rounded-lg hover:bg-[#1EAEDB]/10 transition-all duration-300 cursor-pointer border border-transparent hover:border-[#1EAEDB]/20 hover:shadow-lg hover:shadow-[#1EAEDB]/10 hover:scale-[1.02] transform animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
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
                  <span className={`transition-colors ${
                    playingSongId === song.id ? 'text-[#1EAEDB]' : 'text-[#F2FCE2] group-hover:text-[#FEF7CD]'
                  }`}>
                    {song.title}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#F2FCE2]/60 group-hover:text-[#F2FCE2]/80 transition-colors">
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
                      {playlists.map((playlist) => (
                        <DropdownMenuItem
                          key={playlist.id}
                          onClick={() => handleAddToPlaylist(playlist.id, song.id)}
                        >
                          Add to {playlist.name}
                        </DropdownMenuItem>
                      ))}
                      {playlists.length === 0 && (
                        <DropdownMenuItem disabled>
                          No playlists available
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};