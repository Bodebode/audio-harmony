import { 
  Music, 
  Download, 
  Volume2, 
  Shuffle, 
  Crown, 
  Zap, 
  Star,
  Headphones
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const premiumFeatures = [
  {
    icon: Music,
    title: "Unlimited Playlists",
    description: "Create as many playlists as you want",
    accent: "from-blue-500 to-cyan-500"
  },
  {
    icon: Headphones,
    title: "High-Quality Audio",
    description: "Stream in crystal clear 320kbps",
    accent: "from-purple-500 to-pink-500"
  },
  {
    icon: Download,
    title: "Offline Downloads", 
    description: "Take your music anywhere",
    accent: "from-green-500 to-emerald-500"
  },
  {
    icon: Zap,
    title: "No Advertisements",
    description: "Uninterrupted music experience",
    accent: "from-orange-500 to-red-500"
  },
  {
    icon: Shuffle,
    title: "Unlimited Skips",
    description: "Skip songs without limits",
    accent: "from-indigo-500 to-purple-500"
  },
  {
    icon: Star,
    title: "Exclusive Content",
    description: "Access premium-only releases",
    accent: "from-yellow-500 to-amber-500"
  }
];

export const PremiumFeatureShowcase = () => {
  const navigate = useNavigate();

  return (
    <section className="p-6 space-y-6">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-3 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full">
            <Crown className="h-8 w-8 text-black" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-white">
          Upgrade to Premium
        </h2>
        <p className="text-white/80 text-lg max-w-2xl mx-auto">
          Unlock the full potential of your music experience with these exclusive features
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {premiumFeatures.map((feature, index) => (
          <Card 
            key={feature.title}
            className="bg-black/40 backdrop-blur-lg border-white/10 hover:border-white/20 transition-all duration-300 group animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className={`p-3 bg-gradient-to-r ${feature.accent} rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white group-hover:text-white/90">
                  {feature.title}
                </h3>
                <p className="text-white/70 text-sm">
                  {feature.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center pt-6">
        <Button
          onClick={() => navigate('/auth')}
          size="lg"
          className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-semibold text-lg px-8 py-3 hover:from-yellow-600 hover:to-amber-600 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
        >
          <Crown className="mr-2 h-5 w-5" />
          Get Premium Now
        </Button>
        
        <p className="text-white/60 text-sm mt-4">
          Start your premium experience today
        </p>
      </div>
    </section>
  );
};