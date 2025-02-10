
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { PlaylistHeader } from "./PlaylistHeader";
import { PlaylistItem } from "./PlaylistItem";

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
          
          <PlaylistHeader
            newPlaylistName={newPlaylistName}
            setNewPlaylistName={setNewPlaylistName}
            handleCreatePlaylist={handleCreatePlaylist}
          />

          <div className="space-y-2">
            {playlists.map((playlist) => (
              <PlaylistItem
                key={playlist.id}
                playlist={playlist}
                editingPlaylist={editingPlaylist}
                editName={editName}
                expandedPlaylist={expandedPlaylist}
                playingPlaylist={playingPlaylist}
                draggingIndex={draggingIndex}
                sampleSongs={sampleSongs}
                handleStartRename={handleStartRename}
                handleSaveRename={handleSaveRename}
                setEditName={setEditName}
                togglePlaylist={togglePlaylist}
                handlePlayPlaylist={handlePlayPlaylist}
                handleDeletePlaylist={handleDeletePlaylist}
                handleRemoveSong={handleRemoveSong}
                handleReorderSongs={handleReorderSongs}
                setDraggingIndex={setDraggingIndex}
              />
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
