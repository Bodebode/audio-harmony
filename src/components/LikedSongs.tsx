
import { Card, CardContent } from "@/components/ui/card";
import { Heart } from "lucide-react";

type Song = {
  id: number;
  title: string;
  duration: string;
  likes?: string[];
};

type LikedSongsProps = {
  songs: Song[];
  currentUserId: string;
};

export const LikedSongs = ({ songs, currentUserId }: LikedSongsProps) => {
  const likedSongs = songs.filter(song => song.likes?.includes(currentUserId));

  return (
    <Card className="bg-black/40 backdrop-blur-lg border-[#1EAEDB]/10">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="h-5 w-5 text-[#ea384c]" fill="#ea384c" />
          <h2 className="text-xl font-bold text-[#FEF7CD]">Liked Songs</h2>
          <span className="text-[#F2FCE2]/70 text-sm">({likedSongs.length})</span>
        </div>
        <div className="space-y-2">
          {likedSongs.map((song) => (
            <div
              key={song.id}
              className="flex items-center justify-between p-2 rounded bg-black/10"
            >
              <span className="text-[#F2FCE2]">{song.title}</span>
              <span className="text-[#F2FCE2]/50 text-sm">
                {song.duration}
              </span>
            </div>
          ))}
          {likedSongs.length === 0 && (
            <p className="text-[#F2FCE2]/50 text-sm text-center py-2">
              No liked songs yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
