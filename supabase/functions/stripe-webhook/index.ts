import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://rqvwqdzvsztzkbcvvpqj.supabase.co',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get('Stripe_key');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!stripeKey || !supabaseUrl || !supabaseServiceKey || !webhookSecret) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      throw new Error('No Stripe signature header');
    }

    // Verify webhook signature for security
    let event;
    try {
      // Create a simple signature verification
      const elements = signature.split(',');
      const signatureElements = elements.reduce((acc, element) => {
        const [key, value] = element.split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

      const timestamp = signatureElements.t;
      const receivedSignature = signatureElements.v1;

      if (!timestamp || !receivedSignature) {
        throw new Error('Invalid signature format');
      }

      // Create expected signature
      const payload = timestamp + '.' + body;
      const expectedSignature = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(webhookSecret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      ).then(key => 
        crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))
      ).then(signature => 
        Array.from(new Uint8Array(signature))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('')
      );

      if (expectedSignature !== receivedSignature) {
        throw new Error('Signature mismatch');
      }

      // Parse the verified webhook payload
      event = JSON.parse(body);
      console.log('Webhook signature verified successfully');
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      throw new Error('Webhook signature verification failed: ' + err.message);
    }

    console.log('Received webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const userId = session.client_reference_id || session.metadata?.user_id;
        
        if (userId && session.customer) {
          // Update profile with Stripe customer ID
          await supabase
            .from('profiles')
            .update({ 
              stripe_customer_id: session.customer,
              payment_method: 'stripe'
            })
            .eq('user_id', userId);
          
          console.log('Updated profile with Stripe customer ID:', session.customer);
        }
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object;
        
        // Find user by Stripe customer ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('stripe_customer_id', subscription.customer)
          .single();

        if (profile) {
          const isActive = subscription.status === 'active' || subscription.status === 'trialing';
          const expiresAt = subscription.current_period_end 
            ? new Date(subscription.current_period_end * 1000).toISOString()
            : null;

          await supabase
            .from('profiles')
            .update({
              is_premium: isActive,
              premium_expires_at: expiresAt,
              stripe_subscription_id: subscription.id,
              stripe_subscription_status: subscription.status,
            })
            .eq('user_id', profile.user_id);

          console.log(`Updated subscription for user ${profile.user_id}:`, {
            is_premium: isActive,
            status: subscription.status,
            expires_at: expiresAt
          });
        }
        break;

      case 'customer.subscription.deleted':
        const canceledSubscription = event.data.object;
        
        // Find user by Stripe customer ID
        const { data: canceledProfile } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('stripe_customer_id', canceledSubscription.customer)
          .single();

        if (canceledProfile) {
          await supabase
            .from('profiles')
            .update({
              is_premium: false,
              premium_expires_at: null,
              stripe_subscription_status: 'canceled',
            })
            .eq('user_id', canceledProfile.user_id);

          console.log(`Canceled subscription for user ${canceledProfile.user_id}`);
        }
        break;

      default:
        console.log('Unhandled webhook event type:', event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in stripe-webhook function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});