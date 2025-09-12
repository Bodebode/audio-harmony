import { Crown, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { usePremium } from "@/hooks/usePremium";

interface PremiumBadgeProps {
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "glow";
  showText?: boolean;
}

export const PremiumBadge = ({ 
  size = "md", 
  variant = "solid",
  showText = true 
}: PremiumBadgeProps) => {
  const { isPremiumActive } = usePremium();

  if (!isPremiumActive) return null;

  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm", 
    lg: "px-4 py-2 text-base"
  };

  const variantClasses = {
    solid: "bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-semibold shadow-lg",
    outline: "border-2 border-yellow-500 text-yellow-500 bg-transparent font-semibold",
    glow: "bg-gradient-to-r from-yellow-500 to-amber-500 text-black font-semibold shadow-[0_0_20px_rgba(245,158,11,0.5)] animate-pulse"
  };

  const iconSize = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  return (
    <Badge className={`${sizeClasses[size]} ${variantClasses[variant]} flex items-center gap-1.5`}>
      <Crown className={`${iconSize[size]} fill-current`} />
      {showText && <span>Premium</span>}
      {variant === "glow" && <Sparkles className={`${iconSize[size]} animate-spin`} />}
    </Badge>
  );
};