-- Comprehensive security fix for tips table to protect customer payment data

-- First, drop existing policies to recreate them with stricter security
DROP POLICY IF EXISTS "Anonymous users can create tips for artists" ON public.tips;
DROP POLICY IF EXISTS "Artists can view tips sent to them" ON public.tips;
DROP POLICY IF EXISTS "Authenticated users can create tips with their user_id" ON public.tips;

-- Create ultra-strict RLS policies for tips table

-- 1. Only allow the artist (user_id) to view their own tips
-- This ensures no other user can access sensitive payment/personal data
CREATE POLICY "Artists can only view their own tips"
ON public.tips
FOR SELECT
USING (auth.uid() = user_id);

-- 2. Allow anonymous users to create tips for valid artists only
-- This verifies the artist exists before allowing tip creation
CREATE POLICY "Anonymous users can create tips for valid artists"
ON public.tips
FOR INSERT
WITH CHECK (
  user_id IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = tips.user_id
  )
);

-- 3. Allow authenticated users to create tips for any valid artist
-- Including themselves (self-tips) but must specify valid artist
CREATE POLICY "Authenticated users can create tips for valid artists"
ON public.tips
FOR INSERT
TO authenticated
WITH CHECK (
  user_id IS NOT NULL 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = tips.user_id
  )
);

-- 4. Explicitly deny all UPDATE operations on tips
-- Payment/tip data should be immutable once created
CREATE POLICY "No updates allowed on tips"
ON public.tips
FOR UPDATE
USING (false);

-- 5. Explicitly deny all DELETE operations on tips  
-- Payment/tip data should be permanent for audit trails
CREATE POLICY "No deletes allowed on tips"
ON public.tips
FOR DELETE
USING (false);

-- 6. Add additional security constraint to ensure user_id is never null
-- This prevents orphaned tips that could bypass RLS
ALTER TABLE public.tips 
ALTER COLUMN user_id SET NOT NULL;

-- 7. Create index for performance on the security-critical user_id column
CREATE INDEX IF NOT EXISTS idx_tips_user_id_security ON public.tips(user_id);

-- 8. Add comment documenting the security model
COMMENT ON TABLE public.tips IS 'Contains sensitive customer payment data. RLS policies ensure only the recipient artist can view tips. No updates/deletes allowed to maintain audit trail.';

-- 9. Create a security function to validate tip data access
CREATE OR REPLACE FUNCTION public.validate_tip_access(tip_user_id uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT auth.uid() = tip_user_id;
$$;