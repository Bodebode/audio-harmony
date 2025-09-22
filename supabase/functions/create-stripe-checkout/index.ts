import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { priceId, customerId } = await req.json();
    const stripeKey = Deno.env.get('Stripe_key');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!stripeKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables');
    }

    // Get user from JWT token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const jwt = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(jwt);
    
    if (userError || !user) {
      throw new Error('Invalid user token');
    }

    // Get or create customer profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    let stripeCustomerId = profile?.stripe_customer_id;

    // Create Stripe checkout session
    const origin = req.headers.get('origin') || 'https://6df20c05-96cb-44a7-923d-cadad2c9355e.lovableproject.com';
    
    const sessionData: any = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: priceId || 'price_1QbRpCD7z6BpKOhPYEFiMJed',
        quantity: 1,
      }],
      success_url: `${origin}/premium?success=true`,
      cancel_url: `${origin}/premium?canceled=true`,
      client_reference_id: user.id,
      metadata: {
        user_id: user.id,
      },
    };

    // Only set customer OR customer_email, never both
    if (stripeCustomerId) {
      sessionData.customer = stripeCustomerId;
    } else {
      sessionData.customer_email = user.email;
    }

    // Convert to URLSearchParams properly
    const formData = new URLSearchParams();
    formData.append('mode', sessionData.mode);
    formData.append('payment_method_types[0]', 'card');
    formData.append('line_items[0][price]', sessionData.line_items[0].price);
    formData.append('line_items[0][quantity]', sessionData.line_items[0].quantity.toString());
    formData.append('success_url', sessionData.success_url);
    formData.append('cancel_url', sessionData.cancel_url);
    formData.append('client_reference_id', sessionData.client_reference_id);
    formData.append('metadata[user_id]', sessionData.metadata.user_id);
    
    if (sessionData.customer) {
      formData.append('customer', sessionData.customer);
    } else if (sessionData.customer_email) {
      formData.append('customer_email', sessionData.customer_email);
    }

    const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${stripeKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Stripe API error:', errorText);
      throw new Error(`Stripe API error: ${response.status}`);
    }

    const session = await response.json();
    
    console.log('Checkout session created:', session.id);

    return new Response(JSON.stringify({ 
      sessionId: session.id,
      url: session.url 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in create-stripe-checkout function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});