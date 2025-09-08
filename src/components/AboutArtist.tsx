import { Card, CardContent } from "@/components/ui/card";

export const AboutArtist = () => {
  return (
    <section id="about" className="p-6">
      {/* About Alkebulan */}
      <Card className="glass-card gradient-mesh-1 relative overflow-hidden">
        <div className="absolute inset-0 gradient-aurora opacity-50 animate-gentle-pulse pointer-events-none" />
        
        <CardContent className="p-6 relative z-10">
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
        </CardContent>
      </Card>
    </section>
  );
};