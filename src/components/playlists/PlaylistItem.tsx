
import { Play, Pencil, Trash2, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PlaylistSongs } from "./PlaylistSongs";

type Song = {
  id: number;
  title: string;
  duration: string;
};

type Playlist = {
  id: number;
  name: string;
  songs: number[];
};

type PlaylistItemProps = {
  playlist: Playlist;
  editingPlaylist: number | null;
  editName: string;
  expandedPlaylist: number | null;
  playingPlaylist: number | null;
  draggingIndex: number | null;
  sampleSongs: Song[];
  handleStartRename: (playlist: Playlist) => void;
  handleSaveRename: (playlistId: number) => void;
  setEditName: (name: string) => void;
  togglePlaylist: (playlistId: number) => void;
  handlePlayPlaylist: (playlist: Playlist) => void;
  handleDeletePlaylist: (playlistId: number) => void;
  handleRemoveSong: (playlistId: number, songId: number) => void;
  handleReorderSongs: (playlistId: number, dragIndex: number, dropIndex: number) => void;
  setDraggingIndex: (index: number | null) => void;
};

export const PlaylistItem = ({
  playlist,
  editingPlaylist,
  editName,
  expandedPlaylist,
  playingPlaylist,
  draggingIndex,
  sampleSongs,
  handleStartRename,
  handleSaveRename,
  setEditName,
  togglePlaylist,
  handlePlayPlaylist,
  handleDeletePlaylist,
  handleRemoveSong,
  handleReorderSongs,
  setDraggingIndex,
}: PlaylistItemProps) => {
  return (
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
        <PlaylistSongs
          songs={playlist.songs}
          sampleSongs={sampleSongs}
          draggingIndex={draggingIndex}
          playlistId={playlist.id}
          handleRemoveSong={handleRemoveSong}
          handleReorderSongs={handleReorderSongs}
          setDraggingIndex={setDraggingIndex}
        />
      )}
    </div>
  );
};
