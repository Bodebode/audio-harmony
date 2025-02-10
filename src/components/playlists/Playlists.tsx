
import { Card, CardContent } from "@/components/ui/card";
import { PlaylistHeader } from "./PlaylistHeader";
import { PlaylistItem } from "./PlaylistItem";
import { usePlaylistState } from "./usePlaylistState";
import { Song } from "./types";

const sampleSongs: Song[] = [
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
  const playlistState = usePlaylistState();
  const {
    playlists,
    newPlaylistName,
    newPlaylistDescription,
    newPlaylistTags,
    expandedPlaylist,
    editingPlaylist,
    editName,
    playingPlaylist,
    draggingIndex,
    newComment,
    setNewPlaylistName,
    setNewPlaylistDescription,
    setNewPlaylistTags,
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
    setDraggingIndex,
    setNewComment
  } = playlistState;

  return (
    <section id="playlists" className="p-6">
      <Card className="bg-black/40 backdrop-blur-lg border-[#1EAEDB]/10">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-[#FEF7CD] mb-4">Playlists</h2>
          
          <div className="space-y-4 mb-6">
            <PlaylistHeader
              newPlaylistName={newPlaylistName}
              setNewPlaylistName={setNewPlaylistName}
              newPlaylistDescription={newPlaylistDescription}
              setNewPlaylistDescription={setNewPlaylistDescription}
              newPlaylistTags={newPlaylistTags}
              setNewPlaylistTags={setNewPlaylistTags}
              handleCreatePlaylist={handleCreatePlaylist}
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
