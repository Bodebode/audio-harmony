import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, ArrowRight, Zap, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { usePricing } from "@/hooks/usePricing";

export const PremiumFeatureShowcase = () => {
  const { isGuest } = useAuth();
  const navigate = useNavigate();
  const { discountedFormatted, originalFormatted, savingsPercentage } = usePricing();

  const handleUpgrade = () => {
    if (isGuest) {
      navigate('/auth');
    } else {
      // Navigate to support page for payment
      navigate('/support');
    }
  };

  return (
    <Card className="glass-card border-white/20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
      <CardHeader className="relative text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full">
            <Crown className="h-6 w-6 text-yellow-400" />
          </div>
        </div>
        <CardTitle className="text-white text-2xl">Stripe Premium</CardTitle>
        <CardDescription className="text-white/70">
          Subscribe with credit/debit card
        </CardDescription>
      </CardHeader>
      <CardContent className="relative space-y-6">
        {/* Pricing */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-bold text-white">{discountedFormatted}</span>
            <span className="text-white/60">/month</span>
          </div>
          {savingsPercentage > 0 && (
            <div className="flex items-center justify-center gap-2">
              <span className="text-white/60 line-through text-lg">{originalFormatted}</span>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                Save {savingsPercentage}%
              </Badge>
            </div>
          )}
        </div>

        {/* Key Features */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 p-4 rounded-lg border border-white/20">
          <div className="flex items-center gap-2 mb-3">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="text-white font-medium">Premium Features:</span>
          </div>
          <ul className="text-white/80 text-sm space-y-1">
            <li>• Unlimited playlist creation</li>
            <li>• Ad-free listening experience</li>
            <li>• High-quality audio streaming</li>
            <li>• Priority customer support</li>
          </ul>
        </div>

        {/* CTA Button */}
        <Button
          onClick={handleUpgrade}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 hover:scale-105 transition-all duration-300"
        >
          {isGuest ? "Sign Up & Get Premium" : "Start Premium with Stripe"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>

        {/* Features Badge */}
        <div className="flex items-center justify-center gap-2">
          <Zap className="h-4 w-4 text-yellow-400" />
          <span className="text-white/70 text-sm">Instant activation</span>
        </div>
      </CardContent>
    </Card>
  );
};