import { Heart, Play, Pause, ChevronDown, PlayCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLikedSongs } from "@/hooks/useLikedSongs";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Track {
  id: string;
  title: string;
  duration_sec?: number;
  explicit?: boolean;
  release?: {
    title: string;
    cover_url?: string;
  };
}

export const LikedSongs = () => {
  const [isLikedPlaylistPlaying, setIsLikedPlaylistPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [playingSongId, setPlayingSongId] = useState<string | null>(null);
  const { isLiked, toggleLikeSong } = useLikedSongs();

  // Fetch all tracks from database
  const { data: allTracks = [], isLoading } = useQuery({
    queryKey: ['liked-songs-tracks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tracks')
        .select(`
          *,
          release:releases!inner(title, cover_url, status)
        `)
        .eq('status', 'ready')
        .eq('release.status', 'live')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Track[];
    },
  });

  // Filter tracks to only show liked ones
  const likedList = allTracks.filter((track) => isLiked(parseInt(track.id)));

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlaySong = (trackId: string) => {
    if ((window as any).musicPlayerControls?.playPlaylist) {
      (window as any).musicPlayerControls.playPlaylist([trackId]);
    }
    setPlayingSongId(trackId);
  };

  const handleLikedPlaylistPlayPause = () => {
    setIsLikedPlaylistPlaying(!isLikedPlaylistPlaying);
    if (!isLikedPlaylistPlaying && likedList.length > 0) {
      // Play the first liked track
      const trackIds = likedList.map(track => track.id);
      if ((window as any).musicPlayerControls?.playPlaylist) {
        (window as any).musicPlayerControls.playPlaylist(trackIds);
      }
      setPlayingSongId(likedList[0].id);
    } else {
      setPlayingSongId(null);
    }
  };

  return (
    <section id="liked-songs" className="p-6">
      <Card className="glass-card gradient-mesh-1 relative overflow-hidden">
        <div className="absolute inset-0 gradient-aurora opacity-50 animate-gentle-pulse pointer-events-none" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-[#FEF7CD] relative">
                Liked Songs
                <div className="absolute -inset-1 bg-gradient-to-r from-[#1EAEDB]/20 via-transparent to-[#FEF7CD]/10 blur-sm -z-10 opacity-50" />
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLikedPlaylistPlayPause}
                disabled={likedList.length === 0}
                className={`h-8 w-8 rounded-full transition-all duration-300 backdrop-blur-sm ${
                  isLikedPlaylistPlaying 
                    ? 'text-[#1EAEDB] bg-[#1EAEDB]/30 shadow-[0_0_20px_rgba(30,174,219,0.3)]' 
                    : 'text-[#FEF7CD] hover:text-[#1EAEDB] hover:bg-[#1EAEDB]/20 hover:shadow-[0_0_15px_rgba(30,174,219,0.2)] disabled:opacity-50 disabled:hover:text-[#FEF7CD] disabled:hover:bg-transparent'
                }`}
              >
                {isLikedPlaylistPlaying ? (
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
            isLoading ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-[#F2FCE2]/60 text-sm">Loading liked songs...</p>
              </div>
            ) : likedList.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 mx-auto mb-3 text-[#F2FCE2]/30" />
                <div className="text-[#F2FCE2]/70 mb-1">You haven't liked any songs yet.</div>
                <div className="text-[#F2FCE2]/50 text-sm">
                  Like songs from the library to see them here
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {likedList.map((song, index) => (
                  <div
                    key={song.id}
                    className="glass-item group flex items-center justify-between p-3 rounded-lg gradient-mesh-2 animate-fade-in cursor-pointer"
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
                        <PlayCircle className="h-4 w-4" />
                      </Button>
                      <span className={`flex items-center gap-2 transition-all duration-300 ${
                        playingSongId === song.id ? 'text-[#1EAEDB] font-medium' : 'text-[#F2FCE2] group-hover:text-[#FEF7CD]'
                      }`}>
                        {song.title}
                        {song.explicit && (
                          <span className="px-1 py-0.5 bg-red-600 text-white text-xs rounded">E</span>
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 relative z-10">
                      <span className="text-[#F2FCE2]/60 group-hover:text-[#F2FCE2]/90 transition-colors duration-300 text-sm font-mono">
                        {formatDuration(song.duration_sec)}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 transition-all duration-300 opacity-30 group-hover:opacity-100 backdrop-blur-sm ${
                          isLiked(parseInt(song.id))
                            ? 'text-red-500 hover:text-red-600 !opacity-100'
                            : 'text-[#F2FCE2] hover:text-red-500'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLikeSong(parseInt(song.id));
                        }}
                      >
                        <Heart className={`h-4 w-4 ${isLiked(parseInt(song.id)) ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </CardContent>
      </Card>
    </section>
  );
};