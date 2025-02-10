
import { Card, CardContent } from "@/components/ui/card";

export const About = () => {
  return (
    <section id="about" className="p-6">
      <Card className="bg-black/40 backdrop-blur-lg border-[#1EAEDB]/10">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold text-[#FEF7CD] mb-4">About Bode Nathaniel</h2>
          <p className="text-[#F2FCE2] leading-relaxed">
            British Nigerian musician Bode Nathaniel is well-known in the African music community. He is a gifted musician who has carved out a niche for himself as a fascinating performer and talented songwriter with his distinctive blend of African rhythms and Afrobeat influences.
          </p>
          <p className="text-[#F2FCE2] leading-relaxed mt-4">
            His music transcends national boundaries, incorporating colorful energy and contagious beats while drawing inspiration from his African background. His works demonstrate his command of the Afrobeat genre as he deftly combines traditional African components with modern sounds.
          </p>
        </CardContent>
      </Card>
    </section>
  );
};
