import { Crown, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface UpgradePromptProps {
  title?: string;
  description?: string;
  features?: string[];
  variant?: "card" | "banner" | "modal";
  onDismiss?: () => void;
  dismissible?: boolean;
}

export const UpgradePrompt = ({
  title = "Upgrade to Premium",
  description = "Unlock unlimited music and exclusive features",
  features = [
    "Unlimited playlists",
    "High-quality 320kbps streaming", 
    "No advertisements",
    "Offline downloads"
  ],
  variant = "card",
  onDismiss,
  dismissible = false
}: UpgradePromptProps) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const navigate = useNavigate();

    const handleUpgrade = () => {
      navigate('/premium');
    };

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss?.();
  };

  if (isDismissed) return null;

  const content = (
    <>
      {dismissible && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-white/60 hover:text-white h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
      
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg">
          <Crown className="h-6 w-6 text-black" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="text-white/80 text-sm">{description}</p>
        </div>
      </div>

      <div className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2 text-white/90 text-sm">
            <div className="w-1.5 h-1.5 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full" />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <Button
        onClick={handleUpgrade}
        className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-semibold hover:from-yellow-600 hover:to-amber-600 transition-all duration-300"
      >
        Upgrade Now
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </>
  );

  if (variant === "banner") {
    return (
      <div className="bg-gradient-to-r from-black/80 to-gray-900/80 backdrop-blur-lg border border-yellow-500/20 p-4 relative">
        {content}
      </div>
    );
  }

  if (variant === "modal") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="bg-gradient-to-br from-gray-900 to-black border-yellow-500/20 max-w-md w-full">
          <CardContent className="p-6 relative">
            {content}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-lg border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-300">
      <CardContent className="p-6 relative">
        {content}
      </CardContent>
    </Card>
  );
};