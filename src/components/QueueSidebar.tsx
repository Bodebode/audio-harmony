import { useState } from "react";
import { Play, Pause, MoreHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface QueueSong {
  id: string;
  title: string;
  artist: string;
  duration: string;
  isPlaying?: boolean;
}

const mockQueue: QueueSong[] = [
  { id: "1", title: "Midnight Dreams", artist: "Bode Nathaniel", duration: "3:45", isPlaying: true },
  { id: "2", title: "Ocean Waves", artist: "Bode Nathaniel", duration: "4:12" },
  { id: "3", title: "Sunset Boulevard", artist: "Bode Nathaniel", duration: "3:28" },
  { id: "4", title: "Electric Nights", artist: "Bode Nathaniel", duration: "4:01" },
  { id: "5", title: "Acoustic Morning", artist: "Bode Nathaniel", duration: "2:58" },
];

interface QueueSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QueueSidebar = ({ isOpen, onClose }: QueueSidebarProps) => {
  const [queue, setQueue] = useState(mockQueue);
  const [currentSong, setCurrentSong] = useState(queue[0]);

  const handlePlaySong = (song: QueueSong) => {
    const updatedQueue = queue.map(s => ({
      ...s,
      isPlaying: s.id === song.id
    }));
    setQueue(updatedQueue);
    setCurrentSong(song);
  };

  const handleRemoveFromQueue = (songId: string) => {
    setQueue(prev => prev.filter(s => s.id !== songId));
  };

  if (!isOpen) return null;

  return (
    <div className="w-80 bg-background border-l border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-semibold">Queue</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Now Playing */}
      <div className="p-4 border-b border-border">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Now Playing</h3>
        {currentSong && (
          <Card className="p-3 bg-accent/50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/20 rounded-md flex items-center justify-center">
                <Play className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium truncate">{currentSong.title}</h4>
                <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
              </div>
              <span className="text-xs text-muted-foreground">{currentSong.duration}</span>
            </div>
          </Card>
        )}
      </div>

      {/* Queue List */}
      <div className="flex-1 overflow-hidden">
        <div className="p-4 pb-2">
          <h3 className="text-sm font-medium text-muted-foreground">Next Up</h3>
        </div>
        <ScrollArea className="h-full px-4 pb-4">
          <div className="space-y-2">
            {queue.filter(song => !song.isPlaying).map((song, index) => (
              <div
                key={song.id}
                className="group flex items-center gap-3 p-2 hover:bg-accent/50 rounded-lg cursor-pointer transition-colors"
                onClick={() => handlePlaySong(song)}
              >
                <div className="w-8 h-8 bg-muted rounded flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Play className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="text-xs text-muted-foreground group-hover:hidden">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{song.title}</h4>
                  <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                </div>
                <span className="text-xs text-muted-foreground">{song.duration}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromQueue(song.id);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Clear Queue */}
      <div className="p-4 border-t border-border">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => setQueue(queue.filter(s => s.isPlaying))}
        >
          Clear Queue
        </Button>
      </div>
    </div>
  );
};