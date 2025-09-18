
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, 
  Shuffle, Repeat, Repeat1, Maximize2, Crown, Sliders, Download 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useState, useCallback, useEffect, useRef } from "react";
import { LyricsDisplay } from "./LyricsDisplay";
import { FullScreenPlayer } from "./FullScreenPlayer";
import { PremiumFeature } from "./premium/PremiumFeature";
import { usePremium } from "@/hooks/usePremium";

import { useGestures } from "@/hooks/useGestures";

const songs = [
  {
    id: 1,
    title: "Love 2",
    artist: "Bode Nathaniel",
    artwork: "/lovable-uploads/74cb0a2d-58c7-4be3-a188-27a043b76a3d.png",
    audioUrl: "/songs/Love-2.mp3",
    duration: "0:00" // Will be updated by audio element
  },
];

type RepeatMode = "none" | "all" | "one";

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [progress, setProgress] = useState([0]);
  const [songProgress, setSongProgress] = useState(0);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentPlaylist, setCurrentPlaylist] = useState<number[] | null>(null);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("none");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [duration, setDuration] = useState(0);
  const { checkFeatureAccess, limits } = usePremium();
  
  // Track skips for free users
  const [skipsThisHour, setSkipsThisHour] = useState(0);
  const [lastSkipReset, setLastSkipReset] = useState(Date.now());

  const audioRef = useRef<HTMLAudioElement>(null);
  const currentSong = songs[currentSongIndex];

  // Initialize audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const currentTime = audio.currentTime;
      const duration = audio.duration;
      if (duration > 0) {
        const progressPercent = (currentTime / duration) * 100;
        setSongProgress(progressPercent);
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play();
      } else {
        handleNext();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentSongIndex, repeatMode]);

  // Handle play/pause state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // Handle volume changes
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume[0] / 100;
    }
  }, [volume]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (value: number) => {
    const audio = audioRef.current;
    if (audio && duration > 0) {
      const newTime = (value / 100) * duration;
      audio.currentTime = newTime;
      setSongProgress(value);
    }
  };

  const toggleShuffle = () => {
    setIsShuffleOn(!isShuffleOn);
  };

  const cycleRepeatMode = () => {
    const modes: RepeatMode[] = ["none", "all", "one"];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
  };

  const getNextSongIndex = useCallback(() => {
    if (repeatMode === "one") return currentSongIndex;
    
    if (!currentPlaylist) {
      if (currentSongIndex === songs.length - 1) {
        return repeatMode === "all" ? 0 : currentSongIndex;
      }
      return currentSongIndex + 1;
    }
    
    const currentIndex = currentPlaylist.indexOf(currentSong.id);
    if (currentIndex < currentPlaylist.length - 1) {
      const nextSongId = currentPlaylist[currentIndex + 1];
      const nextSongIndex = songs.findIndex(song => song.id === nextSongId);
      return nextSongIndex !== -1 ? nextSongIndex : currentSongIndex;
    }
    
    return repeatMode === "all" ? 0 : currentSongIndex;
  }, [currentSongIndex, currentPlaylist, currentSong.id, repeatMode]);

  const handlePrevious = () => {
    if (!currentPlaylist) {
      setCurrentSongIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1));
      return;
    }
    
    const currentIndex = currentPlaylist.indexOf(currentSong.id);
    if (currentIndex > 0) {
      const prevSongId = currentPlaylist[currentIndex - 1];
      const prevSongIndex = songs.findIndex(song => song.id === prevSongId);
      setCurrentSongIndex(prevSongIndex !== -1 ? prevSongIndex : 0);
    }
  };

  const handleNext = () => {
    // Check skip limit for free users
    if (!checkFeatureAccess('unlimitedSkips')) {
      const now = Date.now();
      if (now - lastSkipReset > 3600000) { // 1 hour
        setSkipsThisHour(0);
        setLastSkipReset(now);
      }
      
      if (skipsThisHour >= limits.skipsPerHour) {
        return; // Skip limit reached
      }
      
      setSkipsThisHour(prev => prev + 1);
    }
    
    if (isShuffleOn && currentPlaylist) {
      const availableSongs = currentPlaylist.filter(id => id !== currentSong.id);
      if (availableSongs.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableSongs.length);
        const nextSongId = availableSongs[randomIndex];
        const nextSongIndex = songs.findIndex(song => song.id === nextSongId);
        if (nextSongIndex !== -1) {
          setCurrentSongIndex(nextSongIndex);
          return;
        }
      }
    }
    
    const nextIndex = getNextSongIndex();
    setCurrentSongIndex(nextIndex);
  };

  // Gesture controls for mobile
  const gestureRef = useGestures({
    onSwipeLeft: handleNext,
    onSwipeRight: handlePrevious,
    onSwipeUp: () => {
      const newVolume = Math.min(100, volume[0] + 10);
      setVolume([newVolume]);
    },
    onSwipeDown: () => {
      const newVolume = Math.max(0, volume[0] - 10);
      setVolume([newVolume]);
    },
    threshold: 60,
    velocityThreshold: 0.3
  });

  // Export these methods to be used by other components
  (window as any).musicPlayerControls = {
    playPlaylist: (songIds: number[]) => {
      if (songIds.length === 0) return;
      const firstSongId = songIds[0];
      const firstSongIndex = songs.findIndex(song => song.id === firstSongId);
      if (firstSongIndex !== -1) {
        setCurrentSongIndex(firstSongIndex);
        setCurrentPlaylist(songIds);
        
        setIsPlaying(true);
      }
    }
  };

  return (
    <>
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={currentSong.audioUrl}
        preload="auto"
      />
      
      <section id="now-playing" className="p-4">
        <Card className="bg-black/40 backdrop-blur-lg border-[#1EAEDB]/10 animate-fade-in hover:border-[#1EAEDB]/20 transition-all duration-300">
          <CardContent className="p-4">
            <div 
              className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6"
              ref={gestureRef as React.RefObject<HTMLDivElement>}
            >
              {/* Mobile-first album art - smaller on mobile */}
              <div className="flex flex-col justify-center">
                <div className="w-full max-w-48 mx-auto md:max-w-none aspect-square bg-[#222222] rounded-lg shadow-2xl overflow-hidden group relative">
                  <img 
                    src={currentSong.artwork}
                    alt={`Album Art - ${currentSong.artist}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                    onClick={() => setIsFullScreen(true)}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Fullscreen button overlay - larger touch target */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsFullScreen(true)}
                    className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 h-12 w-12 md:h-10 md:w-10"
                  >
                    <Maximize2 className="h-6 w-6 md:h-5 md:w-5" />
                  </Button>
                </div>
              </div>
              
            <div className="flex flex-col justify-between min-h-0">
              <div>
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-2xl font-bold text-[#FEF7CD]">Now Playing</h2>
                  </div>
                <p className="text-[#F2FCE2] text-lg mb-1">{currentSong.title}</p>
                <p className="text-[#F2FCE2]/80 text-base">{currentSong.artist}</p>
              </div>
              <div className="space-y-2">
                <LyricsDisplay isPlaying={isPlaying} songId={currentSong.id} />
                <div className="space-y-2">
                 <div className="space-y-2">
                     <Slider
                       value={[songProgress]}
                       onValueChange={(vals) => handleProgressChange(vals[0])}
                       max={100}
                       step={0.5}
                       className="w-full [&>span[role=slider]]:h-6 [&>span[role=slider]]:w-6 md:[&>span[role=slider]]:h-4 md:[&>span[role=slider]]:w-4"
                     />
                      <div className="flex justify-between text-sm text-[#F2FCE2]">
                        <span>{Math.floor((songProgress / 100) * duration)}s</span>
                        <span>{Math.floor(duration)}s</span>
                      </div>
                   </div>
                   
                    {/* Mobile-optimized controls with larger touch targets */}
                    <div className="flex justify-center items-center gap-2 sm:gap-4">
                      {/* Secondary controls - smaller on mobile */}
                      <Button
                       variant="ghost"
                       size="icon"
                       className={`text-[#F2FCE2] transition-all duration-200 hover:scale-110 h-11 w-11 md:h-10 md:w-10 ${isShuffleOn ? 'text-[#1EAEDB] animate-pulse' : 'hover:text-[#1EAEDB]'}`}
                       onClick={toggleShuffle}
                     >
                       <Shuffle className="h-5 w-5 md:h-4 md:w-4" />
                     </Button>

                     {/* Primary playback controls - larger touch targets */}
                     <Button
                       variant="ghost"
                       size="icon"
                       className="text-[#F2FCE2] hover:text-[#1EAEDB] transition-all duration-200 hover:scale-110 active:scale-95 h-12 w-12 md:h-11 md:w-11"
                       onClick={handlePrevious}
                     >
                       <SkipBack className="h-7 w-7 md:h-6 md:w-6" />
                     </Button>

                     {/* Play/pause button - largest touch target */}
                     <Button
                       variant="ghost"
                       size="icon"
                       className="text-[#F2FCE2] hover:text-[#1EAEDB] transition-all duration-200 hover:scale-125 active:scale-110 hover:shadow-lg hover:shadow-[#1EAEDB]/20 h-14 w-14 md:h-12 md:w-12"
                       onClick={togglePlay}
                     >
                       {isPlaying ? 
                         <Pause className="h-8 w-8 md:h-7 md:w-7" /> : 
                         <Play className="h-8 w-8 md:h-7 md:w-7" />
                       }
                     </Button>

                     <Button
                       variant="ghost"
                       size="icon"
                       className="text-[#F2FCE2] hover:text-[#1EAEDB] transition-all duration-200 hover:scale-110 active:scale-95 h-12 w-12 md:h-11 md:w-11"
                       onClick={handleNext}
                       disabled={!checkFeatureAccess('unlimitedSkips') && skipsThisHour >= limits.skipsPerHour}
                     >
                       <SkipForward className="h-7 w-7 md:h-6 md:w-6" />
                     </Button>

                     <Button
                       variant="ghost"
                       size="icon"
                       className={`text-[#F2FCE2] transition-all duration-200 hover:scale-110 h-11 w-11 md:h-10 md:w-10 ${
                         repeatMode !== "none" ? 'text-[#1EAEDB] animate-pulse' : 'hover:text-[#1EAEDB]'
                       }`}
                       onClick={cycleRepeatMode}
                     >
                       {repeatMode === "one" ? (
                         <Repeat1 className="h-5 w-5 md:h-4 md:w-4" />
                       ) : (
                         <Repeat className="h-5 w-5 md:h-4 md:w-4" />
                       )}
                     </Button>

                     <Button
                       variant="ghost"
                       size="icon"
                       className="text-[#F2FCE2] hover:text-[#1EAEDB] transition-all duration-200 hover:scale-110 h-11 w-11 md:h-10 md:w-10"
                     >
                       <Download className="h-5 w-5 md:h-4 md:w-4" />
                     </Button>
                  </div>
                   {/* Volume control - mobile-optimized */}
                   <div className="flex items-center gap-3 md:gap-2">
                     <Button
                       variant="ghost"
                       size="icon"
                       className="text-[#F2FCE2] hover:text-[#1EAEDB] transition-all duration-200 hover:scale-110 h-11 w-11 md:h-10 md:w-10"
                     >
                       {volume[0] > 50 ? (
                         <Volume2 className="h-5 w-5 md:h-4 md:w-4" />
                       ) : volume[0] > 0 ? (
                         <Volume1 className="h-5 w-5 md:h-4 md:w-4" />
                       ) : (
                         <VolumeX className="h-5 w-5 md:h-4 md:w-4" />
                       )}
                     </Button>
                     <Slider
                       value={volume}
                       onValueChange={setVolume}
                       max={100}
                       step={1}
                       className="flex-1 max-w-32 md:w-24 [&>span[role=slider]]:h-5 [&>span[role=slider]]:w-5 md:[&>span[role=slider]]:h-4 md:[&>span[role=slider]]:w-4"
                     />
                   </div>
                </div>
              </div>
            </div>
          </div>
          </CardContent>
        </Card>
      </section>

      {/* Full Screen Player */}
      <FullScreenPlayer
        isOpen={isFullScreen}
        onClose={() => setIsFullScreen(false)}
        isPlaying={isPlaying}
        onTogglePlay={togglePlay}
        volume={volume}
        onVolumeChange={setVolume}
        progress={songProgress}
        onProgressChange={handleProgressChange}
        onNext={handleNext}
        onPrevious={handlePrevious}
        currentSong={currentSong}
      />
    </>
  );
};

