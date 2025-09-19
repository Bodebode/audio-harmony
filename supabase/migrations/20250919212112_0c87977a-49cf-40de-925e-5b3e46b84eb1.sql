-- Fix anonymous support submissions privacy exposure
DROP POLICY IF EXISTS "Support submissions access control" ON public.support_submissions;

-- Create secure policy that prevents anonymous users from seeing other anonymous donations
CREATE POLICY "Users can view only their own support submissions" 
ON public.support_submissions 
FOR SELECT 
USING (
    -- Authenticated users can see their own submissions
    (auth.uid() = user_id AND user_id IS NOT NULL)
);

-- Anonymous users can still create submissions but cannot view any
-- This prevents exposure of other donors' information