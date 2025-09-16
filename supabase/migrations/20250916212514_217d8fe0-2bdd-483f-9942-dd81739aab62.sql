-- Create promotional_banners table
CREATE TABLE public.promotional_banners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  button_text TEXT,
  button_url TEXT,
  background_color TEXT NOT NULL DEFAULT '#f8fafc',
  text_color TEXT NOT NULL DEFAULT '#1e293b',
  is_active BOOLEAN NOT NULL DEFAULT true,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  target_audience TEXT NOT NULL DEFAULT 'all' CHECK (target_audience IN ('all', 'premium', 'free')),
  priority INTEGER NOT NULL DEFAULT 5 CHECK (priority >= 1 AND priority <= 10),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by_user_id UUID
);

-- Enable Row Level Security
ALTER TABLE public.promotional_banners ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public can view active banners" 
ON public.promotional_banners 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage all banners" 
ON public.promotional_banners 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role IS NOT NULL
));

-- Create updated_at trigger
CREATE TRIGGER update_promotional_banners_updated_at
  BEFORE UPDATE ON public.promotional_banners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create email_campaigns table for email marketing
CREATE TABLE public.email_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  target_audience TEXT NOT NULL DEFAULT 'all' CHECK (target_audience IN ('all', 'premium', 'free', 'new_users')),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  recipients_count INTEGER DEFAULT 0,
  opened_count INTEGER DEFAULT 0,
  clicked_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by_user_id UUID
);

-- Enable RLS for email campaigns
ALTER TABLE public.email_campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage email campaigns" 
ON public.email_campaigns 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role IS NOT NULL
));

-- Create trigger for email campaigns
CREATE TRIGGER update_email_campaigns_updated_at
  BEFORE UPDATE ON public.email_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create push_notifications table
CREATE TABLE public.push_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  user_id UUID,
  target_audience TEXT NOT NULL DEFAULT 'all' CHECK (target_audience IN ('all', 'premium', 'free', 'specific_user')),
  notification_type TEXT NOT NULL DEFAULT 'general' CHECK (notification_type IN ('general', 'release', 'promotion', 'system')),
  is_read BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS for push notifications
ALTER TABLE public.push_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications" 
ON public.push_notifications 
FOR SELECT 
USING (
  user_id = auth.uid() OR 
  (user_id IS NULL AND target_audience IN ('all', 'premium', 'free'))
);

CREATE POLICY "Users can update their own notifications" 
ON public.push_notifications 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all notifications" 
ON public.push_notifications 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.user_id = auth.uid() 
  AND profiles.role IS NOT NULL
));

-- Insert some sample promotional banners
INSERT INTO public.promotional_banners (title, message, button_text, button_url, background_color, text_color, target_audience, priority) VALUES
('Welcome to Premium!', 'Unlock unlimited music, ad-free listening, and exclusive content. Upgrade today!', 'Go Premium', '/premium', '#3b82f6', '#ffffff', 'free', 8),
('New Release Alert', 'Fresh tracks just dropped! Check out the latest releases from your favorite artists.', 'Listen Now', '/', '#10b981', '#ffffff', 'all', 6),
('Limited Time Offer', 'Get 50% off your first month of Premium. This exclusive deal expires soon!', 'Claim Offer', '/premium', '#f59e0b', '#000000', 'free', 9);