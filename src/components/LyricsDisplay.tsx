import { useEffect, useState } from "react";

interface LyricsDisplayProps {
  isPlaying: boolean;
  songId: number;
}

// Sample lyrics for testing - replace with actual lyrics data later
const sampleLyrics = [
  { time: 0, text: "Feel the rhythm of the motherland" },
  { time: 3, text: "Ancient drums calling through the night" },
  { time: 6, text: "Voices rising from the sacred ground" },
  { time: 9, text: "Dancing spirits in the firelight" },
  { time: 12, text: "" },
  { time: 15, text: "Afrobeat fusion in my soul" },
  { time: 18, text: "Modern sounds with stories old" },
  { time: 21, text: "Every heartbeat tells a tale" },
  { time: 24, text: "Of the journey we have walked" },
  { time: 27, text: "" },
  { time: 30, text: "From Lagos to the world we sing" },
  { time: 33, text: "Unity in every string" },
  { time: 36, text: "Bass lines deep as river flow" },
  { time: 39, text: "Melodies that help us grow" },
  { time: 42, text: "" },
  { time: 45, text: "This is who we are today" },
  { time: 48, text: "Honoring our ancestors' way" },
  { time: 51, text: "Music bridges every divide" },
  { time: 54, text: "In this rhythm we confide" },
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
        className="transition-transform duration-300 ease-out space-y-2"
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
      
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded">
          <p className="text-[#F2FCE2]/50 text-sm">Press play to see lyrics</p>
        </div>
      )}
    </div>
  );
};