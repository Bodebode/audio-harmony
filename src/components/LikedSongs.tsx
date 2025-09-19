import { Heart, Play, Pause, ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLikedSongs } from "@/hooks/useLikedSongs";
import { useState } from "react";
import { songs } from "@/data/songs";


export const LikedSongs = () => {
  const [isLikedPlaylistPlaying, setIsLikedPlaylistPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const { isLiked, toggleLikeSong } = useLikedSongs();
  const likedList = songs.filter((s) => isLiked(s.id));

  const handleLikedPlaylistPlayPause = () => {
    setIsLikedPlaylistPlaying(!isLikedPlaylistPlaying);
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
            likedList.length === 0 ? (
              <div className="text-[#F2FCE2]/70">You haven't liked any songs yet.</div>
            ) : (
              <div className="space-y-2">
                {likedList.map((song, index) => (
                  <div
                    key={song.id}
                    className="glass-item group flex items-center justify-between p-3 rounded-lg gradient-mesh-2 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[#F2FCE2] group-hover:text-[#FEF7CD] transition-colors duration-300">
                        {song.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[#F2FCE2]/60 text-sm font-mono">{song.duration}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 transition-all duration-300 backdrop-blur-sm ${
                          isLiked(song.id)
                            ? 'text-red-500 hover:text-red-600'
                            : 'text-[#F2FCE2] hover:text-red-500'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLikeSong(song.id);
                        }}
                      >
                        <Heart className={`h-4 w-4 ${isLiked(song.id) ? 'fill-current' : ''}`} />
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