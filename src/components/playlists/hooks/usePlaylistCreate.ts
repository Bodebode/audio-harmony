
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Playlist } from "../types";

export const usePlaylistCreate = () => {
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [newPlaylistTags, setNewPlaylistTags] = useState("");
  const { toast } = useToast();

  const handleCreatePlaylist = (setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>) => {
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
      description: newPlaylistDescription.trim(),
      tags: newPlaylistTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      songs: [],
      shareUrl: `${window.location.origin}/playlist/${Date.now()}`,
      likes: [],
      comments: [],
      collaborators: [],
      createdBy: 'current-user',
    };

    setPlaylists(playlists => [...playlists, newPlaylist]);
    setNewPlaylistName("");
    setNewPlaylistDescription("");
    setNewPlaylistTags("");
    toast({
      title: "Success",
      description: "Playlist created successfully",
    });
  };

  return {
    newPlaylistName,
    setNewPlaylistName,
    newPlaylistDescription,
    setNewPlaylistDescription,
    newPlaylistTags,
    setNewPlaylistTags,
    handleCreatePlaylist,
  };
};
