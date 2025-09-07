import { useState } from "react";
import { PlayCircle, Pause, SkipForward, SkipBack, Shuffle, Repeat, Volume2, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";

const queueSongs = [
  {
    id: 1,
    title: "Midnight Dreams",
    artist: "Bode Nathaniel",
    duration: "3:45",
    isPlaying: true
  },
  {
    id: 2,
    title: "Ocean Waves", 
    artist: "Bode Nathaniel",
    duration: "4:20",
    isPlaying: false
  },
  {
    id: 3,
    title: "Sunset Boulevard",
    artist: "Bode Nathaniel", 
    duration: "3:15",
    isPlaying: false
  },
  {
    id: 4,
    title: "City Lights",
    artist: "Bode Nathaniel",
    duration: "3:50",
    isPlaying: false
  },
  {
    id: 5,
    title: "Morning Coffee",
    artist: "Bode Nathaniel",
    duration: "4:10",
    isPlaying: false
  }
];

export const QueueSidebar = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState([75]);
  const [currentSong] = useState(queueSongs[0]);

  return (
    <div className="w-80 bg-background/95 backdrop-blur-lg border-l border-border/50 flex flex-col">
      {/* Now Playing Section */}
      <Card className="m-4 bg-background/50 backdrop-blur-sm border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Now Playing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Album Art */}
          <div className="w-full aspect-square bg-primary/20 rounded-lg flex items-center justify-center">
            <PlayCircle className="h-16 w-16 text-primary" />
          </div>
          
          {/* Song Info */}
          <div className="text-center space-y-1">
            <h3 className="font-semibold text-foreground truncate">{currentSong.title}</h3>
            <p className="text-sm text-muted-foreground truncate">{currentSong.artist}</p>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <Slider
              value={[45]}
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1:23</span>
              <span>{currentSong.duration}</span>
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button 
              variant="default" 
              size="icon" 
              className="h-10 w-10"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <PlayCircle className="h-5 w-5" />
              )}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Repeat className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Volume */}
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={1}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>
      
      <Separator className="mx-4" />
      
      {/* Queue Section */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 pb-2">
          <h3 className="text-lg font-semibold text-foreground">Up Next</h3>
        </div>
        
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-2 pb-4">
            {queueSongs.slice(1).map((song, index) => (
              <div
                key={song.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-background/50 transition-colors cursor-pointer group"
              >
                <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
                  <PlayCircle className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground text-sm truncate">{song.title}</h4>
                  <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-muted-foreground">{song.duration}</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};