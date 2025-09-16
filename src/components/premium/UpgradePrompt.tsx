import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, CheckCircle, Shield, RefreshCw, Headphones } from "lucide-react";

export const UpgradePrompt = () => {
  const benefits = [
    {
      icon: <Shield className="h-4 w-4" />,
      text: "30-day money-back guarantee"
    },
    {
      icon: <RefreshCw className="h-4 w-4" />,
      text: "Cancel anytime"
    },
    {
      icon: <Headphones className="h-4 w-4" />,
      text: "24/7 premium support"
    }
  ];

  const premiumFeatures = [
    "Unlimited playlists & saves",
    "Offline downloads available",
    "Skip songs without limits", 
    "Exclusive premium content",
    "Early access to new releases",
    "VIP merchandise access"
  ];

  return (
    <Card className="glass-card border-white/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-500/10" />
      <CardHeader className="relative text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 rounded-full">
            <Crown className="h-6 w-6 text-yellow-400" />
          </div>
        </div>
        <CardTitle className="text-white text-2xl">Why Go Premium?</CardTitle>
        <CardDescription className="text-white/70">
          Join thousands of music lovers worldwide
        </CardDescription>
      </CardHeader>
      <CardContent className="relative space-y-6">
        {/* Premium Features List */}
        <div className="space-y-3">
          {premiumFeatures.map((feature, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <CheckCircle className="h-4 w-4 text-green-400" />
              </div>
              <span className="text-white/80 text-sm">{feature}</span>
            </div>
          ))}
        </div>

        {/* Trial Badge */}
        <div className="text-center">
          <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 px-4 py-2">
            <Crown className="h-3 w-3 mr-1" />
            7-Day Free Trial
          </Badge>
        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 p-4 rounded-lg border border-white/20">
          <div className="space-y-2">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="text-yellow-400">{benefit.icon}</div>
                <span className="text-white/80 text-sm">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="space-y-1">
            <div className="text-2xl font-bold text-white">50K+</div>
            <div className="text-white/60 text-xs">Active Premium Users</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-white">4.9/5</div>
            <div className="text-white/60 text-xs">User Rating</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};