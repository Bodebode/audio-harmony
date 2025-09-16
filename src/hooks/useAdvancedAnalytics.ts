import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { usePremium } from './usePremium';

interface AdvancedAnalyticsEvent extends Record<string, any> {
  name: string;
  properties?: Record<string, any>;
  user_id?: string;
  session_id?: string;
  page_path?: string;
  device?: string;
  country?: string;
  city?: string;
}

interface SessionMetrics {
  sessionId: string;
  startTime: Date;
  endTime?: Date;
  pagesVisited: number;
  actionsCount: number;
  deviceType: string;
  isBounce: boolean;
}

interface UserJourneyStep {
  stepNumber: number;
  pagePath: string;
  actionType: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export const useAdvancedAnalytics = () => {
  const { user, profile } = useAuth();
  const { isPremiumActive } = usePremium();
  const [currentSession, setCurrentSession] = useState<SessionMetrics | null>(null);
  const [journeySteps, setJourneySteps] = useState<UserJourneyStep[]>([]);

  // Initialize session on mount
  useEffect(() => {
    initializeSession();
    
    // Track page unload to end session
    const handleUnload = () => {
      endSession();
    };

    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      endSession();
    };
  }, []);

  // Track page changes
  useEffect(() => {
    trackPageView(window.location.pathname);
  }, [window.location.pathname]);

  const initializeSession = () => {
    const sessionId = sessionStorage.getItem('analytics_session_id') || generateSessionId();
    sessionStorage.setItem('analytics_session_id', sessionId);

    const session: SessionMetrics = {
      sessionId,
      startTime: new Date(),
      pagesVisited: 0,
      actionsCount: 0,
      deviceType: getDeviceType(),
      isBounce: true
    };

    setCurrentSession(session);
    
    // Insert session into database
    supabase.from('user_sessions').insert({
      user_id: user?.id,
      session_id: sessionId,
      start_time: session.startTime.toISOString(),
      device_type: session.deviceType,
      country: getUserCountry(),
      city: getUserCity(),
      referrer: document.referrer
    });
  };

  const endSession = () => {
    if (!currentSession) return;

    const endTime = new Date();
    const duration = Math.round((endTime.getTime() - currentSession.startTime.getTime()) / (1000 * 60)); // minutes

    // Update session in database
    supabase
      .from('user_sessions')
      .update({
        end_time: endTime.toISOString(),
        duration_minutes: duration,
        pages_visited: currentSession.pagesVisited,
        actions_count: currentSession.actionsCount,
        is_bounce: currentSession.isBounce
      })
      .eq('session_id', currentSession.sessionId);
  };

  const trackEvent = async (event: AdvancedAnalyticsEvent) => {
    try {
      // Enhanced event properties
      const enhancedProperties = {
        ...event.properties,
        plan_tier: isPremiumActive ? 'premium' : 'freemium',
        user_country: getUserCountry(),
        session_id: currentSession?.sessionId,
        page_path: window.location.pathname,
        referrer: document.referrer,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
        user_agent: navigator.userAgent
      };

      // Insert into events table
      const { error } = await supabase.from('events').insert({
        user_id: user?.id || null,
        name: event.name,
        properties: enhancedProperties,
        device: event.device || getDeviceType(),
        app_version: '2.0.0', // Updated version for Phase 6
        country: event.country || getUserCountry(),
        city: event.city || getUserCity()
      });

      if (error) {
        console.error('Analytics tracking error:', error);
      }

      // Update session metrics
      if (currentSession) {
        setCurrentSession(prev => prev ? {
          ...prev,
          actionsCount: prev.actionsCount + 1,
          isBounce: false // Any action after initial load means not a bounce
        } : null);
      }
    } catch (error) {
      console.error('Advanced analytics tracking failed:', error);
    }
  };

  const trackPageView = async (pagePath: string) => {
    // Track page view event
    await trackEvent({
      name: 'page_view',
      properties: {
        page_path: pagePath,
        page_title: document.title
      }
    });

    // Add to user journey
    const journeyStep: UserJourneyStep = {
      stepNumber: journeySteps.length + 1,
      pagePath,
      actionType: 'page_view',
      timestamp: new Date()
    };

    setJourneySteps(prev => [...prev, journeyStep]);

    // Insert into user_journeys table
    if (currentSession) {
      supabase.from('user_journeys').insert({
        user_id: user?.id,
        session_id: currentSession.sessionId,
        step_number: journeyStep.stepNumber,
        page_path: pagePath,
        action_type: 'page_view',
        timestamp: journeyStep.timestamp.toISOString(),
        metadata: { page_title: document.title }
      });

      // Update session pages visited
      setCurrentSession(prev => prev ? {
        ...prev,
        pagesVisited: prev.pagesVisited + 1
      } : null);
    }
  };

  const trackUserAction = async (actionType: string, actionData?: Record<string, any>) => {
    await trackEvent({
      name: 'user_action',
      properties: {
        action_type: actionType,
        ...actionData
      }
    });

    // Add to user journey
    const journeyStep: UserJourneyStep = {
      stepNumber: journeySteps.length + 1,
      pagePath: window.location.pathname,
      actionType,
      timestamp: new Date(),
      metadata: actionData
    };

    setJourneySteps(prev => [...prev, journeyStep]);

    // Insert into user_journeys table
    if (currentSession) {
      supabase.from('user_journeys').insert({
        user_id: user?.id,
        session_id: currentSession.sessionId,
        step_number: journeyStep.stepNumber,
        page_path: window.location.pathname,
        action_type: actionType,
        timestamp: journeyStep.timestamp.toISOString(),
        metadata: actionData || {}
      });
    }
  };

  // Specific tracking methods
  const trackPlay = (trackId: string, position?: number, duration?: number) => {
    trackEvent({
      name: 'play_started',
      properties: {
        track_id: trackId,
        position_ms: position || 0,
        track_duration: duration
      }
    });
  };

  const trackPlayComplete = (trackId: string, duration: number, listenedDuration: number) => {
    const completionRate = (listenedDuration / duration) * 100;
    
    trackEvent({
      name: 'play_completed',
      properties: {
        track_id: trackId,
        completion_rate: completionRate,
        listened_duration_ms: listenedDuration,
        total_duration_ms: duration
      }
    });
  };

  const trackSearch = (query: string, resultsCount: number) => {
    trackEvent({
      name: 'search_performed',
      properties: {
        search_query: query,
        results_count: resultsCount,
        search_type: 'track_search'
      }
    });
  };

  const trackConversion = (conversionType: 'premium_signup' | 'tip_sent' | 'track_purchase', amount?: number) => {
    trackEvent({
      name: 'conversion',
      properties: {
        conversion_type: conversionType,
        amount: amount,
        currency: 'GBP'
      }
    });
  };

  const trackError = (errorType: string, errorMessage: string, context?: Record<string, any>) => {
    trackEvent({
      name: 'error_occurred',
      properties: {
        error_type: errorType,
        error_message: errorMessage,
        error_context: context
      }
    });
  };

  const trackFeatureUsage = (featureName: string, usage_context?: Record<string, any>) => {
    trackEvent({
      name: 'feature_used',
      properties: {
        feature_name: featureName,
        usage_context: usage_context
      }
    });
  };

  // Helper functions
  const generateSessionId = () => {
    return Date.now().toString() + '-' + Math.random().toString(36).substr(2, 9);
  };

  const getDeviceType = () => {
    const userAgent = navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
      return 'tablet';
    } else if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) {
      return 'mobile';
    } else {
      return 'desktop';
    }
  };

  const getUserCountry = () => {
    // This would ideally use a geolocation service
    return 'Unknown';
  };

  const getUserCity = () => {
    // This would ideally use a geolocation service
    return 'Unknown';
  };

  return {
    trackEvent,
    trackPageView,
    trackUserAction,
    trackPlay,
    trackPlayComplete,
    trackSearch,
    trackConversion,
    trackError,
    trackFeatureUsage,
    currentSession,
    journeySteps
  };
};