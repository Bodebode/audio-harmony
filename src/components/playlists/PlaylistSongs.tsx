
import { X, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

type Song = {
  id: number;
  title: string;
  duration: string;
};

type PlaylistSongsProps = {
  songs: number[];
  sampleSongs: Song[];
  draggingIndex: number | null;
  playlistId: number;
  handleRemoveSong: (playlistId: number, songId: number) => void;
  handleReorderSongs: (playlistId: number, dragIndex: number, dropIndex: number) => void;
  setDraggingIndex: (index: number | null) => void;
};

export const PlaylistSongs = ({
  songs,
  sampleSongs,
  draggingIndex,
  playlistId,
  handleRemoveSong,
  handleReorderSongs,
  setDraggingIndex,
}: PlaylistSongsProps) => {
  return (
    <div className="ml-4 space-y-1 animate-accordion-down">
      {songs.map((songId, index) => {
        const song = sampleSongs.find(s => s.id === songId);
        if (!song) return null;
        return (
          <div
            key={songId}
            className={`flex items-center justify-between p-2 rounded bg-black/10 transition-all duration-200 ${
              draggingIndex === index ? 'scale-105 shadow-lg bg-[#1EAEDB]/20' : ''
            }`}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('text/plain', index.toString());
              setDraggingIndex(index);
            }}
            onDragEnd={() => setDraggingIndex(null)}
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
              handleReorderSongs(playlistId, dragIndex, index);
              setDraggingIndex(null);
            }}
          >
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-[#F2FCE2]/50 cursor-move" />
              <span className="text-[#F2FCE2]">{song.title}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleRemoveSong(playlistId, songId)}
              className="text-[#F2FCE2]/70 hover:text-[#1EAEDB] transition-colors duration-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        );
      })}
      {songs.length === 0 && (
        <p className="text-[#F2FCE2]/50 text-sm p-2">
          No songs in this playlist
        </p>
      )}
    </div>
  );
};
