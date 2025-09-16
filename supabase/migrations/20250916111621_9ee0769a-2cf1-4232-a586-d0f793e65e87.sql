-- Fix security vulnerability: Restrict payment field updates to service role only
-- Remove the overly permissive policy
DROP POLICY IF EXISTS "System can update payment fields" ON public.profiles;

-- Create a secure policy that only allows service role to update payment fields
CREATE POLICY "Service role can update payment fields"
ON public.profiles
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- Create a function to check if current user can update payment fields
-- This will return true only for service role or in webhook context
CREATE OR REPLACE FUNCTION public.can_update_payment_fields()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  -- Only allow service role to update payment fields
  SELECT current_setting('role') = 'service_role';
$$;

-- Create a more restrictive policy for payment field updates from authenticated context
-- This ensures that regular users cannot update payment fields, only the service role can
CREATE POLICY "Restrict payment field updates to service role"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND NOT public.can_update_payment_fields())
WITH CHECK (
  auth.uid() = user_id AND 
  -- Prevent updates to payment fields by regular users
  (
    OLD.stripe_customer_id IS NOT DISTINCT FROM NEW.stripe_customer_id AND
    OLD.stripe_subscription_id IS NOT DISTINCT FROM NEW.stripe_subscription_id AND
    OLD.stripe_subscription_status IS NOT DISTINCT FROM NEW.stripe_subscription_status AND
    OLD.paypal_subscription_id IS NOT DISTINCT FROM NEW.paypal_subscription_id AND
    OLD.paypal_subscription_status IS NOT DISTINCT FROM NEW.paypal_subscription_status AND
    OLD.payment_method IS NOT DISTINCT FROM NEW.payment_method AND
    OLD.is_premium IS NOT DISTINCT FROM NEW.is_premium AND
    OLD.premium_expires_at IS NOT DISTINCT FROM NEW.premium_expires_at
  )
);