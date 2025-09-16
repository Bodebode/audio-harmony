import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

export const useAdmin = () => {
  const { user, profile, isAuthenticated } = useAuth();

  // Check if user has admin role
  const { data: adminProfile, isLoading } = useQuery({
    queryKey: ['admin-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('role, is_admin')
        .eq('user_id', user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const isAdmin = adminProfile?.is_admin === true || 
    ['admin', 'editor', 'support'].includes(adminProfile?.role);
  const role = adminProfile?.role;
  
  const hasRole = (requiredRole: 'admin' | 'editor' | 'support') => {
    if (!role) return false;
    
    const roleHierarchy = {
      admin: ['admin', 'editor', 'support'],
      editor: ['editor', 'support'],
      support: ['support']
    };
    
    return roleHierarchy[requiredRole].includes(role);
  };

  return {
    isAdmin,
    role,
    hasRole,
    isLoading: isLoading,
    isAuthenticated: isAuthenticated && isAdmin,
  };
};