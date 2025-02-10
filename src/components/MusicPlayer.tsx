
import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX, Shuffle, Repeat, Repeat1, ListMusic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useState, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";

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

type RepeatMode = "none" | "all" | "one";

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [progress, setProgress] = useState([0]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentPlaylist, setCurrentPlaylist] = useState<number[] | null>(null);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [repeatMode, setRepeatMode] = useState<RepeatMode>("none");
  const [queue, setQueue] = useState<number[]>([]);
  const { toast } = useToast();

  const currentSong = songs[currentSongIndex];

  const togglePlay = () => setIsPlaying(!isPlaying);

  const toggleShuffle = () => {
    setIsShuffleOn(!isShuffleOn);
    toast({
      title: !isShuffleOn ? "Shuffle mode enabled" : "Shuffle mode disabled",
      duration: 2000,
    });
  };

  const cycleRepeatMode = () => {
    const modes: RepeatMode[] = ["none", "all", "one"];
    const currentIndex = modes.indexOf(repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setRepeatMode(nextMode);
    
    const messages = {
      none: "Repeat mode disabled",
      all: "Repeating all songs",
      one: "Repeating current song"
    };
    
    toast({
      title: messages[nextMode],
      duration: 2000,
    });
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

  // Export these methods to be used by other components
  (window as any).musicPlayerControls = {
    playPlaylist: (songIds: number[]) => {
      if (songIds.length === 0) return;
      const firstSongId = songIds[0];
      const firstSongIndex = songs.findIndex(song => song.id === firstSongId);
      if (firstSongIndex !== -1) {
        setCurrentSongIndex(firstSongIndex);
        setCurrentPlaylist(songIds);
        setQueue(songIds.slice(1));
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
                      className={`text-[#F2FCE2] transition-colors ${isShuffleOn ? 'text-[#1EAEDB]' : 'hover:text-[#1EAEDB]'}`}
                      onClick={toggleShuffle}
                    >
                      <Shuffle className="h-5 w-5" />
                    </Button>
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`text-[#F2FCE2] transition-colors ${
                        repeatMode !== "none" ? 'text-[#1EAEDB]' : 'hover:text-[#1EAEDB]'
                      }`}
                      onClick={cycleRepeatMode}
                    >
                      {repeatMode === "one" ? (
                        <Repeat1 className="h-5 w-5" />
                      ) : (
                        <Repeat className="h-5 w-5" />
                      )}
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
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-[#F2FCE2] hover:text-[#1EAEDB] transition-colors ml-2"
                        >
                          <ListMusic className="h-5 w-5" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="right" className="w-[400px] bg-black/90 border-[#1EAEDB]/10">
                        <SheetHeader>
                          <SheetTitle className="text-[#FEF7CD]">Queue</SheetTitle>
                        </SheetHeader>
                        <div className="mt-4">
                          {queue.length > 0 ? (
                            <div className="space-y-2">
                              {queue.map((songId) => {
                                const song = songs.find(s => s.id === songId);
                                if (!song) return null;
                                return (
                                  <div
                                    key={song.id}
                                    className="flex items-center justify-between p-2 rounded bg-black/20 text-[#F2FCE2]"
                                  >
                                    <div>
                                      <p className="font-medium">{song.title}</p>
                                      <p className="text-sm text-[#F2FCE2]/70">{song.artist}</p>
                                    </div>
                                    <span className="text-sm text-[#F2FCE2]/50">{song.duration}</span>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-[#F2FCE2]/50 text-center">Queue is empty</p>
                          )}
                        </div>
                      </SheetContent>
                    </Sheet>
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

