
import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const songs = [
  {
    id: 1,
    title: "Afrobeat Fusion",
    artist: "Bode Nathaniel",
    artwork: "/lovable-uploads/74cb0a2d-58c7-4be3-a188-27a043b76a3d.png",
    description: "Experience the unique blend of African rhythms\nand contemporary beats in this captivating\nAfrobeat fusion track.",
    duration: "3:45"
  },
];

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [progress, setProgress] = useState([0]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentPlaylist, setCurrentPlaylist] = useState<number[] | null>(null);

  const currentSong = songs[currentSongIndex];

  const togglePlay = () => setIsPlaying(!isPlaying);

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
    if (!currentPlaylist) {
      setCurrentSongIndex((prev) => (prev === songs.length - 1 ? 0 : prev + 1));
      return;
    }
    
    const currentIndex = currentPlaylist.indexOf(currentSong.id);
    if (currentIndex < currentPlaylist.length - 1) {
      const nextSongId = currentPlaylist[currentIndex + 1];
      const nextSongIndex = songs.findIndex(song => song.id === nextSongId);
      setCurrentSongIndex(nextSongIndex !== -1 ? nextSongIndex : 0);
    }
  };

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
    <section id="now-playing" className="p-6">
      <Card className="bg-black/40 backdrop-blur-lg border-[#1EAEDB]/10">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col justify-center">
              <div className="w-full aspect-square bg-[#222222] rounded-lg shadow-2xl overflow-hidden group relative">
                <img 
                  src={currentSong.artwork}
                  alt={`Album Art - ${currentSong.artist}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold text-[#FEF7CD] mb-2">Now Playing</h2>
                <p className="text-[#F2FCE2] text-xl mb-1">{currentSong.title}</p>
                <p className="text-[#F2FCE2]/80 text-lg">{currentSong.artist}</p>
              </div>
              <div className="space-y-4">
                <div className="h-40 overflow-y-auto bg-black/20 rounded p-4 custom-scrollbar">
                  <p className="text-[#F2FCE2] whitespace-pre-line">
                    {currentSong.description}
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Slider
                      value={progress}
                      onValueChange={setProgress}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-[#F2FCE2]">
                      <span>0:00</span>
                      <span>{currentSong.duration}</span>
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#F2FCE2] hover:text-[#1EAEDB] transition-colors"
                      onClick={handlePrevious}
                    >
                      <SkipBack className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#F2FCE2] hover:text-[#1EAEDB] transition-colors"
                      onClick={togglePlay}
                    >
                      {isPlaying ? 
                        <Pause className="h-8 w-8" /> : 
                        <Play className="h-8 w-8" />
                      }
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#F2FCE2] hover:text-[#1EAEDB] transition-colors"
                      onClick={handleNext}
                    >
                      <SkipForward className="h-6 w-6" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#F2FCE2] hover:text-[#1EAEDB] transition-colors"
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
                      onValueChange={setVolume}
                      max={100}
                      step={1}
                      className="w-24"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};
