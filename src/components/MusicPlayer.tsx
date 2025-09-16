
import { 
  Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, 
  Shuffle, Repeat, Repeat1, Maximize2, Crown, Sliders, Download, Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useState, useCallback, useEffect } from "react";
import { LyricsDisplay } from "./LyricsDisplay";
import { FullScreenPlayer } from "./FullScreenPlayer";
import { PremiumFeature } from "./premium/PremiumFeature";
import { usePremium } from "@/hooks/usePremium";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useLikedSongs } from "@/hooks/useLikedSongs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useGestures } from "@/hooks/useGestures";

interface Track {
  id: string;
  title: string;
  audio_file_url?: string;
  duration_sec?: number;
  explicit?: boolean;
  lyrics?: string;
  release?: {
    title: string;
    cover_url?: string;
  };
}

type RepeatMode = "none" | "all" | "one";

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentPlaylist, setCurrentPlaylist] = useState<string[] | null>(null);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("none");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const { checkFeatureAccess, limits } = usePremium();
  const { track: trackAnalytics } = useAnalytics();
  const { likedSongs, toggleLikeSong, isLiked } = useLikedSongs();
  
  // Track skips for free users
  const [skipsThisHour, setSkipsThisHour] = useState(0);
  const [lastSkipReset, setLastSkipReset] = useState(Date.now());

  // Fetch available tracks
  const { data: tracks = [], isLoading } = useQuery({
    queryKey: ['available-tracks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tracks')
        .select(`
          *,
          release:releases(title, cover_url)
        `)
        .eq('status', 'ready')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Track[];
    },
  });

  const currentTrack = tracks[currentTrackIndex];

  // Handle audio playback
  useEffect(() => {
    if (!currentTrack?.audio_file_url) return;

    const audio = new Audio(currentTrack.audio_file_url);
    
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      trackAnalytics({
        name: 'play_completed',
        properties: {
          track_id: currentTrack.id,
          pct_played: 100,
        },
      });
      handleNext();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    if (isPlaying) {
      audio.play();
      trackAnalytics({
        name: 'play_started',
        properties: {
          track_id: currentTrack.id,
          position_ms: Math.floor(currentTime * 1000),
        },
      });
    } else {
      audio.pause();
    }

    audio.volume = volume[0] / 100;

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [currentTrack, isPlaying, volume, trackAnalytics, currentTime]);

  const togglePlay = () => {
    if (!currentTrack?.audio_file_url) return;
    setIsPlaying(!isPlaying);
  };

  const handleProgressChange = (value: number) => {
    setCurrentTime(value);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLike = () => {
    if (!currentTrack) return;
    const trackIdNumber = parseInt(currentTrack.id);
    toggleLikeSong(trackIdNumber);
    trackAnalytics({
      name: 'like_action',
      properties: {
        track_id: currentTrack.id,
        action: isLiked(trackIdNumber) ? 'unlike' : 'like',
      },
    });
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

  const getNextTrackIndex = useCallback(() => {
    if (repeatMode === "one") return currentTrackIndex;
    
    if (!currentPlaylist) {
      if (currentTrackIndex === tracks.length - 1) {
        return repeatMode === "all" ? 0 : currentTrackIndex;
      }
      return currentTrackIndex + 1;
    }
    
    const currentIndex = currentPlaylist.indexOf(currentTrack?.id || '');
    if (currentIndex < currentPlaylist.length - 1) {
      const nextTrackId = currentPlaylist[currentIndex + 1];
      const nextTrackIndex = tracks.findIndex(track => track.id === nextTrackId);
      return nextTrackIndex !== -1 ? nextTrackIndex : currentTrackIndex;
    }
    
    return repeatMode === "all" ? 0 : currentTrackIndex;
  }, [currentTrackIndex, currentPlaylist, currentTrack?.id, repeatMode, tracks]);

  const handlePrevious = () => {
    if (!currentPlaylist) {
      setCurrentTrackIndex((prev) => (prev === 0 ? tracks.length - 1 : prev - 1));
      return;
    }
    
    const currentIndex = currentPlaylist.indexOf(currentTrack?.id || '');
    if (currentIndex > 0) {
      const prevTrackId = currentPlaylist[currentIndex - 1];
      const prevTrackIndex = tracks.findIndex(track => track.id === prevTrackId);
      setCurrentTrackIndex(prevTrackIndex !== -1 ? prevTrackIndex : 0);
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
      const availableTracks = currentPlaylist.filter(id => id !== currentTrack?.id);
      if (availableTracks.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableTracks.length);
        const nextTrackId = availableTracks[randomIndex];
        const nextTrackIndex = tracks.findIndex(track => track.id === nextTrackId);
        if (nextTrackIndex !== -1) {
          setCurrentTrackIndex(nextTrackIndex);
          return;
        }
      }
    }
    
    const nextIndex = getNextTrackIndex();
    setCurrentTrackIndex(nextIndex);
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
    playPlaylist: (trackIds: string[]) => {
      if (trackIds.length === 0) return;
      const firstTrackId = trackIds[0];
      const firstTrackIndex = tracks.findIndex(track => track.id === firstTrackId);
      if (firstTrackIndex !== -1) {
        setCurrentTrackIndex(firstTrackIndex);
        setCurrentPlaylist(trackIds);
        setIsPlaying(true);
      }
    }
  };

  if (isLoading) {
    return (
      <section id="now-playing" className="p-4">
        <Card className="bg-black/40 backdrop-blur-lg border-[#1EAEDB]/10">
          <CardContent className="p-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-[#F2FCE2]">Loading tracks...</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!currentTrack) {
    return (
      <section id="now-playing" className="p-4">
        <Card className="bg-black/40 backdrop-blur-lg border-[#1EAEDB]/10">
          <CardContent className="p-4 text-center">
            <Play className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-[#F2FCE2]">No tracks available</p>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <>
      <section id="now-playing" className="p-4">
        <Card className="bg-black/40 backdrop-blur-lg border-[#1EAEDB]/10 animate-fade-in hover:border-[#1EAEDB]/20 transition-all duration-300">
          <CardContent className="p-4">
            <div 
              className="flex flex-col gap-4 md:grid md:grid-cols-2 md:gap-6"
              ref={gestureRef as React.RefObject<HTMLDivElement>}
            >
              <div className="flex flex-col justify-center">
                <div className="w-full max-w-48 mx-auto md:max-w-none aspect-square bg-[#222222] rounded-lg shadow-2xl overflow-hidden group relative">
                  <img 
                    src={currentTrack.release?.cover_url || "/lovable-uploads/74cb0a2d-58c7-4be3-a188-27a043b76a3d.png"}
                    alt={`Album Art - ${currentTrack.release?.title || 'Unknown Album'}`}
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
                <p className="text-[#F2FCE2] text-lg mb-1 flex items-center gap-2">
                  {currentTrack.title}
                  {currentTrack.explicit && (
                    <span className="px-1 py-0.5 bg-red-600 text-white text-xs rounded">E</span>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLike}
                    className={`text-[#F2FCE2] hover:text-red-500 p-1 h-6 w-6 ${
                      isLiked(parseInt(currentTrack.id)) ? 'text-red-500' : ''
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isLiked(parseInt(currentTrack.id)) ? 'fill-current' : ''}`} />
                  </Button>
                </p>
                <p className="text-[#F2FCE2]/80 text-base">{currentTrack.release?.title || 'Unknown Album'}</p>
              </div>
              <div className="space-y-2">
                {currentTrack.lyrics && (
                  <div className="mb-4 p-3 bg-muted/30 rounded-lg">
                    <h4 className="text-sm font-medium text-[#FEF7CD] mb-2">Lyrics</h4>
                    <div className="text-xs text-[#F2FCE2]/80 whitespace-pre-line max-h-20 overflow-y-auto">
                      {currentTrack.lyrics}
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                 <div className="space-y-2">
                     <Slider
                       value={[currentTime]}
                       onValueChange={(vals) => handleProgressChange(vals[0])}
                       max={duration}
                       step={0.5}
                       className="w-full [&>span[role=slider]]:h-6 [&>span[role=slider]]:w-6 md:[&>span[role=slider]]:h-4 md:[&>span[role=slider]]:w-4"
                     />
                     <div className="flex justify-between text-sm text-[#F2FCE2]">
                       <span>{formatTime(currentTime)}</span>
                       <span>{formatTime(duration)}</span>
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
        onProgress={currentTime}
        onProgressChange={handleProgressChange}
        onNext={handleNext}
        onPrevious={handlePrevious}
        currentSong={{
          id: parseInt(currentTrack.id),
          title: currentTrack.title,
          artist: currentTrack.release?.title || 'Unknown Album',
          artwork: currentTrack.release?.cover_url || "/lovable-uploads/74cb0a2d-58c7-4be3-a188-27a043b76a3d.png",
          duration: formatTime(duration)
        }}
      />
    </>
  );
};

