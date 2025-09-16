import { Play, Pause, SkipBack, SkipForward, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { useGestures } from "@/hooks/useGestures";

interface MiniMusicPlayerProps {
  onExpand?: () => void;
}

export const MiniMusicPlayer = ({ onExpand }: MiniMusicPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState([0]);
  const [songProgress, setSongProgress] = useState(0);

  const currentSong = {
    id: 1,
    title: "Afrobeat Fusion",
    artist: "Bode Nathaniel",
    artwork: "/lovable-uploads/74cb0a2d-58c7-4be3-a188-27a043b76a3d.png",
    duration: "3:45"
  };

  // Animate progress bar when playing
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isPlaying) {
      intervalId = setInterval(() => {
        setSongProgress(prev => {
          const newProgress = prev + (100 / (3.75 * 60));
          return newProgress >= 100 ? 0 : newProgress;
        });
      }, 1000);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setSongProgress(0);
    }
  };

  // Gesture controls for mobile
  const gestureRef = useGestures({
    onSwipeUp: () => onExpand?.(),
    onSwipeLeft: () => {}, // Next track
    onSwipeRight: () => {}, // Previous track
    threshold: 60,
    velocityThreshold: 0.3
  });

  return (
    <Card 
      className="fixed bottom-20 left-4 right-4 md:hidden z-40 bg-black/90 backdrop-blur-lg border-white/10 cursor-pointer hover:bg-black/95 transition-all duration-300"
      onClick={onExpand}
    >
      <CardContent className="p-3" ref={gestureRef as React.RefObject<HTMLDivElement>}>
        <div className="flex items-center gap-3">
          {/* Album Art */}
          <div className="w-12 h-12 bg-[#222222] rounded-lg overflow-hidden flex-shrink-0">
            <img 
              src={currentSong.artwork}
              alt={`Album Art - ${currentSong.artist}`}
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Song Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-sm truncate">
              {currentSong.title}
            </h3>
            <p className="text-white/70 text-xs truncate">
              {currentSong.artist}
            </p>
            
            {/* Progress Bar */}
            <div className="mt-1">
              <Slider
                value={[songProgress]}
                max={100}
                step={0.5}
                className="w-full h-1 [&>span[role=slider]]:h-3 [&>span[role=slider]]:w-3"
              />
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="text-white/80 hover:text-white h-10 w-10"
              onClick={(e) => {
                e.stopPropagation();
                // Previous track
              }}
            >
              <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-[#1EAEDB] h-10 w-10"
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
            >
              {isPlaying ? 
                <Pause className="h-5 w-5" /> : 
                <Play className="h-5 w-5" />
              }
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-white/80 hover:text-white h-10 w-10"
              onClick={(e) => {
                e.stopPropagation();
                // Next track
              }}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-white/80 hover:text-white h-8 w-8 ml-1"
              onClick={(e) => {
                e.stopPropagation();
                onExpand?.();
              }}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};