import { Button } from "@/components/ui/button";
import { Crown, ArrowRight, Shield, RefreshCw, Headphones } from "lucide-react";
import { PremiumFeatureShowcase } from "./PremiumFeatureShowcase";
import { UpgradePrompt } from "./UpgradePrompt";
import PayPalSubscription from "./PayPalSubscription";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const PremiumCTA = () => {
  const navigate = useNavigate();
  const { isGuest } = useAuth();

  const handleUpgrade = () => {
    if (isGuest) {
      navigate('/auth');
    } else {
      // Navigate to support page for payment
      navigate('/support');
    }
  };

  const benefits = [
    {
      icon: <Shield className="h-5 w-5" />,
      text: "30-day money-back guarantee"
    },
    {
      icon: <RefreshCw className="h-5 w-5" />,
      text: "Cancel anytime"
    },
    {
      icon: <Headphones className="h-5 w-5" />,
      text: "24/7 premium support"
    }
  ];

  return (
    <div className="container mx-auto px-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-3xl p-8 lg:p-12 text-center gradient-mesh-1">
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <div className="bg-yellow-400/20 rounded-full p-4">
                <Crown className="h-12 w-12 text-yellow-400" />
              </div>
            </div>
            
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Ready to Go Premium?
            </h2>
            
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of music lovers who've upgraded to the ultimate AlkePlay experience
            </p>
          </div>

          {/* CTA Button */}
          <div className="mb-8">
            <Button
              onClick={handleUpgrade}
              size="lg"
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold px-12 py-6 text-xl rounded-full hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/25"
            >
              {isGuest ? "Sign Up & Get Premium" : "Start Your Premium Journey"}
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
          </div>

          {/* PayPal Option */}
          <div className="max-w-md mx-auto">
            <div className="text-center mb-6">
              <p className="text-white/80 text-lg">Alternative Payment Method</p>
              <p className="text-white/60 text-sm">Subscribe with PayPal for the same great benefits</p>
            </div>
            <PayPalSubscription />
          </div>

          {/* Trial Info */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-white/60">
              Start with a <span className="text-yellow-400 font-semibold">7-day free trial</span> • No commitment required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};