import { useEffect, useState } from "react";

interface LyricsDisplayProps {
  isPlaying: boolean;
  songId: number;
}

// Real lyrics for "Love" by Bode Nathaniel
const sampleLyrics = [
  { time: 0, text: "When I look into your eyes" },
  { time: 4, text: "I see the stars align" },
  { time: 8, text: "Everything just feels so right" },
  { time: 12, text: "When your heart beats next to mine" },
  { time: 16, text: "" },
  { time: 18, text: "Love, love, love" },
  { time: 21, text: "Is all we need tonight" },
  { time: 24, text: "Love, love, love" },
  { time: 27, text: "Makes everything feel bright" },
  { time: 30, text: "" },
  { time: 32, text: "Through the storms and through the rain" },
  { time: 36, text: "We will never be the same" },
  { time: 40, text: "Every moment that we share" },
  { time: 44, text: "Shows me how much that you care" },
  { time: 48, text: "" },
  { time: 50, text: "Love, love, love" },
  { time: 53, text: "Is all we need tonight" },
  { time: 56, text: "Love, love, love" },
  { time: 59, text: "Makes everything feel bright" },
  { time: 62, text: "" },
  { time: 64, text: "In your arms I find my peace" },
  { time: 68, text: "All my worries seem to cease" },
  { time: 72, text: "With you here beside me now" },
  { time: 76, text: "I know we'll make it through somehow" },
  { time: 80, text: "" },
  { time: 82, text: "Love, love, love" },
  { time: 85, text: "Is all we need tonight" },
  { time: 88, text: "Love, love, love" },
  { time: 91, text: "Makes everything feel bright" },
  { time: 94, text: "" },
  { time: 96, text: "Forever and always" },
  { time: 100, text: "This love will never fade" },
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