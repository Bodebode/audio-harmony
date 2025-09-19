-- Fix conflicting RLS policies that block anonymous donations
DROP POLICY IF EXISTS "Users can create support submissions" ON public.support_submissions;

-- Keep only the policy that allows anyone (including anonymous users) to create submissions
-- The existing "Anyone can create support submissions" policy with check expression "true" will handle this