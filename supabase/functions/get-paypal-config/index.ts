import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const paypalClientId = Deno.env.get('PAYPAL_CLIENT_ID');
    const planId5 = Deno.env.get('PAYPAL_PLAN_ID_5');
    const planId10 = Deno.env.get('PAYPAL_PLAN_ID_10');
    const planId25 = Deno.env.get('PAYPAL_PLAN_ID_25');
    const planId100 = Deno.env.get('PAYPAL_PLAN_ID_100');

    if (!paypalClientId) {
      throw new Error('PayPal client ID not configured');
    }

    console.log('PayPal config requested', {
      clientId: paypalClientId ? 'configured' : 'missing',
      planIds: {
        5: planId5 ? 'configured' : 'missing',
        10: planId10 ? 'configured' : 'missing',
        25: planId25 ? 'configured' : 'missing',
        100: planId100 ? 'configured' : 'missing'
      }
    });

    return new Response(JSON.stringify({
      clientId: paypalClientId,
      planIds: {
        5: planId5,
        10: planId10,
        25: planId25,
        100: planId100
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in get-paypal-config function:', error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});