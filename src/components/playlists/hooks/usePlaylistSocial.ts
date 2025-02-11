
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Playlist, Comment } from "../types";

export const usePlaylistSocial = () => {
  const [newComment, setNewComment] = useState("");
  const { toast } = useToast();

  const handleLikePlaylist = (playlistId: number, setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>) => {
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

  const handleAddComment = (playlistId: number, setPlaylists: React.Dispatch<React.SetStateAction<Playlist[]>>) => {
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

  return {
    newComment,
    setNewComment,
    handleLikePlaylist,
    handleAddComment,
    handleShareOnSocial,
  };
};
