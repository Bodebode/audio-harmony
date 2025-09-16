-- Security fixes for RLS policies and data integrity

-- 1. Make user_id NOT NULL in tips table to prevent orphaned records
ALTER TABLE public.tips ALTER COLUMN user_id SET NOT NULL;

-- 2. Add more restrictive RLS policies for tips table

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Anyone can create tips" ON public.tips;
DROP POLICY IF EXISTS "Tips are viewable by the artist" ON public.tips;

-- Create more secure policies
CREATE POLICY "Authenticated users can create tips with their user_id" 
ON public.tips 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Artists can view tips sent to them" 
ON public.tips 
FOR SELECT 
TO authenticated
USING (user_id = auth.uid());

-- 3. Add policy to allow anonymous tip creation (for guest users who want to tip)
-- This allows anonymous users to create tips but they must specify a valid user_id of the artist
CREATE POLICY "Anonymous users can create tips for artists" 
ON public.tips 
FOR INSERT 
TO anon
WITH CHECK (
  user_id IS NOT NULL AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = tips.user_id)
);

-- 4. Strengthen profiles table policies to prevent unauthorized updates to payment fields
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create separate policies for different types of updates
CREATE POLICY "Users can update basic profile info" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id AND 
  -- Prevent users from updating payment-related fields directly
  stripe_customer_id = OLD.stripe_customer_id AND
  stripe_subscription_id = OLD.stripe_subscription_id AND 
  stripe_subscription_status = OLD.stripe_subscription_status AND
  paypal_subscription_id = OLD.paypal_subscription_id AND
  paypal_subscription_status = OLD.paypal_subscription_status AND
  is_premium = OLD.is_premium AND
  premium_expires_at = OLD.premium_expires_at
);

-- 5. Create a policy for system updates to payment fields (used by webhooks)
CREATE POLICY "System can update payment fields" 
ON public.profiles 
FOR UPDATE 
TO service_role
USING (true)
WITH CHECK (true);