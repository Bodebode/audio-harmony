import { Plus, X, Play, GripVertical, Pencil, Trash2, Loader } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [editingPlaylist, setEditingPlaylist] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [playingPlaylist, setPlayingPlaylist] = useState<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();

  // Detect mobile devices to disable drag functionality
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(isMobileDevice || isTouchDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const handleDeletePlaylist = (playlistId: number) => {
    setPlaylists(playlists.filter(playlist => playlist.id !== playlistId));
    toast({
      title: "Success",
      description: "Playlist deleted successfully",
    });
  };

  const handleStartRename = (playlist: Playlist) => {
    setEditingPlaylist(playlist.id);
    setEditName(playlist.name);
  };

  const handleSaveRename = (playlistId: number) => {
    if (!editName.trim()) {
      toast({
        title: "Error",
        description: "Playlist name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setPlaylists(playlists.map(playlist => 
      playlist.id === playlistId 
        ? { ...playlist, name: editName.trim() }
        : playlist
    ));
    setEditingPlaylist(null);
    setEditName("");
    toast({
      title: "Success",
      description: "Playlist renamed successfully",
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

  const handleReorderSongs = (playlistId: number, dragIndex: number, dropIndex: number) => {
    setPlaylists(currentPlaylists =>
      currentPlaylists.map(playlist => {
        if (playlist.id === playlistId) {
          const newSongs = [...playlist.songs];
          const [draggedSong] = newSongs.splice(dragIndex, 1);
          newSongs.splice(dropIndex, 0, draggedSong);
          return { ...playlist, songs: newSongs };
        }
        return playlist;
      })
    );
  };

  const togglePlaylist = (playlistId: number) => {
    setExpandedPlaylist(current => current === playlistId ? null : playlistId);
  };

  const handlePlayPlaylist = async (playlist: Playlist) => {
    if (playlist.songs.length === 0) {
      toast({
        title: "Error",
        description: "This playlist is empty",
        variant: "destructive",
      });
      return;
    }

    setPlayingPlaylist(playlist.id);
    
    if ((window as any).musicPlayerControls) {
      await (window as any).musicPlayerControls.playPlaylist(playlist.songs);
      toast({
        title: "Success",
        description: `Playing playlist: ${playlist.name}`,
      });
    }
    
    setPlayingPlaylist(null);
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
              className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/80 text-white transition-colors duration-200"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create
            </Button>
          </div>

          <div className="space-y-2">
            {playlists.map((playlist) => (
              <div key={playlist.id} className="space-y-2 animate-fade-in">
                <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 hover:bg-[#1EAEDB]/5 transition-all duration-200">
                  <div className="flex items-center gap-3 flex-1">
                    {editingPlaylist === playlist.id ? (
                      <div className="flex gap-2 flex-1">
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="bg-black/20 border-[#1EAEDB]/20 text-[#F2FCE2]"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveRename(playlist.id);
                            }
                          }}
                        />
                        <Button
                          onClick={() => handleSaveRename(playlist.id)}
                          className="bg-[#1EAEDB] hover:bg-[#1EAEDB]/80 transition-colors duration-200"
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span 
                          className="text-[#F2FCE2] cursor-pointer hover:text-[#1EAEDB] transition-colors duration-200"
                          onClick={() => togglePlaylist(playlist.id)}
                        >
                          {playlist.name}
                        </span>
                        <span className="text-[#F2FCE2]/70 text-sm">
                          {playlist.songs.length} songs
                        </span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePlayPlaylist(playlist)}
                            className="text-[#F2FCE2] hover:text-[#1EAEDB] transition-colors duration-200"
                            disabled={playingPlaylist === playlist.id}
                          >
                            {playingPlaylist === playlist.id ? (
                              <Loader className="h-5 w-5 animate-spin" />
                            ) : (
                              <Play className="h-5 w-5" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Play playlist</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleStartRename(playlist)}
                            className="text-[#F2FCE2] hover:text-[#1EAEDB] transition-colors duration-200"
                          >
                            <Pencil className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Rename playlist</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeletePlaylist(playlist.id)}
                            className="text-[#F2FCE2] hover:text-red-500 transition-colors duration-200"
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete playlist</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                {expandedPlaylist === playlist.id && (
                  <div className="ml-4 space-y-1 animate-accordion-down">
                    {playlist.songs.map((songId, index) => {
                      const song = sampleSongs.find(s => s.id === songId);
                      if (!song) return null;
                      return (
                        <div
                          key={songId}
                          className={`flex items-center justify-between p-2 rounded bg-black/10 transition-all duration-200 ${
                            draggingIndex === index ? 'scale-105 shadow-lg bg-[#1EAEDB]/20' : ''
                          } ${isMobile ? 'touch-pan-y' : ''}`}
                          {...(!isMobile && {
                            draggable: true,
                            onDragStart: (e) => {
                              e.dataTransfer.setData('text/plain', index.toString());
                              setDraggingIndex(index);
                            },
                            onDragEnd: () => setDraggingIndex(null),
                            onDragOver: (e) => {
                              e.preventDefault();
                            },
                            onDrop: (e) => {
                              e.preventDefault();
                              const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
                              handleReorderSongs(playlist.id, dragIndex, index);
                              setDraggingIndex(null);
                            }
                          })}
                        >
                          <div className="flex items-center gap-2">
                            {!isMobile && <GripVertical className="h-4 w-4 text-[#F2FCE2]/50 cursor-move" />}
                            <span className="text-[#F2FCE2]">{song.title}</span>
                            <span className="text-[#F2FCE2]/50 text-sm ml-auto mr-2">{song.duration}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveSong(playlist.id, songId)}
                            className="text-[#F2FCE2]/70 hover:text-[#1EAEDB] transition-colors duration-200"
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
