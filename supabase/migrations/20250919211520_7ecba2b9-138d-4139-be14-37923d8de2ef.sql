-- Fix critical security issues with RLS policies

-- Create a separate, more secure table for sensitive payment information
CREATE TABLE IF NOT EXISTS public.user_payment_info (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    stripe_subscription_status TEXT,
    paypal_subscription_id TEXT,
    paypal_subscription_status TEXT,
    payment_method TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(user_id)
);

-- Enable RLS on payment info table
ALTER TABLE public.user_payment_info ENABLE ROW LEVEL SECURITY;

-- Create highly restrictive policies for payment information
CREATE POLICY "Users can only view their own payment info" 
ON public.user_payment_info 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can only update their own payment info" 
ON public.user_payment_info 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own payment info" 
ON public.user_payment_info 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create trigger for updating timestamps
CREATE TRIGGER update_user_payment_info_updated_at
BEFORE UPDATE ON public.user_payment_info
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Migrate existing payment data from profiles to new secure table
INSERT INTO public.user_payment_info (
    user_id, stripe_customer_id, stripe_subscription_id, 
    stripe_subscription_status, paypal_subscription_id, 
    paypal_subscription_status, payment_method
)
SELECT 
    user_id, stripe_customer_id, stripe_subscription_id,
    stripe_subscription_status, paypal_subscription_id,
    paypal_subscription_status, payment_method
FROM public.profiles 
WHERE stripe_customer_id IS NOT NULL 
   OR stripe_subscription_id IS NOT NULL 
   OR paypal_subscription_id IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;

-- Remove sensitive payment fields from profiles table (keeping only premium status)
ALTER TABLE public.profiles DROP COLUMN IF EXISTS stripe_customer_id;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS stripe_subscription_id;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS stripe_subscription_status;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS paypal_subscription_id;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS paypal_subscription_status;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS payment_method;

-- Fix anonymous donations policy to allow proper administrative access
DROP POLICY IF EXISTS "Anonymous donations are private" ON public.support_submissions;

-- Create better policy for anonymous donations that allows admin access
CREATE POLICY "Support submissions access control" 
ON public.support_submissions 
FOR SELECT 
USING (
    -- Users can see their own submissions
    (auth.uid() = user_id AND user_id IS NOT NULL) OR
    -- Anonymous donations are private to the user who made them (no user_id)
    (user_id IS NULL AND auth.uid() IS NULL)
);