import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface UserPaymentInfo {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_subscription_status: string | null;
  paypal_subscription_id: string | null;
  paypal_subscription_status: string | null;
  payment_method: string | null;
  created_at: string;
  updated_at: string;
}

export const useUserPaymentInfo = () => {
  const [paymentInfo, setPaymentInfo] = useState<UserPaymentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      if (!user) {
        setPaymentInfo(null);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_payment_info')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching payment info:', error);
          setPaymentInfo(null);
        } else {
          setPaymentInfo(data);
        }
      } catch (error) {
        console.error('Unexpected error fetching payment info:', error);
        setPaymentInfo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentInfo();
  }, [user]);

  const updatePaymentInfo = async (updates: Partial<Omit<UserPaymentInfo, 'id' | 'user_id' | 'created_at' | 'updated_at'>>) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('user_payment_info')
        .upsert({
          user_id: user.id,
          ...updates
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) {
        console.error('Error updating payment info:', error);
        return null;
      }

      setPaymentInfo(data);
      return data;
    } catch (error) {
      console.error('Unexpected error updating payment info:', error);
      return null;
    }
  };

  return {
    paymentInfo,
    loading,
    updatePaymentInfo
  };
};