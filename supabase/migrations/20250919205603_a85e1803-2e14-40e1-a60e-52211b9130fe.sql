-- Fix anonymous donations RLS policy and currency issues

-- Drop the problematic anonymous donations policy
DROP POLICY IF EXISTS "Anonymous donations are private" ON public.support_submissions;

-- Create proper policies for anonymous donations
CREATE POLICY "Anyone can create support submissions" 
ON public.support_submissions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can view their own support submissions" 
ON public.support_submissions 
FOR SELECT 
USING (
  (auth.uid() = user_id AND user_id IS NOT NULL) OR 
  (user_id IS NULL AND false) -- Anonymous donations remain private for viewing
);

-- Update currency default from USD to GBP to match application logic
ALTER TABLE public.support_submissions 
ALTER COLUMN currency SET DEFAULT 'GBP';