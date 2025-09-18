import { PlayCircle, Heart, ChevronDown, Play, Pause, Crown, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SkeletonGrid } from "@/components/ui/skeleton-loader";
import { useState } from "react";
import { useLikedSongs } from "@/hooks/useLikedSongs";
import { usePremium } from "@/hooks/usePremium";
import { useAuth } from "@/hooks/useAuth";
import { useTracks } from "@/hooks/useTracks";
import { PremiumFeature } from "./premium/PremiumFeature";

export const Library = () => {
  const [playingSongId, setPlayingSongId] = useState<number | string | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isAlbumPlaying, setIsAlbumPlaying] = useState(false);
  const { toggleLikeSong, isLiked } = useLikedSongs();
  const { checkFeatureAccess, limits } = usePremium();
  const { isGuest } = useAuth();
  const { tracks, loading, error } = useTracks();

  // Fallback to sample songs if no tracks loaded
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
  ];

  // Use real tracks if available, otherwise use sample songs
  const displaySongs = tracks.length > 0 ? tracks : sampleSongs;

  if (loading) {
    return <SkeletonGrid />;
  }

  const handlePlaySong = (songId: number | string) => {
    const song = displaySongs.find(s => 
      s.id === songId || 
      ('formattedId' in s && s.formattedId === songId)
    );
    
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
      const firstSong = displaySongs[0];
      const firstId = 'formattedId' in firstSong ? firstSong.formattedId : firstSong.id;
      setPlayingSongId(firstId);
    } else {
      setPlayingSongId(null);
    }
  };

  return (
    <section id="library" className="p-6">
      <Card className="bg-gradient-to-br from-[#222222]/90 to-[#1a1a1a]/90 border-white/10 backdrop-blur-lg shadow-2xl">
        <CardContent className="p-6">
          {!loading && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Music Library</h2>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-[#1EAEDB] transition-colors group"
                    onClick={handleAlbumPlayPause}
                  >
                    {isAlbumPlaying ? (
                      <Pause className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                    ) : (
                      <Play className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                    )}
                    <span className="ml-2">{isAlbumPlaying ? 'Pause All' : 'Play All'}</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-[#1EAEDB] transition-colors"
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                    />
                  </Button>
                </div>
              </div>
              
              {isExpanded && (
                <>
                  <div className="space-y-2">
                    {displaySongs.slice(0, 8).map((song) => {
                      const songId = 'formattedId' in song ? song.formattedId : song.id;
                      const isPlaying = songId === playingSongId;
                      const canPlay = !song.isPremium || checkFeatureAccess('premiumContent');
                      
                      return (
                        <div 
                          key={songId} 
                          className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 group border border-white/5"
                        >
                          <div className="flex items-center gap-3">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="p-2 h-auto text-white hover:text-[#1EAEDB] transition-colors group/play"
                              onClick={() => canPlay ? handlePlaySong(songId) : null}
                              disabled={!canPlay}
                            >
                              {!canPlay ? (
                                <Lock className="h-4 w-4" />
                              ) : isPlaying ? (
                                <Pause 
                                  className={`h-4 w-4 group-hover/play:scale-110 transition-transform duration-200 ${isPlaying ? 'animate-pulse' : ''}`}
                                />
                              ) : (
                                <PlayCircle 
                                  className="h-4 w-4 group-hover/play:scale-110 transition-transform duration-200"
                                />
                              )}
                            </Button>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-white font-medium">{song.title}</span>
                                {song.isPremium && <Crown className="h-3 w-3 text-yellow-500" />}
                              </div>
                              {song.isPremium && !checkFeatureAccess('premiumContent') && (
                                <PremiumFeature feature="premiumContent">
                                  <span className="text-xs text-yellow-500">Premium Only</span>
                                </PremiumFeature>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="text-white/70 text-sm">{song.duration}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={`p-2 h-auto transition-colors ${
                                isLiked(typeof songId === 'string' ? parseInt(songId) : songId) 
                                  ? 'text-red-500 hover:text-red-400' 
                                  : 'text-white/70 hover:text-red-400'
                              }`}
                              onClick={() => toggleLikeSong(typeof songId === 'string' ? parseInt(songId) : songId)}
                            >
                              <Heart 
                                className={`h-4 w-4 ${isLiked(typeof songId === 'string' ? parseInt(songId) : songId) ? 'fill-current' : ''}`} 
                              />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {displaySongs.length > 8 && (
                    <Button
                      variant="ghost"
                      className="w-full text-white hover:text-[#1EAEDB] transition-colors"
                      onClick={() => setIsExpanded(!isExpanded)}
                    >
                      Show All ({displaySongs.length} songs)
                    </Button>
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