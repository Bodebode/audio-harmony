import { useEffect, useState } from "react";

interface LyricsDisplayProps {
  isPlaying: boolean;
  songId: number;
}

// Real lyrics for "Love" by Bode Nathaniel - transcribed from audio
const sampleLyrics = [
  { time: 0, text: "Love is a beautiful thing" },
  { time: 5, text: "Don't you know, you should know" },
  { time: 15, text: "" },
  { time: 28, text: "My love, you're a pretty sexy young thing" },
  { time: 35, text: "Oh my God, oh, oh my God" },
  { time: 42, text: "" },
  { time: 44, text: "Oh, you make me high" },
  { time: 47, text: "Higher than the sky" },
  { time: 52, text: "" },
  { time: 55, text: "Oh, you got me in the mood" },
  { time: 58, text: "I could take you to the moon" },
  { time: 61, text: "" },
  { time: 62, text: "Oh, you blow my mind" },
  { time: 65, text: "Girl, you're so fine" },
  { time: 69, text: "" },
  { time: 70, text: "Oh, you got me in the mood" },
  { time: 73, text: "I could take you to the moon" },
  { time: 78, text: "" },
  { time: 79, text: "You be the one I go fight for" },
  { time: 82, text: "If na to lay down my life" },
  { time: 85, text: "I'd be dying for you" },
  { time: 87, text: "Anything for you, my baby, oh" },
  { time: 91, text: "Anything for you" },
  { time: 94, text: "" },
  { time: 95, text: "You be the one I go fight for" },
  { time: 98, text: "If na to lay down my life" },
  { time: 100, text: "I'd be dying for you" },
  { time: 103, text: "Anything for you, my baby, oh" },
  { time: 107, text: "Anything for you" },
  { time: 109, text: "" },
  { time: 110, text: "Oh, you make me high" },
  { time: 113, text: "Higher than the sky" },
  { time: 117, text: "" },
  { time: 118, text: "Oh, you got me in the mood" },
  { time: 121, text: "I could take you to the moon" },
  { time: 125, text: "" },
  { time: 126, text: "Oh, you blow my mind" },
  { time: 129, text: "Girl, you're so fine" },
  { time: 133, text: "" },
  { time: 135, text: "You got me in the mood" },
  { time: 138, text: "I could take you to the moon" },
  { time: 142, text: "" },
  { time: 148, text: "You be the one I go fight for" },
  { time: 151, text: "If not to lay down my life" },
  { time: 156, text: "I'd be dying for you" },
  { time: 158, text: "Anything for you, my baby, oh" },
  { time: 162, text: "" },
  { time: 163, text: "Anything for you, my baby, oh" },
  { time: 168, text: "Anything for you, my baby, oh" },
  { time: 173, text: "Anything for you" },
  { time: 176, text: "" },
  { time: 204, text: "Oh, you be the one I go fight for" },
  { time: 206, text: "If not to lay down my life" },
  { time: 208, text: "I'd be dying for you" },
  { time: 210, text: "Anything for you, my baby, oh" },
];

export const LyricsDisplay = ({ isPlaying, songId }: LyricsDisplayProps) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    if (isPlaying) {
      intervalId = setInterval(() => {
        setCurrentTime(prev => prev + 0.1);
      }, 100);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    // Reset when song changes
    setCurrentTime(0);
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

  return (
    <div className="h-40 overflow-hidden bg-black/20 rounded p-4 relative">
      <div 
        className="transition-transform duration-1000 ease-in-out space-y-2"
        style={{
          transform: `translateY(-${Math.max(0, (currentLineIndex - 2)) * 32}px)`
        }}
      >
        {sampleLyrics.map((line, index) => (
          <p
            key={index}
            className={`text-center transition-all duration-300 leading-8 ${
              index === currentLineIndex 
                ? 'text-[#1EAEDB] font-semibold text-lg scale-105' 
                : index === currentLineIndex - 1 || index === currentLineIndex + 1
                ? 'text-[#F2FCE2] opacity-80'
                : 'text-[#F2FCE2] opacity-40'
            }`}
          >
            {line.text || "\u00A0"}
          </p>
        ))}
      </div>
      
    </div>
  );
};