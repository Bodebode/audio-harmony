import { Crown, X, Check, Infinity, Music, Download, SkipForward, Star, Clock, ShoppingBag, Video } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  free: string | React.ReactNode;
  premium: string | React.ReactNode;
  highlight?: boolean;
}

export const PremiumFeaturesComparison = () => {
  const features: Feature[] = [
    {
      icon: <SkipForward className="h-5 w-5" />,
      title: "Unlimited Skips & Playlists",
      description: "Skip songs and create playlists without limits",
      free: "6 skips/hour, 0 playlists",
      premium: <div className="flex items-center gap-1"><Infinity className="h-4 w-4" /> Unlimited</div>,
      highlight: true
    },
    {
      icon: <X className="h-5 w-5" />,
      title: "Ad-Free Experience", 
      description: "Enjoy uninterrupted music streaming",
      free: "With ads",
      premium: "No ads",
      highlight: true
    },
    {
      icon: <Download className="h-5 w-5" />,
      title: "Offline Downloads",
      description: "Download songs for offline listening",
      free: "Not available",
      premium: "Available"
    },
    {
      icon: <Video className="h-5 w-5" />,
      title: "Access Exclusive Video Content",
      description: "Watch exclusive music videos and behind-the-scenes",
      free: "Not available",
      premium: "Full access"
    },
    {
      icon: <Star className="h-5 w-5" />,
      title: "Exclusive Content",
      description: "Access premium-only tracks and albums",
      free: "Limited access",
      premium: "Full access"
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Early Access",
      description: "Get new releases before everyone else",
      free: "Standard release",
      premium: "Early access"
    },
    {
      icon: <ShoppingBag className="h-5 w-5" />,
      title: "VIP Merch Access",
      description: "Exclusive merchandise and limited editions",
      free: "Standard merch",
      premium: "VIP access"
    },
  ];

  return (
    <div className="container mx-auto px-6 pb-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Premium Features
        </h2>

        {/* Mobile-friendly feature cards */}
        <div className="lg:hidden space-y-4 mb-12">
          {features.map((feature, index) => (
            <div 
              key={index}
              className={`glass-item rounded-xl p-6 animate-fade-in ${feature.highlight ? 'ring-2 ring-yellow-400/30' : ''}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-yellow-400">{feature.icon}</div>
                <div>
                  <h3 className="text-white font-semibold text-lg">{feature.title}</h3>
                  <p className="text-white/70 text-sm">{feature.description}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-500/10 rounded-lg p-3 border border-red-500/20">
                  <div className="text-xs text-red-400 font-medium mb-1">FREE</div>
                  <div className="text-white/80 text-sm">{feature.free}</div>
                </div>
                <div className="bg-yellow-500/10 rounded-lg p-3 border border-yellow-500/30 relative">
                  <Crown className="h-4 w-4 text-yellow-400 absolute top-2 right-2" />
                  <div className="text-xs text-yellow-400 font-medium mb-1">PREMIUM</div>
                  <div className="text-white font-medium text-sm">{feature.premium}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop comparison table */}
        <div className="hidden lg:block glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left p-6 text-white font-semibold">Features</th>
                  <th className="text-center p-6 text-red-400 font-semibold">
                    <div className="flex items-center justify-center gap-2">
                      <X className="h-5 w-5" />
                      Free
                    </div>
                  </th>
                  <th className="text-center p-6 text-yellow-400 font-semibold">
                    <div className="flex items-center justify-center gap-2">
                      <Crown className="h-5 w-5" />
                      Premium
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr 
                    key={index} 
                    className={`border-b border-white/5 hover:bg-white/5 transition-colors ${feature.highlight ? 'bg-yellow-400/5' : ''}`}
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="text-yellow-400">{feature.icon}</div>
                        <div>
                          <div className="text-white font-medium">{feature.title}</div>
                          <div className="text-white/70 text-sm">{feature.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="text-red-400">{feature.free}</div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="text-white font-medium flex items-center justify-center">
                        {feature.premium}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};