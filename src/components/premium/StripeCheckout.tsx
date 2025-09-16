import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

interface StripeCheckoutProps {
  priceId?: string;
  className?: string;
  children?: React.ReactNode;
}

export const StripeCheckout = ({ priceId, className, children }: StripeCheckoutProps) => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please sign in to continue");
      return;
    }

    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        body: { 
          priceId: priceId || 'price_1QbRpCD7z6BpKOhPYEFiMJed',
          customerId: null 
        }
      });

      if (error) {
        console.error('Stripe checkout error:', error);
        toast.error("Failed to create checkout session");
        return;
      }

      if (data?.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        toast.error("No checkout URL received");
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleCheckout}
      disabled={loading}
      className={className}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" />
          {children || "Pay with Stripe"}
        </>
      )}
    </Button>
  );
};