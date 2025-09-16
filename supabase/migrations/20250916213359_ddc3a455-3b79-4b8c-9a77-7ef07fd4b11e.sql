-- Create analytics aggregation tables for better performance
CREATE TABLE public.analytics_daily (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  date DATE NOT NULL,
  total_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  premium_users INTEGER DEFAULT 0,
  total_plays INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  total_shares INTEGER DEFAULT 0,
  average_session_duration_minutes NUMERIC DEFAULT 0,
  bounce_rate NUMERIC DEFAULT 0,
  conversion_rate NUMERIC DEFAULT 0,
  revenue NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(date)
);

-- Create user sessions table for better session tracking
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER DEFAULT 0,
  pages_visited INTEGER DEFAULT 1,
  actions_count INTEGER DEFAULT 0,
  device_type TEXT,
  country TEXT,
  city TEXT,
  referrer TEXT,
  is_bounce BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user journeys table for user flow analysis
CREATE TABLE public.user_journeys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  session_id TEXT NOT NULL,
  step_number INTEGER NOT NULL,
  page_path TEXT NOT NULL,
  action_type TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create cohort analysis table
CREATE TABLE public.user_cohorts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cohort_month DATE NOT NULL,
  user_id UUID NOT NULL,
  first_activity_date DATE NOT NULL,
  is_retained_month_1 BOOLEAN DEFAULT false,
  is_retained_month_3 BOOLEAN DEFAULT false,
  is_retained_month_6 BOOLEAN DEFAULT false,
  lifetime_value NUMERIC DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  total_plays INTEGER DEFAULT 0,
  conversion_date DATE,
  churn_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(cohort_month, user_id)
);

-- Enable RLS on new tables
ALTER TABLE public.analytics_daily ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_cohorts ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics tables (admin only for most)
CREATE POLICY "Admins can manage analytics_daily" 
ON public.analytics_daily 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role IS NOT NULL
));

CREATE POLICY "Users can insert their own sessions" 
ON public.user_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can view all sessions" 
ON public.user_sessions 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role IS NOT NULL
));

CREATE POLICY "Users can insert their own journey steps" 
ON public.user_journeys 
FOR INSERT 
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Admins can view all user journeys" 
ON public.user_journeys 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role IS NOT NULL
));

CREATE POLICY "Admins can manage user cohorts" 
ON public.user_cohorts 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role IS NOT NULL
));

-- Create indexes for better performance
CREATE INDEX idx_analytics_daily_date ON public.analytics_daily(date);
CREATE INDEX idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX idx_user_sessions_start_time ON public.user_sessions(start_time);
CREATE INDEX idx_user_journeys_user_id ON public.user_journeys(user_id);
CREATE INDEX idx_user_journeys_session_id ON public.user_journeys(session_id);
CREATE INDEX idx_user_cohorts_cohort_month ON public.user_cohorts(cohort_month);
CREATE INDEX idx_events_name_created_at ON public.events(name, created_at);

-- Add updated_at triggers
CREATE TRIGGER update_analytics_daily_updated_at
  BEFORE UPDATE ON public.analytics_daily
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_sessions_updated_at
  BEFORE UPDATE ON public.user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_cohorts_updated_at
  BEFORE UPDATE ON public.user_cohorts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create analytics views for common queries
CREATE OR REPLACE VIEW analytics_overview AS
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

-- Insert sample daily analytics data for the last 30 days
INSERT INTO public.analytics_daily (date, total_users, active_users, new_users, premium_users, total_plays, total_likes, total_shares, average_session_duration_minutes, bounce_rate, conversion_rate, revenue)
SELECT 
  generate_series(CURRENT_DATE - INTERVAL '29 days', CURRENT_DATE, INTERVAL '1 day')::date as date,
  FLOOR(random() * 100 + 500) as total_users,
  FLOOR(random() * 80 + 200) as active_users,
  FLOOR(random() * 20 + 10) as new_users,
  FLOOR(random() * 50 + 100) as premium_users,
  FLOOR(random() * 1000 + 500) as total_plays,
  FLOOR(random() * 200 + 100) as total_likes,
  FLOOR(random() * 50 + 25) as total_shares,
  random() * 20 + 10 as average_session_duration_minutes,
  random() * 30 + 20 as bounce_rate,
  random() * 10 + 15 as conversion_rate,
  random() * 1000 + 500 as revenue;