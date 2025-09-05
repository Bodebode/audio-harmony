
import { Card, CardContent } from "@/components/ui/card";

export const About = () => {
  return (
    <section id="about" className="p-6">
      <Card className="bg-black/40 backdrop-blur-lg border-[#1EAEDB]/10">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-[#FEF7CD] mb-4">About Bode Nathaniel</h2>
          <p className="text-[#F2FCE2] leading-relaxed">
            Bode Nathaniel is a talented musician whose style cuts across pop, Afro-pop, and other contemporary genres. The British-Nigerian artist has carved out a niche as a captivating performer and songwriter, blending African rhythms with Afrobeats influences to create music that resonates across cultures.
          </p>
          <p className="text-[#F2FCE2] leading-relaxed mt-4">
            With a rapidly growing fanbase, Bode Nathaniel continues to craft inspiring and uplifting tracks that explore themes of gratitude, life, love, and cultural pride.
          </p>
        </CardContent>
      </Card>
    </section>
  );
};
