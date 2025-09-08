import { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export const MiniAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState([0]);
  const [visualizerBars, setVisualizerBars] = useState<number[]>([]);

  // Generate visualizer bars
  useEffect(() => {
    const generateBars = () => {
      const bars = Array.from({ length: 20 }, () => Math.random() * 100);
      setVisualizerBars(bars);
    };

    generateBars();
    
    if (isPlaying) {
      const interval = setInterval(generateBars, 150);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  // Simulate progress
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newValue = prev[0] + 0.5;
          return newValue >= 100 ? [0] : [newValue];
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isPlaying]);

  return (
    <Card className="glass-card gradient-mesh-2 relative overflow-hidden">
      <div className="absolute inset-0 gradient-shimmer opacity-30 animate-gentle-pulse pointer-events-none" />
      
      <CardContent className="p-4 relative z-10">
        {/* Song Info */}
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold text-[#FEF7CD]">Now Playing</h3>
          <p className="text-sm text-[#F2FCE2]/80">Alkebulan - Track 1</p>
        </div>

        {/* Visualizer */}
        <div className="flex items-end justify-center gap-1 h-16 mb-4">
          {visualizerBars.map((height, index) => (
            <div
              key={index}
              className="w-2 bg-gradient-to-t from-[#1EAEDB] to-[#FEF7CD] rounded-full transition-all duration-150"
              style={{ 
                height: isPlaying ? `${Math.max(height, 10)}%` : '10%',
                opacity: isPlaying ? 0.8 : 0.3
              }}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <Slider
            value={progress}
            onValueChange={setProgress}
            max={100}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[#F2FCE2]/60 mt-1">
            <span>{Math.floor((progress[0] / 100) * 245)}s</span>
            <span>3:45</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[#F2FCE2] hover:text-[#1EAEDB] hover:bg-[#1EAEDB]/20"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`h-12 w-12 rounded-full transition-all duration-300 ${
              isPlaying 
                ? 'text-[#1EAEDB] bg-[#1EAEDB]/30 shadow-[0_0_20px_rgba(30,174,219,0.3)]' 
                : 'text-[#FEF7CD] hover:text-[#1EAEDB] hover:bg-[#1EAEDB]/20'
            }`}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[#F2FCE2] hover:text-[#1EAEDB] hover:bg-[#1EAEDB]/20"
          >
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};