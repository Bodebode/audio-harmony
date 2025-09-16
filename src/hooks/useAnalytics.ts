import { useAuth } from './useAuth';
import { usePremium } from './usePremium';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  device?: string;
  app_version?: string;
  country?: string;
  city?: string;
}

export const useAnalytics = () => {
  const { user, profile } = useAuth();
  const { isPremiumActive } = usePremium();

  const track = async (event: AnalyticsEvent) => {
    try {
      // Get additional context
      const device = navigator.userAgent;
      const app_version = '1.0.0';
      
      // Enhanced properties with user context
      const enhancedProperties = {
        ...event.properties,
        plan_tier: isPremiumActive ? 'premium' : 'freemium',
        user_country: profile?.display_name || 'unknown',
        session_id: sessionStorage.getItem('session_id') || crypto.randomUUID(),
      };

      // Store session ID for this session
      if (!sessionStorage.getItem('session_id')) {
        sessionStorage.setItem('session_id', crypto.randomUUID());
      }
      
      const { error } = await supabase
        .from('events')
        .insert({
          user_id: user?.id || null,
          name: event.name,
          properties: enhancedProperties,
          device: event.device || device,
          app_version: event.app_version || app_version,
          country: event.country,
          city: event.city,
        });
      
      if (error) {
        console.error('Analytics tracking error:', error);
      }

      // Also log to console in development
      if (import.meta.env.DEV) {
        console.log('Analytics Event:', {
          name: event.name,
          properties: enhancedProperties,
          user_id: user?.id,
        });
      }
    } catch (error) {
      console.error('Analytics tracking failed:', error);
    }
  };

  const trackPlay = (trackId: string, position?: number) => {
    track({
      name: 'play_started',
      properties: {
        track_id: trackId,
        position_ms: position || 0
      }
    });
  };

  const trackLike = (trackId: string, action: 'like' | 'unlike') => {
    track({
      name: 'like_action',
      properties: {
        track_id: trackId,
        action
      }
    });
  };

  const trackShare = (trackId: string, platform: string) => {
    track({
      name: 'share_action',
      properties: {
        track_id: trackId,
        platform
      }
    });
  };

  return {
    track,
    trackPlay,
    trackLike,
    trackShare,
  };
};