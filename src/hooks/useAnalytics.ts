import { useAuth } from './useAuth';
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
  const { user } = useAuth();

  const track = async (event: AnalyticsEvent) => {
    try {
      // Get additional context
      const device = navigator.userAgent;
      const app_version = '1.0.0'; // This could come from package.json or env
      
      const { error } = await supabase
        .from('events')
        .insert({
          user_id: user?.id || null,
          name: event.name,
          properties: event.properties || {},
          device: event.device || device,
          app_version: event.app_version || app_version,
          country: event.country,
          city: event.city,
        });
      
      if (error) {
        console.error('Analytics tracking error:', error);
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