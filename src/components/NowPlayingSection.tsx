import { 
  Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, 
  Repeat, Repeat1, Heart, ChevronDown, ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";
import { LyricsDisplay } from "./LyricsDisplay";
import { useAudio } from "@/contexts/AudioContext";
import { formatDuration } from "@/utils/formatDuration";
import { useGestures } from "@/hooks/useGestures";
import { useLikedSongs } from "@/hooks/useLikedSongs";
import { useToast } from "@/hooks/use-toast";

export const NowPlayingSection = () => {
  const [showLyrics, setShowLyrics] = useState(false);
  const { toast } = useToast();
  const { isLiked, toggleLikeSong } = useLikedSongs();

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
    repeatMode, 
    setRepeatMode,
    audioRef
  } = useAudio();

  // Auto-retract lyrics when song changes or ends
  useEffect(() => {
    if (currentSong) {
      setShowLyrics(false);
    }
  }, [currentSong?.id]);

  useEffect(() => {
    const audio = audioRef?.current;
    if (audio) {
      const handleEnded = () => setShowLyrics(false);
      audio.addEventListener('ended', handleEnded);
      return () => audio.removeEventListener('ended', handleEnded);
    }
  }, [audioRef]);

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
    onSwipeUp: () => setShowLyrics(true),
    onSwipeDown: () => setShowLyrics(false)
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

  const handleLike = () => {
    if (currentSong) {
      toggleLikeSong(currentSong.id);
      toast({
        title: isLiked(currentSong.id) ? "Removed from liked songs" : "Added to liked songs",
        duration: 2000,
      });
    }
  };

  if (!currentSong) {
    return (
      <section className="p-6">
        <Card className="glass-card bg-gradient-to-br from-[#0A0A0A]/40 to-[#1A1A2E]/40 backdrop-blur-xl border border-white/10">
          <CardContent className="p-8">
            <div className="text-center text-muted-foreground">
              <h2 className="text-2xl font-bold mb-2">Now Playing</h2>
              <p>No song selected</p>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section id="now-playing-section" className="p-6">
      <Card className="glass-card bg-gradient-to-br from-[#0A0A0A]/40 to-[#1A1A2E]/40 backdrop-blur-xl border border-white/10">
        <CardContent className="p-4 md:p-6" ref={gestureRef as React.RefObject<HTMLDivElement>}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Side - Album Art and Song Info */}
            <div className="flex flex-col items-center">
              <div className="relative group mb-6">
                <img
                  src={currentSong.artwork}
                  alt={currentSong.title}
                  className="w-64 h-64 md:w-80 md:h-80 rounded-2xl object-cover shadow-2xl transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </div>
              
              <div className="text-center">
                <h1 className="text-2xl md:text-3xl font-bold text-[#FEF7CD] mb-2">
                  {currentSong.title}
                </h1>
                <p className="text-lg text-[#F2FCE2]/70">{currentSong.artist}</p>
              </div>
            </div>

            {/* Right Side - Controls and Progress */}
            <div className="flex flex-col justify-center space-y-6">
              {/* Progress Bar */}
              <div className="space-y-2">
                <Slider
                  value={[songProgress]}
                  onValueChange={handleProgressChange}
                  max={100}
                  step={1}
                  className="w-full h-3"
                />
                <div className="flex justify-between text-sm text-[#F2FCE2]/70">
                  <span>{formatTime((duration * songProgress) / 100)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Main Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={handleLike}
                  className={`h-12 w-12 p-0 hover:bg-[#1EAEDB]/20 hover:text-[#1EAEDB] ${
                    isLiked(currentSong.id) ? 'text-red-500' : 'text-[#F2FCE2]/70'
                  }`}
                >
                  <Heart className={`h-6 w-6 ${isLiked(currentSong.id) ? 'fill-current' : ''}`} />
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  onClick={previousSong}
                  className="h-12 w-12 p-0 text-[#F2FCE2]/70 hover:bg-[#1EAEDB]/20 hover:text-[#1EAEDB]"
                >
                  <SkipBack className="h-6 w-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  onClick={togglePlay}
                  className="h-16 w-16 p-0 bg-[#1EAEDB]/20 hover:bg-[#1EAEDB]/30 text-[#1EAEDB] rounded-full transition-all duration-300"
                >
                  {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  onClick={nextSong}
                  className="h-12 w-12 p-0 text-[#F2FCE2]/70 hover:bg-[#1EAEDB]/20 hover:text-[#1EAEDB]"
                >
                  <SkipForward className="h-6 w-6" />
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  onClick={cycleRepeatMode}
                  className={`h-12 w-12 p-0 hover:bg-[#1EAEDB]/20 hover:text-[#1EAEDB] ${
                    repeatMode !== "none" ? 'text-[#1EAEDB]' : 'text-[#F2FCE2]/70'
                  }`}
                >
                  {(() => {
                    const RepeatIcon = getRepeatIcon();
                    return <RepeatIcon className="h-6 w-6" />;
                  })()}
                </Button>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-4 justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setVolume(volume[0] === 0 ? [75] : [0])}
                  className="h-10 w-10 p-0 text-[#F2FCE2]/70 hover:bg-[#1EAEDB]/20 hover:text-[#1EAEDB]"
                >
                  {(() => {
                    const VolumeIcon = getVolumeIcon();
                    return <VolumeIcon className="h-5 w-5" />;
                  })()}
                </Button>
                <Slider
                  value={volume}
                  onValueChange={setVolume}
                  max={100}
                  step={1}
                  className="w-32 h-2"
                />
                <span className="text-sm text-[#F2FCE2]/70 min-w-[3ch]">
                  {volume[0]}
                </span>
              </div>

              {/* Lyrics Toggle */}
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  onClick={() => setShowLyrics(!showLyrics)}
                  className="text-[#F2FCE2]/70 hover:bg-[#1EAEDB]/20 hover:text-[#1EAEDB] gap-2"
                >
                  {showLyrics ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {showLyrics ? "Hide Lyrics" : "Show Lyrics"}
                </Button>
              </div>
            </div>
          </div>

          {/* Lyrics Section */}
          {showLyrics && (
            <div className="mt-8 pt-8 border-t border-white/10">
              <LyricsDisplay 
                isPlaying={isPlaying} 
                songId={currentSong.id} 
              />
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};