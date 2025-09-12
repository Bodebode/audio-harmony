import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePremium } from "@/hooks/usePremium";
import { UpgradePrompt } from "./premium/UpgradePrompt";

export const BottomBanner = () => {
  const navigate = useNavigate();
  const { checkFeatureAccess } = usePremium();
  
  // Hide banner for premium users (no ads feature)
  if (checkFeatureAccess('noAds')) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <UpgradePrompt
        title="Get Premium for Ad-Free Experience"
        description="Enjoy uninterrupted music with premium features"
        features={[
          "No advertisements",
          "Unlimited skips",
          "High-quality audio",
          "Offline downloads"
        ]}
        variant="banner"
        dismissible={false}
      />
    </div>
  );
};