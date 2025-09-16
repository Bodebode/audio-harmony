-- Fix the security definer view issue by removing the view and using regular queries instead
DROP VIEW IF EXISTS analytics_overview;

-- Create a security definer function to get analytics overview instead of a view
CREATE OR REPLACE FUNCTION public.get_analytics_overview()
RETURNS TABLE (
  total_users BIGINT,
  premium_users BIGINT,
  active_users_30d BIGINT,
  total_plays_30d BIGINT,
  total_likes BIGINT,
  total_shares BIGINT,
  avg_session_duration NUMERIC,
  bounce_rate NUMERIC
)
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    COUNT(DISTINCT p.user_id) as total_users,
    COUNT(DISTINCT CASE WHEN p.is_premium THEN p.user_id END) as premium_users,
    COUNT(DISTINCT e.user_id) as active_users_30d,
    COUNT(e.id) FILTER (WHERE e.name = 'play_started') as total_plays_30d,
    COUNT(l.id) as total_likes,
    COUNT(s.id) as total_shares,
    COALESCE(AVG(us.duration_minutes), 0) as avg_session_duration,
    COALESCE(COUNT(us.id) FILTER (WHERE us.is_bounce), 0)::float / NULLIF(COUNT(us.id), 0) * 100 as bounce_rate
  FROM profiles p
  LEFT JOIN events e ON p.user_id = e.user_id 
    AND e.created_at >= NOW() - INTERVAL '30 days'
  LEFT JOIN likes l ON p.user_id = l.user_id
  LEFT JOIN shares s ON p.user_id = s.user_id
  LEFT JOIN user_sessions us ON p.user_id = us.user_id 
    AND us.start_time >= NOW() - INTERVAL '30 days';
$$;