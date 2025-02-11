
import { useState } from "react";
import { Playlist } from "./types";
import { usePlaylistCreate } from "./hooks/usePlaylistCreate";
import { usePlaylistSocial } from "./hooks/usePlaylistSocial";
import { usePlaylistManagement } from "./hooks/usePlaylistManagement";
import { usePlaylistSongs } from "./hooks/usePlaylistSongs";

export const usePlaylistState = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const {
    newPlaylistName,
    setNewPlaylistName,
    newPlaylistDescription,
    setNewPlaylistDescription,
    newPlaylistTags,
    setNewPlaylistTags,
    handleCreatePlaylist: create
  } = usePlaylistCreate();

  const {
    newComment,
    setNewComment,
    handleLikePlaylist: like,
    handleAddComment: comment,
    handleShareOnSocial
  } = usePlaylistSocial();

  const {
    editingPlaylist,
    editName,
    setEditName,
    handleDeletePlaylist: deletePlaylist,
    handleStartRename,
    handleSaveRename: saveRename
  } = usePlaylistManagement();

  const {
    expandedPlaylist,
    playingPlaylist,
    draggingIndex,
    setDraggingIndex,
    handleRemoveSong: removeSong,
    handleReorderSongs: reorderSongs,
    togglePlaylist,
    handlePlayPlaylist
  } = usePlaylistSongs();

  // Wrapper functions to provide setPlaylists
  const handleCreatePlaylist = () => create(setPlaylists);
  const handleLikePlaylist = (playlistId: number) => like(playlistId, setPlaylists);
  const handleAddComment = (playlistId: number) => comment(playlistId, setPlaylists);
  const handleDeletePlaylist = (playlistId: number) => deletePlaylist(playlistId, setPlaylists);
  const handleSaveRename = (playlistId: number) => saveRename(playlistId, setPlaylists);
  const handleRemoveSong = (playlistId: number, songId: number) => removeSong(playlistId, songId, setPlaylists);
  const handleReorderSongs = (playlistId: number, dragIndex: number, dropIndex: number) => 
    reorderSongs(playlistId, dragIndex, dropIndex, setPlaylists);

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
