-- Add missing stripe_customer_id column to profiles table
ALTER TABLE public.profiles ADD COLUMN stripe_customer_id TEXT;

-- Update support_submissions RLS policy to prevent access to anonymous donations
DROP POLICY IF EXISTS "Users can view their own support submissions" ON public.support_submissions;

CREATE POLICY "Users can view their own support submissions" 
ON public.support_submissions 
FOR SELECT 
USING (auth.uid() = user_id AND user_id IS NOT NULL);

-- Add policy for anonymous donations (admin access only)
CREATE POLICY "Anonymous donations are private" 
ON public.support_submissions 
FOR SELECT 
USING (user_id IS NULL AND false); -- Never allow access to anonymous donations via API