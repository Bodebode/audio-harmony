-- CRITICAL SECURITY FIXES - Phase 2: User Data Protection

-- 3. Secure User Tracking Tables
-- Fix user_sessions - users should only see their own data
DROP POLICY IF EXISTS "Users can insert their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Admins can view all sessions" ON public.user_sessions;

CREATE POLICY "Users can insert their own sessions"
ON public.user_sessions
FOR INSERT
TO authenticated
WITH CHECK ((auth.uid() = user_id) OR (user_id IS NULL));

CREATE POLICY "Users can view their own sessions"
ON public.user_sessions
FOR SELECT
TO authenticated
USING ((auth.uid() = user_id) OR is_admin());

-- Fix user_journeys - users should only see their own data  
DROP POLICY IF EXISTS "Users can insert their own journey steps" ON public.user_journeys;
DROP POLICY IF EXISTS "Admins can view all user journeys" ON public.user_journeys;

CREATE POLICY "Users can insert their own journeys"
ON public.user_journeys
FOR INSERT
TO authenticated
WITH CHECK ((auth.uid() = user_id) OR (user_id IS NULL));

CREATE POLICY "Users can view their own journeys"  
ON public.user_journeys
FOR SELECT
TO authenticated
USING ((auth.uid() = user_id) OR is_admin());

-- 4. Secure Events Table - users should only see their own events
DROP POLICY IF EXISTS "Users can insert their own events" ON public.events;
DROP POLICY IF EXISTS "Admins can view all events" ON public.events;

CREATE POLICY "Users can insert their own events"
ON public.events
FOR INSERT
TO authenticated
WITH CHECK ((auth.uid() = user_id) OR (user_id IS NULL));

CREATE POLICY "Users can view their own events"
ON public.events
FOR SELECT
TO authenticated
USING ((auth.uid() = user_id) OR is_admin());

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
  
  -- Log the action
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