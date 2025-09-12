import { useAuth } from './useAuth';

export interface PremiumFeatures {
  unlimitedPlaylists: boolean;
  noAds: boolean;
  advancedControls: boolean;
  offlineDownloads: boolean;
  unlimitedSkips: boolean;
  premiumContent: boolean;
  earlyAccess: boolean;
}

export const usePremium = () => {
  const { isPremium, profile } = useAuth();
  
  // Check if premium is expired
  const isPremiumActive = isPremium && (
    !profile?.premium_expires_at || 
    new Date(profile.premium_expires_at) > new Date()
  );

  // Define what features premium users get
  const premiumFeatures: PremiumFeatures = {
    unlimitedPlaylists: isPremiumActive,
    noAds: isPremiumActive,
    advancedControls: isPremiumActive,
    offlineDownloads: isPremiumActive,
    unlimitedSkips: isPremiumActive,
    premiumContent: isPremiumActive,
    earlyAccess: isPremiumActive
  };

  // Free user limits
  const limits = {
    maxPlaylists: isPremiumActive ? Infinity : 2,
    skipsPerHour: isPremiumActive ? Infinity : 6,
    maxOfflineDownloads: isPremiumActive ? Infinity : 0
  };

  const checkFeatureAccess = (feature: keyof PremiumFeatures): boolean => {
    return premiumFeatures[feature];
  };

  const getFeatureMessage = (feature: keyof PremiumFeatures): string => {
    const messages = {
      unlimitedPlaylists: 'Create unlimited playlists',
      noAds: 'Listen without interruptions',
      advancedControls: 'Access equalizer and crossfade',
      offlineDownloads: 'Download music for offline listening',
      unlimitedSkips: 'Skip songs without limits',
      premiumContent: 'Access exclusive premium content',
      earlyAccess: 'Get early access to new releases'
    };
    
    return messages[feature] || 'Premium feature';
  };

  return {
    isPremiumActive,
    premiumFeatures,
    limits,
    checkFeatureAccess,
    getFeatureMessage,
    expiresAt: profile?.premium_expires_at
  };
};