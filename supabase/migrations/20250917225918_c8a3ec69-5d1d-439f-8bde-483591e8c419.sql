-- Create a SECURITY DEFINER function to determine admin status without triggering RLS recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles p
    WHERE p.user_id = auth.uid()
      AND (p.is_admin = true OR p.role IN ('admin','editor','support'))
  );
$$;

-- PROFILES: Replace recursive admin policy with function-based check
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.is_admin());

-- LIKES: Admins can view all likes
DROP POLICY IF EXISTS "Admins can view all likes" ON public.likes;
CREATE POLICY "Admins can view all likes"
ON public.likes
FOR SELECT
USING (public.is_admin());

-- ENTITLEMENTS: Admins can manage all entitlements
DROP POLICY IF EXISTS "Admins can manage all entitlements" ON public.entitlements;
CREATE POLICY "Admins can manage all entitlements"
ON public.entitlements
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ANALYTICS_DAILY: Admins can manage
DROP POLICY IF EXISTS "Admins can manage analytics_daily" ON public.analytics_daily;
CREATE POLICY "Admins can manage analytics_daily"
ON public.analytics_daily
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- EMAIL_CAMPAIGNS: Admins can manage
DROP POLICY IF EXISTS "Admins can manage email campaigns" ON public.email_campaigns;
CREATE POLICY "Admins can manage email campaigns"
ON public.email_campaigns
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- TRACKS: Admins can manage all tracks
DROP POLICY IF EXISTS "Admins can manage all tracks" ON public.tracks;
CREATE POLICY "Admins can manage all tracks"
ON public.tracks
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- PUSH_NOTIFICATIONS: Admins can manage all
DROP POLICY IF EXISTS "Admins can manage all notifications" ON public.push_notifications;
CREATE POLICY "Admins can manage all notifications"
ON public.push_notifications
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- USER_JOURNEYS: Admins can view all
DROP POLICY IF EXISTS "Admins can view all user journeys" ON public.user_journeys;
CREATE POLICY "Admins can view all user journeys"
ON public.user_journeys
FOR SELECT
USING (public.is_admin());

-- USER_COHORTS: Admins can manage
DROP POLICY IF EXISTS "Admins can manage user cohorts" ON public.user_cohorts;
CREATE POLICY "Admins can manage user cohorts"
ON public.user_cohorts
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- WHITELISTS: Admins can manage
DROP POLICY IF EXISTS "Admins can manage whitelists" ON public.whitelists;
CREATE POLICY "Admins can manage whitelists"
ON public.whitelists
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- EVENTS: Admins can view all events
DROP POLICY IF EXISTS "Admins can view all events" ON public.events;
CREATE POLICY "Admins can view all events"
ON public.events
FOR SELECT
USING (public.is_admin());

-- PROMOTIONAL_BANNERS: Admins can manage all
DROP POLICY IF EXISTS "Admins can manage all banners" ON public.promotional_banners;
CREATE POLICY "Admins can manage all banners"
ON public.promotional_banners
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- SHARES: Admins can view all shares
DROP POLICY IF EXISTS "Admins can view all shares" ON public.shares;
CREATE POLICY "Admins can view all shares"
ON public.shares
FOR SELECT
USING (public.is_admin());

-- USER_SESSIONS: Admins can view all sessions
DROP POLICY IF EXISTS "Admins can view all sessions" ON public.user_sessions;
CREATE POLICY "Admins can view all sessions"
ON public.user_sessions
FOR SELECT
USING (public.is_admin());

-- RELEASES: Admins can manage all releases
DROP POLICY IF EXISTS "Admins can manage all releases" ON public.releases;
CREATE POLICY "Admins can manage all releases"
ON public.releases
FOR ALL
USING (public.is_admin())
WITH CHECK (public.is_admin());
