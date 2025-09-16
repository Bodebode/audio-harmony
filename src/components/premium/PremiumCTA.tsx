import { Button } from "@/components/ui/button";
import { Crown, ArrowRight, Shield, RefreshCw, Headphones } from "lucide-react";
import { PremiumFeatureShowcase } from "./PremiumFeatureShowcase";
import { UpgradePrompt } from "./UpgradePrompt";
import PayPalSubscription from "./PayPalSubscription";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { StripeCheckout } from "./StripeCheckout";

export const PremiumCTA = () => {
  const navigate = useNavigate();
  const { isGuest } = useAuth();

  const handleUpgrade = () => {
    if (isGuest) {
      navigate('/auth');
    } else {
      // Scroll to PayPal section
      const paypalSection = document.getElementById('paypal-subscription');
      if (paypalSection) {
        paypalSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
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

          {/* Payment Options */}
          <div className="mb-8 space-y-4">
            <StripeCheckout className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 text-lg hover:scale-105 transition-all duration-300">
              {isGuest ? "Sign Up & Pay with Stripe" : "Start Premium with Stripe"}
            </StripeCheckout>
            
            <div className="text-center text-white/60 text-sm">
              or
            </div>
            
            <div id="paypal-subscription" className="scroll-mt-20">
              <PayPalSubscription />
            </div>
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