
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Playlist, Comment } from "./types";

export const usePlaylistState = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [newPlaylistDescription, setNewPlaylistDescription] = useState("");
  const [newPlaylistTags, setNewPlaylistTags] = useState("");
  const [expandedPlaylist, setExpandedPlaylist] = useState<number | null>(null);
  const [editingPlaylist, setEditingPlaylist] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [playingPlaylist, setPlayingPlaylist] = useState<number | null>(null);
  const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
  const [newComment, setNewComment] = useState("");
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
      description: newPlaylistDescription.trim(),
      tags: newPlaylistTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      songs: [],
      shareUrl: `${window.location.origin}/playlist/${Date.now()}`,
      likes: [],
      comments: [],
      collaborators: [],
      createdBy: 'current-user',
    };

    setPlaylists([...playlists, newPlaylist]);
    setNewPlaylistName("");
    setNewPlaylistDescription("");
    setNewPlaylistTags("");
    toast({
      title: "Success",
      description: "Playlist created successfully",
    });
  };

  const handleLikePlaylist = (playlistId: number) => {
    setPlaylists(currentPlaylists =>
      currentPlaylists.map(playlist => {
        if (playlist.id === playlistId) {
          const userId = 'current-user';
          const hasLiked = playlist.likes.includes(userId);
          
          return {
            ...playlist,
            likes: hasLiked
              ? playlist.likes.filter(id => id !== userId)
              : [...playlist.likes, userId]
          };
        }
        return playlist;
      })
    );

    toast({
      title: "Success",
      description: "Playlist like updated",
    });
  };

  const handleAddComment = (playlistId: number) => {
    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }

    setPlaylists(currentPlaylists =>
      currentPlaylists.map(playlist => {
        if (playlist.id === playlistId) {
          const newCommentObj: Comment = {
            id: Date.now(),
            userId: 'current-user',
            content: newComment.trim(),
            timestamp: new Date(),
          };
          
          return {
            ...playlist,
            comments: [...playlist.comments, newCommentObj]
          };
        }
        return playlist;
      })
    );

    setNewComment("");
    toast({
      title: "Success",
      description: "Comment added successfully",
    });
  };

  const handleShareOnSocial = async (playlist: Playlist) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: playlist.name,
          text: `Check out this playlist: ${playlist.name}`,
          url: playlist.shareUrl,
        });
        toast({
          title: "Success",
          description: "Playlist shared successfully",
        });
      } catch (error) {
        console.error('Error sharing:', error);
        toast({
          title: "Error",
          description: "Failed to share playlist",
          variant: "destructive",
        });
      }
    } else {
      navigator.clipboard.writeText(playlist.shareUrl || window.location.href);
      toast({
        title: "Success",
        description: "Share link copied to clipboard",
      });
    }
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

  return {
    playlists,
    newPlaylistName,
    setNewPlaylistName,
    newPlaylistDescription,
    setNewPlaylistDescription,
    newPlaylistTags,
    setNewPlaylistTags,
    expandedPlaylist,
    editingPlaylist,
    editName,
    playingPlaylist,
    draggingIndex,
    newComment,
    setNewComment,
    handleCreatePlaylist,
    handleLikePlaylist,
    handleAddComment,
    handleShareOnSocial,
    handleDeletePlaylist,
    handleStartRename,
    handleSaveRename,
    handleRemoveSong,
    handleReorderSongs,
    togglePlaylist,
    handlePlayPlaylist,
    setEditName,
    setDraggingIndex
  };
};
