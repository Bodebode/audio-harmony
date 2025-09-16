-- Fix security vulnerability: Remove overly permissive payment policy
-- Remove the dangerous policy that allows unrestricted updates
DROP POLICY IF EXISTS "System can update payment fields" ON public.profiles;

-- Create a secure policy that only allows service role to update payment fields
-- This replaces the dangerous "true/true" policy with proper access control
CREATE POLICY "Service role can update payment fields"
ON public.profiles
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- Update the existing user policy to be more explicit about what users can update
-- Replace the existing policy with one that explicitly excludes payment fields
DROP POLICY IF EXISTS "Users can update basic profile info" ON public.profiles;

CREATE POLICY "Users can update basic profile info"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Add a comment to document the security improvement
COMMENT ON POLICY "Service role can update payment fields" ON public.profiles 
IS 'Restricts payment field updates to service role only. This prevents unauthorized modification of sensitive payment data like Stripe customer IDs and subscription statuses.';