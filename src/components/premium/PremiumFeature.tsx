import { Lock, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePremium, PremiumFeatures } from "@/hooks/usePremium";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

interface PremiumFeatureProps {
  feature: keyof PremiumFeatures;
  children: ReactNode;
  fallback?: ReactNode;
  showUpgradeButton?: boolean;
  className?: string;
}

export const PremiumFeature = ({
  feature,
  children,
  fallback,
  showUpgradeButton = true,
  className = ""
}: PremiumFeatureProps) => {
  const { checkFeatureAccess, getFeatureMessage } = usePremium();
  const navigate = useNavigate();
  
  const hasAccess = checkFeatureAccess(feature);
  
  if (hasAccess) {
    return <div className={className}>{children}</div>;
  }

  if (fallback) {
    return <div className={className}>{fallback}</div>;
  }

  // Default locked state
  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="opacity-50 pointer-events-none">
          {children}
        </div>
        
        {/* Lock overlay */}
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full">
                <Lock className="h-6 w-6 text-black" />
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-white font-semibold">Premium Feature</p>
              <p className="text-white/80 text-sm max-w-xs mx-auto">
                {getFeatureMessage(feature)}
              </p>
            </div>
            
            {showUpgradeButton && (
              <Button
                onClick={() => navigate('/auth')}
                size="sm"
                className="bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-semibold hover:from-yellow-600 hover:to-amber-600"
              >
                <Crown className="mr-2 h-4 w-4" />
                Upgrade
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};