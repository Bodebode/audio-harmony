
import { Play, Pause, SkipBack, SkipForward, Volume2, Volume1, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

export const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState([75]);
  const [progress, setProgress] = useState([0]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  return (
    <section id="now-playing" className="p-6">
      <Card className="bg-black/40 backdrop-blur-lg border-[#1EAEDB]/10">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col justify-center">
              <div className="w-full aspect-square bg-[#222222] rounded-lg shadow-2xl overflow-hidden group relative">
                <img 
                  src="/lovable-uploads/74cb0a2d-58c7-4be3-a188-27a043b76a3d.png"
                  alt="Album Art - Bode Nathaniel"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
            <div className="flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold text-[#FEF7CD] mb-2">Now Playing</h2>
                <p className="text-[#F2FCE2] text-xl mb-1">Afrobeat Fusion</p>
                <p className="text-[#F2FCE2]/80 text-lg">Bode Nathaniel</p>
              </div>
              <div className="space-y-4">
                <div className="h-40 overflow-y-auto bg-black/20 rounded p-4 custom-scrollbar">
                  <p className="text-[#F2FCE2] whitespace-pre-line">
                    Experience the unique blend of African rhythms
                    and contemporary beats in this captivating
                    Afrobeat fusion track.
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
                      <span>3:45</span>
                    </div>
                  </div>
                  <div className="flex justify-center items-center gap-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-[#F2FCE2] hover:text-[#1EAEDB] transition-colors"
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
