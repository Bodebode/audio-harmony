import { useEffect, useState } from "react";
import { useAudio } from "@/contexts/AudioContext";

interface LyricsDisplayProps {
  isPlaying: boolean;
  songId: number;
}

// Lyrics data for all songs
const lyricsData: Record<number, Array<{ time: number; text: string }>> = {
  1: [ // Alkebulan by Bode Nathaniel
    { time: 0, text: "Alkebulan" },
    { time: 5, text: "You're special, don't forget I told you" },
    { time: 10, text: "Alkebulan (oh ohoo oh)" },
    { time: 15, text: "Alkebulan, nobody is coming to save you, Alkebulan" },
    { time: 20, text: "The river is gold, the belly is green" },
    { time: 25, text: "The hills are alive, you know what it means" },
    { time: 30, text: "But somewhere, somehow along the way" },
    { time: 35, text: "You lost your mind, you missed the way" },
    { time: 40, text: "(Get it right) deep is calling out to deep" },
    { time: 45, text: "The Mother is calling out to me" },
    { time: 50, text: "The Earth listens when you speak, whether you're near or far" },
    { time: 55, text: "Even chains couldn't hold you, see how brave you are" },
    { time: 60, text: "I wish you know powerful you are" },
    { time: 65, text: "Your mind is the battlefield, remember who you are" },
    { time: 70, text: "Alkebulaaani Rise up & reclaim your throne" },
    { time: 75, text: "Alkebulaaani, you're never alone, never alone" },
    { time: 80, text: "(ohhh you're never alone)" },
    { time: 85, text: "I hope you see what I see" },
    { time: 90, text: "Cuz you're never alone" },
    { time: 95, text: "Alkebulaaan…… Alkebulaaan……" },
    { time: 100, text: "You're special don't forget I see what others can't see" },
    { time: 105, text: "Alkebulan, you're special don't forget I told you" },
    { time: 110, text: "Alkebulan" },
  ],
  2: [ // Oyoyo by Bode Nathaniel
    { time: 0, text: "Oyoyo, oyoyo" },
    { time: 5, text: "Omalicha baby, Oyoyo" },
    { time: 10, text: "Ow Gimme suga, oyoyo, oyoyo" },
    { time: 15, text: "Omalicha baby, Oyoyo" },
    { time: 20, text: "Mmm Baby, baby" },
    { time: 25, text: "Oyoyo, oyoyo" },
    { time: 30, text: "Omalicha baby, Oyoyo" },
    { time: 35, text: "Ow Gimme my sugar, oyoyo, oyoyo" },
    { time: 40, text: "You dey make my heart dey cold, oh, oh" },
    { time: 45, text: "Mmm Baby, yo" },
    { time: 50, text: "Pretty, pretty lady, yo" },
    { time: 55, text: "Mi o mo bo shen shen mi o, I no go do you wayo oh" },
    { time: 60, text: "Baby, yo" },
    { time: 65, text: "Pretty, pretty lady, yo" },
    { time: 70, text: "Mi o mo bo shen shen mi o, anything for my baby, oh" },
    { time: 75, text: "Oyoyo" },
    { time: 80, text: "Omalicha baby, Oyoyo hmmm" },
    { time: 85, text: "Plenty money, Oyoyo, oyoyo" },
    { time: 90, text: "You dey make my heart dey cold, oh, oh" },
    { time: 95, text: "Mmm I think it's destiny" },
    { time: 100, text: "You bring out the best in me" },
    { time: 105, text: "Temperature rising" },
    { time: 110, text: "And you are my remedy" },
    { time: 115, text: "I think I found the one, I'ma call mine" },
    { time: 120, text: "Telling all them other girls goodbye" },
    { time: 125, text: "Nothing but the truth, baby, no lie, no lie, no lie" },
    { time: 130, text: "Are you ready" },
    { time: 135, text: "For love, For love, For love" },
    { time: 140, text: "Are you ready for love" },
    { time: 145, text: "Stamina" },
    { time: 150, text: "Baby girl I got the stamina even tho I got the stamina" },
    { time: 155, text: "Ain't nobody got the stamina" },
    { time: 160, text: "Stamina" },
  ],
  3: [ // Love by Bode Nathaniel
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
  4: [ // Fire by Bode Nathaniel
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
  5: [ // Give Thanks (insha Jesus) by Bode Nathaniel
    { time: 0, text: "Make money, drink water, mind your business" },
    { time: 4, text: "(mind your business)" },
    { time: 6, text: "Them no like you, you no like them, no send them" },
    { time: 10, text: "Mi o ran anybody ni she" },
    { time: 13, text: "If you want make am you must work hard o" },
    { time: 17, text: "If you dey dream big you must wake up o" },
    { time: 21, text: "Dem no like you, no dey look face o" },
    { time: 25, text: "insha Jesus your hustle go pick up o" },
    { time: 29, text: "" },
    { time: 30, text: "Kinshama Dupe, Kinshama Dupe" },
    { time: 34, text: "oro mi o gbejo, kinshama dupe" },
    { time: 38, text: "Kinshama Dupe, Kinshama Dupe" },
    { time: 42, text: "oro mi o gbejo, kinshama dupe" },
    { time: 46, text: "Kinshama Dupe, Kinshama Dupe" },
    { time: 50, text: "oro mi o gbejo, kinshama dupe" },
    { time: 54, text: "" },
    { time: 55, text: "Go jogging, drink water, mind your business" },
    { time: 59, text: "Hustle hard, no dey fear, why you dey fear o" },
    { time: 63, text: "mi o ran anybody ni she" },
    { time: 66, text: "If you want make am you must work hard o" },
    { time: 70, text: "(work hard oh)" },
    { time: 72, text: "If you dey dream big you must wake up oh" },
    { time: 76, text: "Dem no like you no dey look face oh" },
    { time: 80, text: "Inshallah your hustle go pick up oh" },
    { time: 84, text: "" },
    { time: 85, text: "Kinshama Dupe, Kinshama Dupe" },
    { time: 89, text: "oro mi o gbejo, kinshama dupe" },
    { time: 93, text: "Kinshama Dupe, Kinshama Dupe" },
    { time: 97, text: "oro mi o gbejo, kinshama dupe" },
    { time: 101, text: "" },
    { time: 102, text: "Ohun oju tiri, enu o le wi" },
    { time: 106, text: "if no be God o where I for be" },
    { time: 110, text: "Life na turn by turn, soon your time go come" },
    { time: 114, text: "e wa bami jo tungba o ye ye ye" },
    { time: 118, text: "" },
    { time: 119, text: "kinshama dupe kinshama dupe" },
    { time: 123, text: "oro mi o gbejo, kinshama dupe" },
    { time: 127, text: "kinshama dupe kinshama dupe" },
    { time: 131, text: "oro mi o gbejo, kinshama dupe" }
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