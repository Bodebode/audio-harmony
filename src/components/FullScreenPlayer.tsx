import { X, Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, Heart, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

import { LyricsDisplay } from "./LyricsDisplay";
import { useGestures } from "@/hooks/useGestures";
import { useLikedSongs } from "@/hooks/useLikedSongs";
import { useToast } from "@/components/ui/use-toast";

interface FullScreenPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  volume: number[];
  onVolumeChange: (value: number[]) => void;
  progress: number;
  onProgressChange: (value: number) => void;
  onNext: () => void;
  onPrevious: () => void;
  currentSong: {
    id: string;
    title: string;
    artist: string;
    artwork: string;
    duration: string;
  };
}

export const FullScreenPlayer = ({
  isOpen,
  onClose,
  isPlaying,
  onTogglePlay,
  volume,
  onVolumeChange,
  progress,
  onProgressChange,
  onNext,
  onPrevious,
  currentSong
}: FullScreenPlayerProps) => {
  const [showLyrics, setShowLyrics] = useState(true);
  const { likedSongs, toggleLikeSong, isLiked: checkIsLiked } = useLikedSongs();
  const { toast } = useToast();
  
  const isLiked = checkIsLiked(currentSong.id);

  // Gesture controls
  const gestureRef = useGestures({
    onSwipeLeft: onNext,
    onSwipeRight: onPrevious,
    onSwipeUp: () => setShowLyrics(!showLyrics),
    onSwipeDown: onClose,
    threshold: 75,
    velocityThreshold: 0.4
  });

  // Volume gesture control
  const volumeGestureRef = useGestures({
    onSwipeUp: () => {
      const newVolume = Math.min(100, volume[0] + 10);
      onVolumeChange([newVolume]);
    },
    onSwipeDown: () => {
      const newVolume = Math.max(0, volume[0] - 10);
      onVolumeChange([newVolume]);
    },
    threshold: 30,
    velocityThreshold: 0.2
  });

  // Keyboard controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          onTogglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          onPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          onNext();
          break;
        case 'ArrowUp':
          e.preventDefault();
          onVolumeChange([Math.min(100, volume[0] + 5)]);
          break;
        case 'ArrowDown':
          e.preventDefault();
          onVolumeChange([Math.max(0, volume[0] - 5)]);
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        case 'KeyL':
          e.preventDefault();
          setShowLyrics(!showLyrics);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, onTogglePlay, onNext, onPrevious, onClose, volume, onVolumeChange, showLyrics]);

  const handleLike = () => {
    toggleLikeSong(currentSong.id);
    toast({
      title: isLiked ? "Removed from liked songs" : "Added to liked songs",
      duration: 2000,
    });
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-gradient-to-br from-black/95 via-black/90 to-black/95 backdrop-blur-xl animate-fade-in"
      ref={gestureRef as React.RefObject<HTMLDivElement>}
    >
      {/* Background artwork with blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: `url(${currentSong.artwork})`,
          filter: 'blur(20px) saturate(1.2)',
        }}
      />
      
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-6 right-6 z-10 text-white/80 hover:text-white hover:bg-white/10"
      >
        <X className="h-6 w-6" />
      </Button>

      <div className="relative z-10 flex flex-col h-full p-6 md:p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-2">
            Now Playing
          </h1>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto w-full">
          
          {/* Left side - Album art */}
          <div className="lg:w-1/2 flex flex-col items-center">
            <div className="relative group">
              <div className="w-80 h-80 md:w-96 md:h-96 lg:w-[500px] lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={currentSong.artwork}
                  alt={`${currentSong.title} - ${currentSong.artist}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              
              {/* Floating play button overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onTogglePlay}
                  className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 hover:scale-110 transition-all duration-300"
                >
                  {isPlaying ? (
                    <Pause className="h-10 w-10" />
                  ) : (
                    <Play className="h-10 w-10 ml-1" />
                  )}
                </Button>
              </div>
            </div>

            {/* Song info */}
            <div className="text-center mt-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                {currentSong.title}
              </h2>
              <p className="text-lg text-white/70">
                {currentSong.artist}
              </p>
            </div>
          </div>

          {/* Right side - Controls and lyrics */}
          <div className="lg:w-1/2 flex flex-col">
            
            {/* Progress */}
            <div className="mb-8">
              <Slider
                value={[progress]}
                onValueChange={(vals) => onProgressChange(vals[0])}
                max={100}
                step={0.5}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-white/60">
                <span>{Math.floor((progress / 100) * 225)}s</span>
                <span>{currentSong.duration}</span>
              </div>
            </div>

            {/* Main controls */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={onPrevious}
                className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 hover:scale-110"
              >
                <SkipBack className="h-7 w-7" />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onTogglePlay}
                className="w-16 h-16 rounded-full bg-white text-black hover:bg-white/90 hover:scale-110 transition-all duration-300 shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8 ml-1" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={onNext}
                className="text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200 hover:scale-110"
              >
                <SkipForward className="h-7 w-7" />
              </Button>
            </div>

            {/* Secondary controls */}
            <div className="flex items-center justify-center gap-8 mb-8">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLike}
                className={`transition-all duration-200 hover:scale-110 ${
                  isLiked ? 'text-red-500 hover:text-red-400' : 'text-white/60 hover:text-white'
                }`}
              >
                <Heart className={`h-6 w-6 ${isLiked ? 'fill-current' : ''}`} />
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 hover:scale-110"
              >
                <MoreHorizontal className="h-6 w-6" />
              </Button>
            </div>

            {/* Volume control */}
            <div 
              className="flex items-center gap-4 mb-8"
              ref={volumeGestureRef as React.RefObject<HTMLDivElement>}
            >
              <Button
                variant="ghost"
                size="icon"
                className="text-white/60 hover:text-white"
              >
                {volume[0] > 50 ? (
                  <Volume2 className="h-5 w-5" />
                ) : volume[0] > 0 ? (
                  <Volume1 className="h-5 w-5" />
                ) : (
                  <VolumeX className="h-5 w-5" />
                )}
              </Button>
              <Slider
                value={volume}
                onValueChange={onVolumeChange}
                max={100}
                step={1}
                className="flex-1 max-w-32"
              />
            </div>

            {/* Lyrics toggle */}
            <Button
              variant="ghost"
              onClick={() => setShowLyrics(!showLyrics)}
              className="self-center mb-4 text-white/60 hover:text-white hover:bg-white/10"
            >
              {showLyrics ? 'Hide Lyrics' : 'Show Lyrics'}
            </Button>

            {/* Lyrics display */}
            {showLyrics && (
              <div className="flex-1 min-h-0">
                <LyricsDisplay 
                  isPlaying={isPlaying} 
                  songId={currentSong.id}
                />
              </div>
            )}
          </div>
        </div>

        {/* Gesture hints */}
        <div className="text-center text-white/40 text-sm mt-4">
          Swipe left/right for tracks • Swipe up/down for lyrics • Space to play/pause
        </div>
      </div>
    </div>
  );
};