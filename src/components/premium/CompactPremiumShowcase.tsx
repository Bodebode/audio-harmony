import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, ArrowRight, Zap, Star } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { usePricing } from "@/hooks/usePricing";

export const CompactPremiumShowcase = () => {
  const { isGuest } = useAuth();
  const navigate = useNavigate();
  const { discountedFormatted, originalFormatted, savingsPercentage } = usePricing();

  const handleUpgrade = () => {
    if (isGuest) {
      navigate('/auth');
    } else {
      navigate('/premium');
    }
  };

  return (
    <Card className="glass-card border-white/20 relative overflow-hidden max-w-2xl mx-auto">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10" />
      <CardContent className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full">
              <Crown className="h-5 w-5 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold">Go Premium Today</h3>
              <p className="text-white/70 text-sm">Unlock all features & exclusive content</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-xl">{discountedFormatted}</span>
                <span className="text-white/60 text-sm">/month</span>
              </div>
              {savingsPercentage > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-white/60 line-through text-sm">{originalFormatted}</span>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                    Save {savingsPercentage}%
                  </Badge>
                </div>
              )}
            </div>
            
            <Button
              onClick={handleUpgrade}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-6 hover:scale-105 transition-all duration-300"
            >
              {isGuest ? "Sign Up" : "Upgrade"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-white/10">
          <Zap className="h-4 w-4 text-yellow-400" />
          <span className="text-white/70 text-sm">Cancel anytime • No commitment</span>
        </div>
      </CardContent>
    </Card>
  );
};