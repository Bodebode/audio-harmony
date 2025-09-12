import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLikedSongs } from "@/hooks/useLikedSongs";

const sampleSongs = [
  { id: 1, title: "Afrobeat Fusion", duration: "3:45" },
  { id: 2, title: "Lagos Nights", duration: "4:12" },
  { id: 3, title: "Ancestral Voices", duration: "3:58" },
  { id: 4, title: "Modern Traditions", duration: "4:23" },
  { id: 5, title: "Unity Dance", duration: "3:41" },
  { id: 6, title: "River Flow", duration: "4:07" },
  { id: 7, title: "Rhythmic Soul", duration: "3:52" },
  { id: 8, title: "Golden Dawn", duration: "4:18" }
];

export const LikedSongs = () => {
  const { isLiked, toggleLikeSong } = useLikedSongs();
  const likedList = sampleSongs.filter((s) => isLiked(s.id));

  return (
    <section id="liked-songs" className="p-6">
      <Card className="glass-card gradient-mesh-1 relative overflow-hidden">
        <div className="absolute inset-0 gradient-aurora opacity-50 animate-gentle-pulse pointer-events-none" />
        <CardContent className="p-6 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-[#FEF7CD] relative">
              Liked Songs
              <div className="absolute -inset-1 bg-gradient-to-r from-[#1EAEDB]/20 via-transparent to-[#FEF7CD]/10 blur-sm -z-10 opacity-50" />
            </h2>
          </div>

          {likedList.length === 0 ? (
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
          )}
        </CardContent>
      </Card>
    </section>
  );
};