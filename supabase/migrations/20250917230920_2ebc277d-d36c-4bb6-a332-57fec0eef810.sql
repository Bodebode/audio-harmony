-- CRITICAL SECURITY FIXES

-- 1. Fix Tips Table RLS Policies (CRITICAL)
-- Remove the overly permissive anonymous policy
DROP POLICY IF EXISTS "Anonymous users can create tips for valid artists" ON public.tips;

-- Update the policy to be more restrictive - only authenticated users
CREATE POLICY "Authenticated users can create tips for valid artists"
ON public.tips
FOR INSERT
TO authenticated
WITH CHECK ((user_id IS NOT NULL) AND (EXISTS ( SELECT 1
   FROM profiles
  WHERE (profiles.user_id = tips.user_id))));

-- Add admin policy for tips management
CREATE POLICY "Admins can manage all tips"
ON public.tips
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- 2. Secure Analytics Tables (CRITICAL)
-- Make analytics_daily admin-only
DROP POLICY IF EXISTS "Admins can manage analytics_daily" ON public.analytics_daily;
CREATE POLICY "Only admins can access analytics_daily"
ON public.analytics_daily
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Make email_campaigns admin-only  
DROP POLICY IF EXISTS "Admins can manage email campaigns" ON public.email_campaigns;
CREATE POLICY "Only admins can access email campaigns"
ON public.email_campaigns
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- Make user_cohorts admin-only
DROP POLICY IF EXISTS "Admins can manage user cohorts" ON public.user_cohorts;
CREATE POLICY "Only admins can access user cohorts"
ON public.user_cohorts
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- 3. Secure User Tracking Tables
-- Fix user_sessions - users should only see their own data
DROP POLICY IF EXISTS "Users can insert their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Admins can view all sessions" ON public.user_sessions;

CREATE POLICY "Users can manage their own sessions"
ON public.user_sessions
FOR ALL
TO authenticated
USING ((auth.uid() = user_id) OR is_admin())
WITH CHECK ((auth.uid() = user_id) OR (user_id IS NULL));

-- Fix user_journeys - users should only see their own data  
DROP POLICY IF EXISTS "Users can insert their own journey steps" ON public.user_journeys;
DROP POLICY IF EXISTS "Admins can view all user journeys" ON public.user_journeys;

CREATE POLICY "Users can manage their own journeys"
ON public.user_journeys
FOR ALL  
TO authenticated
USING ((auth.uid() = user_id) OR is_admin())
WITH CHECK ((auth.uid() = user_id) OR (user_id IS NULL));

-- 4. Secure Events Table - users should only see their own events
DROP POLICY IF EXISTS "Users can insert their own events" ON public.events;
DROP POLICY IF EXISTS "Admins can view all events" ON public.events;

CREATE POLICY "Users can manage their own events"
ON public.events
FOR ALL
TO authenticated  
USING ((auth.uid() = user_id) OR is_admin())
WITH CHECK ((auth.uid() = user_id) OR (user_id IS NULL));

-- 5. Add audit logging function for admin actions
CREATE OR REPLACE FUNCTION public.log_admin_action(
  action_type text,
  target_user_id uuid,
  details jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow if user is admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  -- Log the action (could extend to create audit table later)
  INSERT INTO events (user_id, name, properties, created_at)
  VALUES (
    auth.uid(),
    'admin_action',
    jsonb_build_object(
      'action_type', action_type,
      'target_user_id', target_user_id,
      'details', details,
      'timestamp', now()
    ),
    now()
  );
END;
$$;

-- 6. Enhanced admin role validation function
CREATE OR REPLACE FUNCTION public.can_manage_admin_roles()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  -- Only existing admins can manage admin roles
  SELECT is_admin();
$$;