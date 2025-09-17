import { PlayCircle, Heart, ChevronDown, Play, Pause, Crown, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SkeletonGrid } from "@/components/ui/skeleton-loader";
import { useState, useEffect } from "react";
import { useLikedSongs } from "@/hooks/useLikedSongs";
import { usePremium } from "@/hooks/usePremium";
import { useAuth } from "@/hooks/useAuth";
import { PremiumFeature } from "./premium/PremiumFeature";
import { useTracks } from "@/hooks/useTracks";


export const Library = () => {
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAlbumPlaying, setIsAlbumPlaying] = useState(false);
  const { toggleLikeSong, isLiked } = useLikedSongs();
  const { checkFeatureAccess, limits } = usePremium();
  const { isGuest } = useAuth();

  // Fetch tracks using unified hook
  const { data: tracks = [], isLoading } = useTracks();

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlaySong = (trackId: string) => {
    // If there's a global music player control, use it
    if ((window as any).musicPlayerControls?.playPlaylist) {
      (window as any).musicPlayerControls.playPlaylist([trackId]);
    }
    setPlayingSongId(trackId);
  };

  const handleAlbumPlayPause = () => {
    setIsAlbumPlaying(!isAlbumPlaying);
    if (!isAlbumPlaying && tracks.length > 0) {
      // Play the first track
      const trackIds = tracks.map(track => track.id);
      if ((window as any).musicPlayerControls?.playPlaylist) {
        (window as any).musicPlayerControls.playPlaylist(trackIds);
      }
      setPlayingSongId(tracks[0].id);
    } else {
      setPlayingSongId(null);
    }
  };

  return (
    <section id="library" className="p-6">
      <Card className="glass-card gradient-mesh-1 relative overflow-hidden">
        <div className="absolute inset-0 gradient-aurora opacity-50 animate-gentle-pulse pointer-events-none" />
        
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-[#FEF7CD] relative flex items-center gap-2">
                Alkebulan
                <div className="absolute -inset-1 bg-gradient-to-r from-[#1EAEDB]/20 via-transparent to-[#FEF7CD]/10 blur-sm -z-10 opacity-50" />
              </h2>
              <div className="flex items-center gap-1 text-xs">
                {/* Audio quality indicator removed */}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleAlbumPlayPause}
                disabled={isLoading}
                className={`h-8 w-8 rounded-full transition-all duration-300 backdrop-blur-sm ${
                  isAlbumPlaying 
                    ? 'text-[#1EAEDB] bg-[#1EAEDB]/30 shadow-[0_0_20px_rgba(30,174,219,0.3)]' 
                    : 'text-[#FEF7CD] hover:text-[#1EAEDB] hover:bg-[#1EAEDB]/20 hover:shadow-[0_0_15px_rgba(30,174,219,0.2)]'
                }`}
              >
                {isAlbumPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 text-[#FEF7CD] hover:text-[#1EAEDB] hover:bg-[#1EAEDB]/20 transition-all duration-300 backdrop-blur-sm"
            >
              <ChevronDown 
                className={`h-5 w-5 transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : 'rotate-0'
                }`} 
              />
            </Button>
          </div>
          
          {isExpanded && (
            <div className="space-y-2 animate-accordion-down">
              {isLoading ? (
                <SkeletonGrid count={8} className="animate-fade-in" />
              ) : tracks.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-[#F2FCE2]/60 mb-2">No tracks available</div>
                  <div className="text-[#F2FCE2]/40 text-sm">
                    Tracks will appear here once they're published by an admin
                  </div>
                </div>
              ) : (
                <>
                  {tracks.map((track, index) => (
                  <div
                    key={track.id}
                    className="glass-item group flex items-center justify-between p-3 rounded-lg cursor-pointer transform animate-fade-in gradient-mesh-2"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="absolute inset-0 gradient-shimmer opacity-0 group-hover:opacity-100 rounded-lg" />
                    
                    <div className="flex items-center gap-3 relative z-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 rounded-full transition-all duration-300 backdrop-blur-sm ${
                          playingSongId === track.id 
                            ? 'text-[#1EAEDB] bg-[#1EAEDB]/30 animate-pulse shadow-[0_0_15px_rgba(30,174,219,0.4)]' 
                            : 'text-[#F2FCE2] hover:text-[#1EAEDB] hover:bg-[#1EAEDB]/20 opacity-0 group-hover:opacity-100'
                        }`}
                        onClick={() => handlePlaySong(track.id)}
                      >
                        <PlayCircle className="h-4 w-4" />
                      </Button>
                      <span className={`flex items-center gap-2 transition-all duration-300 ${
                        playingSongId === track.id ? 'text-[#1EAEDB] font-medium' : 'text-[#F2FCE2] group-hover:text-[#FEF7CD]'
                      }`}>
                        {track.title}
                        {track.explicit && (
                          <span className="px-1 py-0.5 bg-red-600 text-white text-xs rounded">E</span>
                        )}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 relative z-10">
                      <span className="text-[#F2FCE2]/60 group-hover:text-[#F2FCE2]/90 transition-colors duration-300 text-sm font-mono">
                        {formatDuration(track.duration_sec)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 transition-all duration-300 opacity-30 group-hover:opacity-100 backdrop-blur-sm ${
                          isLiked(track.id) 
                            ? 'text-red-500 hover:text-red-600 !opacity-100' 
                            : 'text-[#F2FCE2] hover:text-red-500'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLikeSong(track.id);
                        }}
                      >
                        <Heart 
                          className={`h-4 w-4 ${isLiked(track.id) ? 'fill-current' : ''}`}
                        />
                      </Button>
                    </div>
                  </div>
                  ))}

                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};