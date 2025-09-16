import { PlayCircle, Heart, ChevronDown, Play, Pause, Crown, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SkeletonGrid } from "@/components/ui/skeleton-loader";
import { useState, useEffect } from "react";
import { useLikedSongs } from "@/hooks/useLikedSongs";
import { usePremium } from "@/hooks/usePremium";
import { useAuth } from "@/hooks/useAuth";
import { PremiumFeature } from "./premium/PremiumFeature";
import { UpgradePrompt } from "./premium/UpgradePrompt";

const sampleSongs = [
  { id: 1, title: "Afrobeat Fusion", duration: "3:45" },
  { id: 2, title: "Lagos Nights", duration: "4:12" },
  { id: 3, title: "Ancestral Voices", duration: "3:58" },
  { id: 4, title: "Modern Traditions", duration: "4:23" },
  { id: 5, title: "Unity Dance", duration: "3:41" },
  { id: 6, title: "River Flow", duration: "4:07" },
  { id: 7, title: "Rhythmic Soul", duration: "3:52" },
  { id: 8, title: "Golden Dawn", duration: "4:18" },
  // Premium-only content
  { id: 9, title: "Exclusive Melody", duration: "3:33", isPremium: true },
  { id: 10, title: "VIP Session", duration: "4:55", isPremium: true }
] as Array<{ id: number; title: string; duration: string; isPremium?: boolean }>;

export const Library = () => {
  const [playingSongId, setPlayingSongId] = useState<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAlbumPlaying, setIsAlbumPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toggleLikeSong, isLiked } = useLikedSongs();
  const { checkFeatureAccess, limits } = usePremium();
  const { isGuest } = useAuth();

  // Show all songs in main list, premium users can access all
  const displaySongs = sampleSongs;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handlePlaySong = (songId: number) => {
    const song = sampleSongs.find(s => s.id === songId);
    
    // Check if it's a premium song and user doesn't have access
    if (song?.isPremium && !checkFeatureAccess('premiumContent')) {
      // Show toast message for premium-only content
      const event = new CustomEvent('show-toast', {
        detail: { message: 'Premium users only', type: 'error' }
      });
      window.dispatchEvent(event);
      return;
    }
    
    setPlayingSongId(songId);
  };

  const handleAlbumPlayPause = () => {
    setIsAlbumPlaying(!isAlbumPlaying);
    if (!isAlbumPlaying) {
      setPlayingSongId(sampleSongs[0].id);
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
              ) : (
                <>
                  {displaySongs.map((song, index) => (
                  <div
                    key={song.id}
                    className="glass-item group flex items-center justify-between p-3 rounded-lg cursor-pointer transform animate-fade-in gradient-mesh-2"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="absolute inset-0 gradient-shimmer opacity-0 group-hover:opacity-100 rounded-lg" />
                    
                    <div className="flex items-center gap-3 relative z-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 rounded-full transition-all duration-300 backdrop-blur-sm ${
                          playingSongId === song.id 
                            ? 'text-[#1EAEDB] bg-[#1EAEDB]/30 animate-pulse shadow-[0_0_15px_rgba(30,174,219,0.4)]' 
                            : 'text-[#F2FCE2] hover:text-[#1EAEDB] hover:bg-[#1EAEDB]/20 opacity-0 group-hover:opacity-100'
                        }`}
                        onClick={() => handlePlaySong(song.id)}
                      >
                        {song.isPremium && !checkFeatureAccess('premiumContent') ? (
                          <Lock className="h-4 w-4" />
                        ) : (
                          <PlayCircle className="h-4 w-4" />
                        )}
                      </Button>
                      <span className={`flex items-center gap-2 transition-all duration-300 ${
                        playingSongId === song.id ? 'text-[#1EAEDB] font-medium' : 'text-[#F2FCE2] group-hover:text-[#FEF7CD]'
                      }`}>
                        {song.title}
                        {song.isPremium && !checkFeatureAccess('premiumContent') && (
                          <Crown className="h-3 w-3 text-yellow-500" />
                        )}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 relative z-10">
                      <span className="text-[#F2FCE2]/60 group-hover:text-[#F2FCE2]/90 transition-colors duration-300 text-sm font-mono">
                        {song.duration}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 transition-all duration-300 opacity-30 group-hover:opacity-100 backdrop-blur-sm ${
                          isLiked(song.id) 
                            ? 'text-red-500 hover:text-red-600 !opacity-100' 
                            : 'text-[#F2FCE2] hover:text-red-500'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLikeSong(song.id);
                        }}
                      >
                        <Heart 
                          className={`h-4 w-4 ${isLiked(song.id) ? 'fill-current' : ''}`} 
                        />
                      </Button>
                    </div>
                  </div>
                  ))}

                  {/* Show upgrade prompt for non-premium users (but not guests) */}
                  {!isGuest && !checkFeatureAccess('premiumContent') && (
                    <div className="mt-6">
                      <UpgradePrompt />
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};