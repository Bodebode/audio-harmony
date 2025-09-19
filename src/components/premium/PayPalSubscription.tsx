import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Zap } from "lucide-react";
import PayPalButton from "@/components/PayPalButton";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { usePricing } from "@/hooks/usePricing";

const PayPalSubscription = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const { discountedFormatted, originalFormatted, savingsPercentage } = usePricing();

  const handlePayPalSuccess = async (data: any) => {
    try {
      console.log('PayPal subscription success:', data);
      
      // Update user profile with premium status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          is_premium: true,
          premium_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
        })
        .eq('user_id', user?.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        throw profileError;
      }

      // Store payment info in secure table
      const { error: paymentError } = await supabase
        .from('user_payment_info')
        .upsert({
          user_id: user?.id,
          paypal_subscription_id: data.subscriptionID,
          paypal_subscription_status: 'active',
          payment_method: 'paypal'
        }, {
          onConflict: 'user_id'
        });

      if (paymentError) {
        console.error('Error storing payment info:', paymentError);
        // Don't throw here as the main premium status update succeeded
      }

      toast({
        title: "Welcome to Premium! 🎉",
        description: "Your PayPal subscription is now active. Enjoy all premium features!",
      });

      // Refresh the page to update the UI
      window.location.reload();
    } catch (error) {
      console.error('Error processing PayPal subscription:', error);
      toast({
        title: "Subscription Error",
        description: "There was an issue activating your subscription. Please contact support.",
        variant: "destructive"
      });
    }
  };

  const handlePayPalError = (err: any) => {
    console.error('PayPal subscription error:', err);
    toast({
      title: "Payment Error",
      description: "There was an issue processing your PayPal payment. Please try again.",
      variant: "destructive"
    });
  };

  return (
    <Card className="glass-card border-white/20">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-blue-500/20 rounded-full">
            <Crown className="h-6 w-6 text-blue-400" />
          </div>
        </div>
        <CardTitle className="text-white text-2xl">PayPal Premium</CardTitle>
        <CardDescription className="text-white/70">
          Subscribe with PayPal for premium access
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Pricing */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl font-bold text-white">{discountedFormatted}</span>
            <span className="text-white/60">/month</span>
          </div>
          {savingsPercentage > 0 && (
            <div className="flex items-center justify-center gap-2">
              <span className="text-white/60 line-through text-lg">{originalFormatted}</span>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                Save {savingsPercentage}%
              </Badge>
            </div>
          )}
        </div>


        {/* PayPal Subscription Button */}
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-white/70 text-sm mb-4">
              Secure subscription through PayPal
            </p>
          </div>
          
          <PayPalButton
            planId="P-8PT12092UY4684013NDEMAQQ" // Main premium subscription plan
            color="blue"
            style="subscription"
            onApprove={handlePayPalSuccess}
            onError={handlePayPalError}
          />
        </div>

        {/* Terms */}
        <div className="text-center text-xs text-white/60 pt-4 border-t border-white/20">
          <p>
            Cancel anytime • No hidden fees
          </p>
          <p className="mt-1">
            By subscribing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayPalSubscription;