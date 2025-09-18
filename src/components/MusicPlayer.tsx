import { 
  Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, 
  Shuffle, Repeat, Repeat1, Maximize2, Crown, Sliders, Download 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { LyricsDisplay } from "./LyricsDisplay";
import { FullScreenPlayer } from "./FullScreenPlayer";
import { PremiumFeature } from "./premium/PremiumFeature";
import { usePremium } from "@/hooks/usePremium";
import { useGestures } from "@/hooks/useGestures";
import { useAudio } from "@/contexts/AudioContext";
import { formatDuration } from "@/utils/formatDuration";

export const MusicPlayer = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { checkFeatureAccess } = usePremium();

  // Get all audio state from context
  const { 
    isPlaying, 
    currentSong, 
    duration, 
    songProgress, 
    volume, 
    setVolume, 
    handleProgressChange, 
    togglePlay, 
    nextSong, 
    previousSong, 
    isShuffleOn, 
    setIsShuffleOn, 
    repeatMode, 
    setRepeatMode,
    audioRef
  } = useAudio();

  const cycleRepeatMode = () => {
    const modes = ["none", "all", "one"] as const;
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  // Gesture controls for mobile
  const gestureRef = useGestures({
    onSwipeLeft: nextSong,
    onSwipeRight: previousSong,
    onSwipeUp: () => {
      const newVolume = Math.min(100, volume[0] + 10);
      setVolume([newVolume]);
    },
    onSwipeDown: () => {
      const newVolume = Math.max(0, volume[0] - 10);
      setVolume([newVolume]);
    }
  });

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getVolumeIcon = () => {
    const vol = volume[0];
    if (vol === 0) return VolumeX;
    if (vol < 50) return Volume1;
    return Volume2;
  };

  const getRepeatIcon = () => {
    if (repeatMode === "one") return Repeat1;
    return Repeat;
  };

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm border-t">
        <div className="text-center text-muted-foreground">
          No song selected
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        className="fixed bottom-0 left-0 right-0 z-50 p-4"
      >
        <Card className="glass-card bg-gradient-to-r from-[#0A0A0A]/90 to-[#1A1A2E]/90 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              {/* Song Info & Album Art */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div 
                  className="relative group cursor-pointer"
                  onClick={() => setIsFullScreen(true)}
                >
                  <img
                    src={currentSong.artwork}
                    alt={currentSong.title}
                    className="w-12 h-12 rounded-lg object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                    <Maximize2 className="h-4 w-4 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-[#FEF7CD] truncate text-sm">
                      {currentSong.title}
                    </h3>
                    {currentSong.isPremium && <Crown className="h-3 w-3 text-[#1EAEDB] flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-[#F2FCE2]/70 truncate">{currentSong.artist}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="hidden sm:flex items-center gap-2 flex-1 max-w-md">
                <span className="text-xs text-[#F2FCE2]/70 min-w-[32px]">
                  {formatTime((duration * songProgress) / 100)}
                </span>
                <Slider
                  value={[songProgress]}
                  onValueChange={handleProgressChange}
                  max={100}
                  step={1}
                  className="flex-1 h-2"
                />
                <span className="text-xs text-[#F2FCE2]/70 min-w-[32px]">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                {/* Shuffle - Hidden on mobile */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsShuffleOn(!isShuffleOn)}
                  className={`h-8 w-8 p-0 hidden sm:flex ${
                    isShuffleOn ? 'text-[#1EAEDB]' : 'text-[#F2FCE2]/70 hover:text-[#F2FCE2]'
                  }`}
                >
                  <Shuffle className="h-4 w-4" />
                </Button>

                {/* Previous */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={previousSong}
                  className="h-8 w-8 p-0 text-[#F2FCE2]/70 hover:text-[#F2FCE2]"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>

                {/* Play/Pause */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={togglePlay}
                  className="h-10 w-10 p-0 bg-[#1EAEDB]/20 hover:bg-[#1EAEDB]/30 text-[#1EAEDB] rounded-full transition-all duration-300"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>

                {/* Next */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextSong}
                  className="h-8 w-8 p-0 text-[#F2FCE2]/70 hover:text-[#F2FCE2]"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>

                {/* Repeat - Hidden on mobile */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cycleRepeatMode}
                  className={`h-8 w-8 p-0 hidden sm:flex ${
                    repeatMode !== "none" ? 'text-[#1EAEDB]' : 'text-[#F2FCE2]/70 hover:text-[#F2FCE2]'
                  }`}
                >
                  {(() => {
                    const RepeatIcon = getRepeatIcon();
                    return <RepeatIcon className="h-4 w-4" />;
                  })()}
                </Button>

                {/* Volume - Hidden on mobile */}
                <div className="hidden md:flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setVolume(volume[0] === 0 ? [75] : [0])}
                    className="h-8 w-8 p-0 text-[#F2FCE2]/70 hover:text-[#F2FCE2]"
                  >
                    {(() => {
                      const VolumeIcon = getVolumeIcon();
                      return <VolumeIcon className="h-4 w-4" />;
                    })()}
                  </Button>
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="w-20 h-2"
                  />
                </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 text-[#F2FCE2]/70 hover:text-[#F2FCE2] hidden sm:flex"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
              </div>
            </div>

            {/* Mobile Progress Bar */}
            <div className="flex sm:hidden items-center gap-2 mt-3">
              <span className="text-xs text-[#F2FCE2]/70 min-w-[32px]">
                {formatTime((duration * songProgress) / 100)}
              </span>
              <Slider
                value={[songProgress]}
                onValueChange={handleProgressChange}
                max={100}
                step={1}
                className="flex-1 h-1"
              />
              <span className="text-xs text-[#F2FCE2]/70 min-w-[32px]">
                {formatTime(duration)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Full Screen Player */}
      <FullScreenPlayer
        isOpen={isFullScreen}
        onClose={() => setIsFullScreen(false)}
        currentSong={currentSong}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        volume={volume}
        onVolumeChange={setVolume}
        progress={songProgress}
        onProgressChange={(value) => handleProgressChange([value])}
        onNext={nextSong}
        onPrevious={previousSong}
      />
    </>
  );
};