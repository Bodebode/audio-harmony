import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  is_premium: boolean;
  premium_expires_at: string | null;
  is_admin?: boolean;
  role?: string;
  created_at: string;
  updated_at: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for guest mode in localStorage
    const guestMode = localStorage.getItem('guestMode') === 'true';
    setIsGuest(guestMode);

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Clear guest mode when user signs in
          localStorage.removeItem('guestMode');
          setIsGuest(false);
          
          // Fetch user profile
          setTimeout(async () => {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', session.user.id)
              .single();
            
            setProfile(profileData);
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        localStorage.removeItem('guestMode');
        setIsGuest(false);
        supabase
          .from('profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single()
          .then(({ data: profileData }) => {
            setProfile(profileData);
          });
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (contact: string, password: string, displayName?: string, contactMethod: 'email' | 'phone' = 'email') => {
    const redirectUrl = `${window.location.origin}/`;
    
    const signUpOptions = contactMethod === 'email' 
      ? {
          email: contact,
          password,
          options: {
            emailRedirectTo: redirectUrl,
            data: {
              display_name: displayName || contact.split('@')[0]
            }
          }
        }
      : {
          phone: contact,
          password,
          options: {
            data: {
              display_name: displayName || contact
            }
          }
        };
    
    const { error } = await supabase.auth.signUp(signUpOptions);

    if (!error) {
      // Silent success - confirmation needed
      toast({
        title: contactMethod === 'email' ? "Check your email" : "Check your phone",
        description: contactMethod === 'email' 
          ? "We've sent you a confirmation link to complete your registration."
          : "We've sent you a confirmation code to complete your registration.",
      });
    } else {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
    }

    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    // Silent - let UI handle auth state changes

    return { error };
  };

  const signInWithSocial = async (provider: 'google' | 'facebook' | 'twitter') => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl
      }
    });

    // Silent - let UI handle auth state changes

    return { error };
  };

  const continueAsGuest = () => {
    localStorage.setItem('guestMode', 'true');
    setIsGuest(true);
    // Silent guest mode entry
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      // Clear guest mode
      localStorage.removeItem('guestMode');
      setIsGuest(false);
      
      if (error) {
        console.error('Sign out error:', error);
        toast({
          title: "Sign out failed",
          description: error.message || "An unexpected error occurred during sign out",
          variant: "destructive",
        });
        return { error };
      }
      
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account",
      });
      
      return { error: null };
    } catch (err) {
      console.error('Unexpected sign out error:', err);
      const error = { message: 'An unexpected error occurred' };
      toast({
        title: "Sign out failed", 
        description: "An unexpected error occurred during sign out",
        variant: "destructive",
      });
      return { error };
    }
  };

  return {
    user,
    session,
    profile,
    loading,
    isGuest,
    signUp,
    signIn,
    signInWithSocial,
    continueAsGuest,
    signOut,
    isPremium: profile?.is_premium || false,
    isAuthenticated: !!user || isGuest
  };
};