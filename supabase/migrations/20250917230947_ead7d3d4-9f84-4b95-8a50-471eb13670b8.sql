-- CRITICAL SECURITY FIXES - Phase 1: Fix Existing Policies

-- 1. Fix Tips Table RLS Policies (CRITICAL)
-- Drop all existing policies first
DROP POLICY IF EXISTS "Anonymous users can create tips for valid artists" ON public.tips;
DROP POLICY IF EXISTS "Authenticated users can create tips for valid artists" ON public.tips;
DROP POLICY IF EXISTS "Artists can only view their own tips" ON public.tips;
DROP POLICY IF EXISTS "No deletes allowed on tips" ON public.tips;
DROP POLICY IF EXISTS "No updates allowed on tips" ON public.tips;

-- Create secure policies
CREATE POLICY "Only authenticated users can create tips"
ON public.tips
FOR INSERT
TO authenticated
WITH CHECK ((user_id IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM profiles
  WHERE (profiles.user_id = tips.user_id))));

CREATE POLICY "Artists can view their own tips"
ON public.tips
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all tips"
ON public.tips
FOR SELECT
TO authenticated
USING (is_admin());

CREATE POLICY "No tip modifications allowed"
ON public.tips
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "No tip deletions allowed"
ON public.tips
FOR DELETE
TO authenticated
USING (false);

-- 2. Secure Analytics Tables (CRITICAL)
-- Drop existing policies and create admin-only access
DROP POLICY IF EXISTS "Admins can manage analytics_daily" ON public.analytics_daily;
CREATE POLICY "Only admins can access analytics_daily"
ON public.analytics_daily
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can manage email campaigns" ON public.email_campaigns;
CREATE POLICY "Only admins can access email campaigns"
ON public.email_campaigns
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

DROP POLICY IF EXISTS "Admins can manage user cohorts" ON public.user_cohorts;
CREATE POLICY "Only admins can access user cohorts"
ON public.user_cohorts
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());