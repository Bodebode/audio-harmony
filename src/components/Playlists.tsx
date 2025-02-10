
import { Plus, X, Play } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

type Playlist = {
  id: number;
  name: string;
  songs: number[];
};

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

export const Playlists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [expandedPlaylist, setExpandedPlaylist] = useState<number | null>(null);
  const { toast } = useToast();

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a playlist name",
        variant: "destructive",
      });
      return;
    }

    const newPlaylist: Playlist = {
      id: Date.now(),
      name: newPlaylistName.trim(),
      songs: [],
    };

    setPlaylists([...playlists, newPlaylist]);
    setNewPlaylistName("");
    toast({
      title: "Success",
      description: "Playlist created successfully",
    });
  };

  const handleRemoveSong = (playlistId: number, songId: number) => {
    setPlaylists(currentPlaylists =>
      currentPlaylists.map(playlist => {
        if (playlist.id === playlistId) {
          return {
            ...playlist,
            songs: playlist.songs.filter(id => id !== songId)
          };
        }
        return playlist;
      })
    );
    toast({
      title: "Success",
      description: "Song removed from playlist",
    });
  };

  const togglePlaylist = (playlistId: number) => {
    setExpandedPlaylist(current => current === playlistId ? null : playlistId);
  };

  const handlePlayPlaylist = (playlist: Playlist) => {
    if (playlist.songs.length === 0) {
      toast({
        title: "Error",
        description: "This playlist is empty",
        variant: "destructive",
      });
      return;
    }

    if ((window as any).musicPlayerControls) {
      (window as any).musicPlayerControls.playPlaylist(playlist.songs);
      toast({
        title: "Success",
        description: `Playing playlist: ${playlist.name}`,
      });
    }
  };

  return (
    <section id="playlists" className="p-6">
      <Card className="bg-black/40 backdrop-blur-lg border-[#1EAEDB]/10">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-[#FEF7CD] mb-4">Playlists</h2>
          
          <div className="flex gap-3 mb-6">
            <Input
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Enter playlist name"
              className="bg-black/20 border-[#1EAEDB]/20 text-[#F2FCE2] placeholder:text-[#F2FCE2]/50"
            />
            <Button
              onClick={handleCreatePlaylist}
              className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/80 text-white"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create
            </Button>
          </div>

          <div className="space-y-2">
            {playlists.map((playlist) => (
              <div key={playlist.id} className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 hover:bg-[#1EAEDB]/5 transition-colors">
                  <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => togglePlaylist(playlist.id)}>
                    <span className="text-[#F2FCE2]">{playlist.name}</span>
                    <span className="text-[#F2FCE2]/70 text-sm">
                      {playlist.songs.length} songs
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handlePlayPlaylist(playlist)}
                    className="text-[#F2FCE2] hover:text-[#1EAEDB] transition-colors"
                  >
                    <Play className="h-5 w-5" />
                  </Button>
                </div>
                {expandedPlaylist === playlist.id && (
                  <div className="ml-4 space-y-1">
                    {playlist.songs.map(songId => {
                      const song = sampleSongs.find(s => s.id === songId);
                      if (!song) return null;
                      return (
                        <div
                          key={songId}
                          className="flex items-center justify-between p-2 rounded bg-black/10"
                        >
                          <span className="text-[#F2FCE2]">{song.title}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveSong(playlist.id, songId);
                            }}
                            className="text-[#F2FCE2]/70 hover:text-[#1EAEDB]"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      );
                    })}
                    {playlist.songs.length === 0 && (
                      <p className="text-[#F2FCE2]/50 text-sm p-2">
                        No songs in this playlist
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
            {playlists.length === 0 && (
              <p className="text-[#F2FCE2]/70 text-center py-4">
                No playlists created yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
