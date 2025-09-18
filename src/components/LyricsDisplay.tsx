import { useEffect, useState } from "react";
import { useAudio } from "@/contexts/AudioContext";

interface LyricsDisplayProps {
  isPlaying: boolean;
  songId: number;
}

// Lyrics data for all songs
const lyricsData: Record<number, Array<{ time: number; text: string }>> = {
  1: [ // Love by Bode Nathaniel
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
  ],
  2: [ // Fire by Bode Nathaniel
    { time: 0, text: "Omoge" },
    { time: 3, text: "Anything you want, oh baby, I go pay hmm, I go pay" },
    { time: 8, text: "Sapa better go for holiday" },
    { time: 12, text: "It's plenty for pocket, baby, money dey" },
    { time: 16, text: "As I see you, your body na fire" },
    { time: 20, text: "You dey go gaga" },
    { time: 22, text: "When you see the raba, see the wire" },
    { time: 25, text: "Fire, baby, fire o, I no go taya o" },
    { time: 29, text: "I no dey give you lamba o" },
    { time: 32, text: "If I spray you dollar o, will you go down for me oh" },
    { time: 37, text: "Keregi keregi, keregi keregi keregi kere" },
    { time: 40, text: "Go down for me o" },
    { time: 42, text: "Keregi keregi, keregi keregi keregi kere" },
    { time: 45, text: "Sho ma bamilooo" },
    { time: 47, text: "Keregi keregi, keregi keregi keregi kere" },
    { time: 50, text: "Go down for me o" },
    { time: 52, text: "Sho ma bamilooo" },
    { time: 55, text: "Fire, Olomoge kilo desire" },
    { time: 58, text: "For this your love I no go tire" },
    { time: 62, text: "Your attire is loud, e got me higher" },
    { time: 66, text: "Personally, I know dey perform, I'm intentionally" },
    { time: 71, text: "Oh, you got me emotionally" },
    { time: 74, text: "Love your love unconditionally" },
    { time: 78, text: "Baby oh, baby oh, honey oh, honey oh" },
    { time: 82, text: "Be straight with me, don't be shady oh" },
    { time: 86, text: "Mafimi sere your body na fire" },
    { time: 89, text: "You dey go gaga" },
    { time: 92, text: "When you see the raba, see the wire" },
    { time: 95, text: "Fire, baby, fire o, I no go taya o" },
    { time: 99, text: "I no dey give you lamba o" },
    { time: 102, text: "If I spray you dollar o, will you go down for me oh" },
    { time: 107, text: "Keregi keregi, keregi keregi keregi kere" },
    { time: 110, text: "Go down for me o" },
    { time: 112, text: "Keregi keregi, keregi keregi keregi kere" },
    { time: 115, text: "Sho ma bamilooo" },
    { time: 117, text: "Keregi keregi, keregi keregi keregi kere" },
    { time: 120, text: "Go down for me o" },
  ],
};

export const LyricsDisplay = ({ isPlaying, songId }: LyricsDisplayProps) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const { songProgress, duration } = useAudio();

  // Get lyrics for the current song
  const currentLyrics = lyricsData[songId] || [];

  // Calculate real current time from audio progress
  const currentTime = (songProgress * duration) / 100;

  // Reset when song changes
  useEffect(() => {
    setCurrentLineIndex(0);
  }, [songId]);

  useEffect(() => {
    // Find current line based on time - compatible with older TS versions
    let newLineIndex = -1;
    for (let i = currentLyrics.length - 1; i >= 0; i--) {
      if (currentTime >= currentLyrics[i].time) {
        newLineIndex = i;
        break;
      }
    }
    if (newLineIndex !== -1 && newLineIndex !== currentLineIndex) {
      setCurrentLineIndex(newLineIndex);
    }
  }, [currentTime, currentLineIndex, currentLyrics]);

  // Show message if no lyrics available
  if (currentLyrics.length === 0) {
    return (
      <div className="h-32 overflow-y-auto bg-black/20 rounded p-4 flex items-center justify-center">
        <p className="text-[#F2FCE2] opacity-70 text-center">No lyrics available for this song</p>
      </div>
    );
  }

  return (
    <div className="h-32 overflow-y-auto bg-black/20 rounded p-4 scrollbar-thin scrollbar-thumb-[#1EAEDB]/50 scrollbar-track-transparent">
      <div className="space-y-3">
        {currentLyrics.map((line, index) => (
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
  );
};