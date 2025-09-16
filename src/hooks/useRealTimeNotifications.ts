import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface AdminNotification {
  id: string;
  type: 'user_signup' | 'release_upload' | 'premium_purchase' | 'system_alert';
  title: string;
  message: string;
  data?: any;
  timestamp: Date;
  read: boolean;
}

export const useRealTimeNotifications = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    // Subscribe to real-time events
    const channel = supabase
      .channel('admin-notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'profiles'
        },
        (payload) => {
          const newNotification: AdminNotification = {
            id: `user-${payload.new.id}`,
            type: 'user_signup',
            title: 'New User Registration',
            message: `${payload.new.display_name || 'A new user'} has signed up`,
            data: payload.new,
            timestamp: new Date(),
            read: false
          };
          
          setNotifications(prev => [newNotification, ...prev.slice(0, 49)]);
          setUnreadCount(prev => prev + 1);
          
          toast({
            title: newNotification.title,
            description: newNotification.message,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'releases'
        },
        (payload) => {
          const newNotification: AdminNotification = {
            id: `release-${payload.new.id}`,
            type: 'release_upload',
            title: 'New Release Uploaded',
            message: `Release "${payload.new.title}" has been uploaded`,
            data: payload.new,
            timestamp: new Date(),
            read: false
          };
          
          setNotifications(prev => [newNotification, ...prev.slice(0, 49)]);
          setUnreadCount(prev => prev + 1);
          
          toast({
            title: newNotification.title,
            description: newNotification.message,
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          filter: 'is_premium=eq.true'
        },
        (payload) => {
          if (payload.old.is_premium === false && payload.new.is_premium === true) {
            const newNotification: AdminNotification = {
              id: `premium-${payload.new.id}`,
              type: 'premium_purchase',
              title: 'Premium Purchase',
              message: `${payload.new.display_name || 'A user'} upgraded to premium`,
              data: payload.new,
              timestamp: new Date(),
              read: false
            };
            
            setNotifications(prev => [newNotification, ...prev.slice(0, 49)]);
            setUnreadCount(prev => prev + 1);
            
            toast({
              title: newNotification.title,
              description: newNotification.message,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications
  };
};