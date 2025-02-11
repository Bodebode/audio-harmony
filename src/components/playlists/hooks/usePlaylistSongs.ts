
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Playlist } from "../types";

export const usePlaylistSongs = () => {
  const [expandedPlaylist, setExpandedPlaylist] = useState<number | null>(null);
  const [playingPlaylist, setPlayingPlaylist] = useState<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const { toast } = useToast();

  const handleRemoveSong = (playlistId: number, songId: number, setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>) => {
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

  const handleReorderSongs = (playlistId: number, dragIndex: number, dropIndex: number, setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>) => {
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

  return {
    expandedPlaylist,
    playingPlaylist,
    draggingIndex,
    setDraggingIndex,
    handleRemoveSong,
    handleReorderSongs,
    togglePlaylist,
    handlePlayPlaylist,
  };
};
