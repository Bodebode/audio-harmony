import { useAuth } from './useAuth';

export interface PremiumFeatures {
  unlimitedPlaylists: boolean;
  noAds: boolean;
  offlineDownloads: boolean;
  unlimitedSkips: boolean;
  premiumContent: boolean;
  earlyAccess: boolean;
  exclusiveSongs: boolean;
  vipMerchAccess: boolean;
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
    offlineDownloads: isPremiumActive,
    unlimitedSkips: isPremiumActive,
    premiumContent: isPremiumActive,
    earlyAccess: isPremiumActive,
    exclusiveSongs: isPremiumActive,
    vipMerchAccess: isPremiumActive
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
      noAds: 'No advertisements',
      offlineDownloads: 'Download music for offline listening',
      unlimitedSkips: 'Skip songs without limits',
      premiumContent: 'Access exclusive premium content',
      earlyAccess: 'Get early access to new releases',
      exclusiveSongs: 'Exclusive Songs & Contents',
      vipMerchAccess: 'VIP Merch & Access page'
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