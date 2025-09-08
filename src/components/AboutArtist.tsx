import { Card, CardContent } from "@/components/ui/card";

export const AboutArtist = () => {
  return (
    <section id="about" className="p-6">
      <Card className="glass-card gradient-mesh-1 relative overflow-hidden">
        {/* Gradient overlay animation */}
        <div className="absolute inset-0 gradient-aurora opacity-50 animate-gentle-pulse pointer-events-none" />
        
        <CardContent className="p-6 relative z-10 space-y-8">
          {/* About Bode Nathaniel */}
          <div>
            <h2 className="text-2xl font-bold text-[#FEF7CD] mb-6 relative">
              About Bode Nathaniel
              <div className="absolute -inset-1 bg-gradient-to-r from-[#1EAEDB]/20 via-transparent to-[#FEF7CD]/10 blur-sm -z-10 opacity-50" />
            </h2>
            
            <div className="space-y-4 text-[#F2FCE2]">
              <p className="leading-relaxed">
                Bode Nathaniel is a talented musician whose style cuts across pop, Afro-pop, and other contemporary genres. 
                The British-Nigerian artist has carved out a niche as a captivating performer and songwriter, blending 
                African rhythms with Afrobeats influences to create music that resonates across cultures.
              </p>
              
              <p className="leading-relaxed">
                With a rapidly growing fanbase, Bode Nathaniel continues to craft inspiring and uplifting tracks that 
                explore themes of gratitude, life, love, and cultural pride.
              </p>
            </div>
          </div>

          {/* About Alkebulan */}
          <div>
            <h2 className="text-2xl font-bold text-[#FEF7CD] mb-6 relative">
              About Alkebulan
              <div className="absolute -inset-1 bg-gradient-to-r from-[#1EAEDB]/20 via-transparent to-[#FEF7CD]/10 blur-sm -z-10 opacity-50" />
            </h2>
            
            <div className="space-y-4 text-[#F2FCE2]">
              <p className="leading-relaxed">
                Each track in the Alkebulan collection tells a story, weaving together melodies that speak to the soul 
                and rhythms that move the body. The music explores themes of identity, culture, and the human experience.
              </p>
              
              <p className="leading-relaxed">
                Discover the artistry behind the sound and join thousands of listeners who have made Alkebulan 
                part of their daily soundtrack.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};