import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { PlaylistHeader } from "./PlaylistHeader";
import { PlaylistItem } from "./PlaylistItem";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Heart, MessageSquare, Users, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Comment = {
  id: number;
  userId: string;
  content: string;
  timestamp: Date;
};

type Collaborator = {
  id: string;
  role: 'editor' | 'viewer';
};

type Playlist = {
  id: number;
  name: string;
  description: string;
  coverImage?: string;
  tags: string[];
  songs: number[];
  shareUrl?: string;
  likes: string[];
  comments: Comment[];
  collaborators: Collaborator[];
  createdBy: string;
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
      createdBy: 'current-user', // In a real app, this would be the actual user ID
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
          const userId = 'current-user'; // In a real app, this would be the actual user ID
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
            userId: 'current-user', // In a real app, this would be the actual user ID
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
      // Fallback for browsers that don't support Web Share API
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

  return (
    <section id="playlists" className="p-6">
      <Card className="bg-black/40 backdrop-blur-lg border-[#1EAEDB]/10">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-[#FEF7CD] mb-4">Playlists</h2>
          
          <div className="space-y-4 mb-6">
            <PlaylistHeader
              newPlaylistName={newPlaylistName}
              setNewPlaylistName={setNewPlaylistName}
              handleCreatePlaylist={handleCreatePlaylist}
            />
            
            <Textarea
              value={newPlaylistDescription}
              onChange={(e) => setNewPlaylistDescription(e.target.value)}
              placeholder="Enter playlist description (optional)"
              className="bg-black/20 border-[#1EAEDB]/20 text-[#F2FCE2] placeholder:text-[#F2FCE2]/50"
            />
            
            <Input
              value={newPlaylistTags}
              onChange={(e) => setNewPlaylistTags(e.target.value)}
              placeholder="Enter tags separated by commas (optional)"
              className="bg-black/20 border-[#1EAEDB]/20 text-[#F2FCE2] placeholder:text-[#F2FCE2]/50"
            />
          </div>

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
                newComment={newComment}
                setNewComment={setNewComment}
                handleStartRename={handleStartRename}
                handleSaveRename={handleSaveRename}
                setEditName={setEditName}
                togglePlaylist={togglePlaylist}
                handlePlayPlaylist={handlePlayPlaylist}
                handleDeletePlaylist={handleDeletePlaylist}
                handleRemoveSong={handleRemoveSong}
                handleReorderSongs={handleReorderSongs}
                setDraggingIndex={setDraggingIndex}
                handleLikePlaylist={handleLikePlaylist}
                handleAddComment={handleAddComment}
                handleShareOnSocial={handleShareOnSocial}
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
