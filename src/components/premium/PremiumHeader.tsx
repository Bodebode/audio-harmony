import { Crown, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { usePricing } from "@/hooks/usePricing";
import { StripeCheckout } from "./StripeCheckout";

export const PremiumHeader = () => {
  const navigate = useNavigate();
  const { isGuest } = useAuth();
  const pricing = usePricing();

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

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header Section */}
        <div className="mb-12 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Crown className="h-16 w-16 text-yellow-400" />
              <Sparkles className="h-6 w-6 text-yellow-300 absolute -top-1 -right-1 animate-gentle-pulse" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            Upgrade to Premium
          </h1>
          
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Unlock the full AlkePlay experience with premium features and exclusive content
          </p>
        </div>

        {/* Pricing Card */}
        <div className="glass-card rounded-2xl p-8 mb-12 max-w-md mx-auto transform hover:scale-105 transition-all duration-300">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="text-yellow-400 font-semibold">Premium Plan</span>
            </div>
            
            <div className="mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  SAVE {pricing.savingsPercentage}%
                </span>
                <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  LIMITED TIME
                </span>
              </div>
              <div className="flex items-center justify-center gap-3">
                <span className="text-2xl text-white/60 line-through">{pricing.originalFormatted}</span>
                <span className="text-5xl font-bold text-white">{pricing.discountedFormatted}</span>
              </div>
              <span className="text-white/60 text-lg">per month</span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <StripeCheckout className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 hover:scale-105 transition-all duration-300">
                {isGuest ? "Sign Up & Pay with Stripe" : "Start Premium with Stripe"}
              </StripeCheckout>
              <Button
                onClick={handleUpgrade}
                variant="outline"
                className="flex-1 border-white/30 text-white hover:bg-white/10 py-4 bg-white/5"
              >
                {isGuest ? "Sign Up First" : "View More Options"}
              </Button>
            </div>
            
            <p className="text-white/60 text-sm mt-4">
              Cancel anytime • No hidden fees
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};