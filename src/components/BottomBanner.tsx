import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePremium } from "@/hooks/usePremium";
import { useAuth } from "@/hooks/useAuth";
import { UpgradePrompt } from "./premium/UpgradePrompt";
import { SignUpBanner } from "./SignUpBanner";

export const BottomBanner = () => {
  const navigate = useNavigate();
  const { checkFeatureAccess } = usePremium();
  const { isGuest } = useAuth();
  
  // Hide banner for premium users (no ads feature)
  if (checkFeatureAccess('noAds')) {
    return null;
  }

  // Show sign up banner for guests, upgrade prompt for authenticated users
  if (isGuest) {
    return <SignUpBanner />;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <UpgradePrompt />
    </div>
  );
};