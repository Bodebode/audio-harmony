import { Crown, Star, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const PremiumHeader = () => {
  const navigate = useNavigate();
  const { isGuest } = useAuth();

  const handleUpgrade = () => {
    if (isGuest) {
      navigate('/auth');
    } else {
      // Here you would integrate with your payment system
      console.log('Upgrade to premium');
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
              <span className="text-5xl font-bold text-white">$9.99</span>
              <span className="text-white/60 ml-2">per month</span>
            </div>
            
            <Button
              onClick={handleUpgrade}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-4 text-lg hover:scale-105 transition-all duration-300 hover:shadow-lg hover:shadow-yellow-400/25"
            >
              {isGuest ? "Sign Up & Get Premium" : "Upgrade Now"}
            </Button>
            
            <p className="text-white/60 text-sm mt-4">
              Cancel anytime • 7-day free trial
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};