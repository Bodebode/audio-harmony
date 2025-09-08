import { Card, CardContent } from "@/components/ui/card";
import { MiniAudioPlayer } from "@/components/MiniAudioPlayer";

export default function AboutArtist() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0FA0CE] via-[#222222] to-[#1EAEDB] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Artist Image */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-64 h-64 rounded-full bg-gradient-to-br from-[#1EAEDB] to-[#0FA0CE] p-1">
              <div className="w-full h-full rounded-full bg-[#F2FCE2] flex items-center justify-center">
                <span className="text-6xl text-[#222222]">BN</span>
              </div>
            </div>
            <div className="absolute -inset-2 bg-gradient-to-r from-[#1EAEDB]/30 to-[#FEF7CD]/30 rounded-full blur-xl opacity-50" />
          </div>
        </div>

        {/* About Bode Nathaniel Content */}
        <Card className="glass-card gradient-mesh-1 relative overflow-hidden">
          <div className="absolute inset-0 gradient-aurora opacity-50 animate-gentle-pulse pointer-events-none" />
          
          <CardContent className="p-8 relative z-10">
            <h1 className="text-4xl font-bold text-[#FEF7CD] mb-8 text-center relative">
              About Bode Nathaniel
              <div className="absolute -inset-1 bg-gradient-to-r from-[#1EAEDB]/20 via-transparent to-[#FEF7CD]/10 blur-sm -z-10 opacity-50" />
            </h1>
            
            <div className="space-y-6 text-[#F2FCE2] text-lg leading-relaxed">
              <p>
                Bode Nathaniel is a talented musician whose style cuts across Afro-pop and other contemporary genres. 
                The British-Nigerian artist has carved out a niche as a captivating performer & songwriter, blending 
                African rhythms with Afrobeats influences to create music that resonates across cultures.
              </p>
              
              <p>
                With a rapidly growing fanbase, Bode Nathaniel continues to craft inspiring and uplifting tracks that 
                explore themes of gratitude, life, love and cultural pride. His music serves as a bridge between 
                traditional African sounds and contemporary global music trends.
              </p>

              <p>
                Born with a passion for music and storytelling, Bode's journey began with writing songs that reflect 
                his multicultural experiences. His ability to seamlessly blend different musical influences has earned 
                him recognition as an emerging voice in the contemporary music scene.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Mini Audio Player with Visualizer */}
        <MiniAudioPlayer />
      </div>
    </div>
  );
}