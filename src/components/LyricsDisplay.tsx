import { useEffect, useState, useRef } from "react";
import { useAudio } from "@/contexts/AudioContext";
import { Button } from "@/components/ui/button";
import { ScrollText, Play } from "lucide-react";

interface LyricsDisplayProps {
  isPlaying: boolean;
  songId: number;
}

// Real lyrics for "Love" by Bode Nathaniel - transcribed from audio (filtered to remove empty lines)
const sampleLyrics = [
  { time: 0, text: "Love is a beautiful thing" },
  { time: 5, text: "Don't you know, you should know" },
  { time: 28, text: "My love, you're a pretty sexy young thing" },
  { time: 35, text: "Oh my God, oh, oh my God" },
  { time: 44, text: "Oh, you make me high" },
  { time: 47, text: "Higher than the sky" },
  { time: 55, text: "Oh, you got me in the mood" },
  { time: 58, text: "I could take you to the moon" },
  { time: 62, text: "Oh, you blow my mind" },
  { time: 65, text: "Girl, you're so fine" },
  { time: 70, text: "Oh, you got me in the mood" },
  { time: 73, text: "I could take you to the moon" },
  { time: 79, text: "You be the one I go fight for" },
  { time: 82, text: "If na to lay down my life" },
  { time: 85, text: "I'd be dying for you" },
  { time: 87, text: "Anything for you, my baby, oh" },
  { time: 91, text: "Anything for you" },
  { time: 95, text: "You be the one I go fight for" },
  { time: 98, text: "If na to lay down my life" },
  { time: 100, text: "I'd be dying for you" },
  { time: 103, text: "Anything for you, my baby, oh" },
  { time: 107, text: "Anything for you" },
  { time: 110, text: "Oh, you make me high" },
  { time: 113, text: "Higher than the sky" },
  { time: 118, text: "Oh, you got me in the mood" },
  { time: 121, text: "I could take you to the moon" },
  { time: 126, text: "Oh, you blow my mind" },
  { time: 129, text: "Girl, you're so fine" },
  { time: 135, text: "You got me in the mood" },
  { time: 138, text: "I could take you to the moon" },
  { time: 148, text: "You be the one I go fight for" },
  { time: 151, text: "If not to lay down my life" },
  { time: 156, text: "I'd be dying for you" },
  { time: 158, text: "Anything for you, my baby, oh" },
  { time: 163, text: "Anything for you, my baby, oh" },
  { time: 168, text: "Anything for you, my baby, oh" },
  { time: 173, text: "Anything for you" },
  { time: 204, text: "Oh, you be the one I go fight for" },
  { time: 206, text: "If not to lay down my life" },
  { time: 208, text: "I'd be dying for you" },
  { time: 210, text: "Anything for you, my baby, oh" },
];

export const LyricsDisplay = ({ isPlaying, songId }: LyricsDisplayProps) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [followLyrics, setFollowLyrics] = useState(false);
  const { songProgress, duration } = useAudio();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Calculate real current time from audio progress
  const currentTime = (songProgress * duration) / 100;

  // Reset when song changes
  useEffect(() => {
    setCurrentLineIndex(0);
  }, [songId]);

  useEffect(() => {
    // Find current line based on time - compatible with older TS versions
    let newLineIndex = -1;
    for (let i = sampleLyrics.length - 1; i >= 0; i--) {
      if (currentTime >= sampleLyrics[i].time) {
        newLineIndex = i;
        break;
      }
    }
    if (newLineIndex !== -1 && newLineIndex !== currentLineIndex) {
      setCurrentLineIndex(newLineIndex);
    }
  }, [currentTime, currentLineIndex]);

  // Auto-scroll to current line when follow lyrics is enabled
  useEffect(() => {
    if (followLyrics && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const currentLineElement = container.children[0]?.children[currentLineIndex] as HTMLElement;
      
      if (currentLineElement) {
        const containerHeight = container.clientHeight;
        const lineTop = currentLineElement.offsetTop;
        const lineHeight = currentLineElement.clientHeight;
        
        // Scroll to center the current line
        const scrollTo = lineTop - (containerHeight / 2) + (lineHeight / 2);
        container.scrollTo({
          top: scrollTo,
          behavior: 'smooth'
        });
      }
    }
  }, [currentLineIndex, followLyrics]);

  return (
    <div className="space-y-3">
      {/* Follow Lyrics Toggle */}
      <div className="flex justify-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFollowLyrics(!followLyrics)}
          className={`flex items-center gap-2 text-xs ${
            followLyrics 
              ? 'text-[#1EAEDB] hover:text-[#1EAEDB] hover:bg-[#1EAEDB]/10' 
              : 'text-[#F2FCE2]/70 hover:text-[#F2FCE2] hover:bg-[#F2FCE2]/10'
          }`}
        >
          {followLyrics ? <Play className="h-3 w-3" /> : <ScrollText className="h-3 w-3" />}
          Follow Lyrics
        </Button>
      </div>

      {/* Lyrics Container */}
      <div 
        ref={scrollContainerRef}
        className="h-32 overflow-y-auto bg-black/20 rounded p-4 scrollbar-thin scrollbar-thumb-[#1EAEDB]/50 scrollbar-track-transparent"
      >
        <div className="space-y-3">
          {sampleLyrics.map((line, index) => (
            <p
              key={index}
              className={`text-center transition-all duration-300 leading-8 ${
                index === currentLineIndex 
                  ? 'text-[#1EAEDB] font-semibold text-lg scale-105' 
                  : 'text-[#F2FCE2] opacity-70'
              }`}
            >
              {line.text}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};