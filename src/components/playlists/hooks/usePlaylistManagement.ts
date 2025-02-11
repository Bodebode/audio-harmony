
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Playlist } from "../types";

export const usePlaylistManagement = () => {
  const [editingPlaylist, setEditingPlaylist] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const { toast } = useToast();

  const handleDeletePlaylist = (playlistId: number, setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>) => {
    setPlaylists(playlists => playlists.filter(playlist => playlist.id !== playlistId));
    toast({
      title: "Success",
      description: "Playlist deleted successfully",
    });
  };

  const handleStartRename = (playlist: Playlist) => {
    setEditingPlaylist(playlist.id);
    setEditName(playlist.name);
  };

  const handleSaveRename = (playlistId: number, setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>) => {
    if (!editName.trim()) {
      toast({
        title: "Error",
        description: "Playlist name cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setPlaylists(playlists => 
      playlists.map(playlist => 
        playlist.id === playlistId 
          ? { ...playlist, name: editName.trim() }
          : playlist
      )
    );
    setEditingPlaylist(null);
    setEditName("");
    toast({
      title: "Success",
      description: "Playlist renamed successfully",
    });
  };

  return {
    editingPlaylist,
    editName,
    setEditName,
    handleDeletePlaylist,
    handleStartRename,
    handleSaveRename,
  };
};
