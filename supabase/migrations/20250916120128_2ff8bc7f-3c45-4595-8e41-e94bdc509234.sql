-- AlkePlay CRM Admin Phase 1: Core Schema
-- Create core music data model and admin infrastructure

-- Create enum types
CREATE TYPE public.release_type AS ENUM ('album', 'single', 'ep');
CREATE TYPE public.release_status AS ENUM ('draft', 'scheduled', 'live', 'archived');
CREATE TYPE public.track_status AS ENUM ('uploaded', 'transcoding', 'ready', 'failed');
CREATE TYPE public.entitlement_kind AS ENUM ('subscription', 'whitelist', 'trial', 'purchase');
CREATE TYPE public.admin_role AS ENUM ('admin', 'editor', 'support');

-- Add role to existing profiles table
ALTER TABLE public.profiles ADD COLUMN role public.admin_role DEFAULT NULL;
ALTER TABLE public.profiles ADD COLUMN is_admin boolean DEFAULT FALSE;

-- Create releases table
CREATE TABLE public.releases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  cover_url TEXT,
  release_type public.release_type NOT NULL DEFAULT 'album',
  status public.release_status NOT NULL DEFAULT 'draft',
  release_date TIMESTAMP WITH TIME ZONE,
  preview_only BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by_user_id UUID
);

-- Create tracks table
CREATE TABLE public.tracks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  release_id UUID REFERENCES public.releases(id) ON DELETE CASCADE,
  isrc TEXT,
  duration_sec INTEGER,
  explicit BOOLEAN DEFAULT FALSE,
  hls_master_url TEXT,
  audio_file_url TEXT,
  status public.track_status NOT NULL DEFAULT 'uploaded',
  track_number INTEGER,
  lyrics TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create entitlements table
CREATE TABLE public.entitlements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  kind public.entitlement_kind NOT NULL,
  release_id UUID REFERENCES public.releases(id) ON DELETE CASCADE,
  starts_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ends_at TIMESTAMP WITH TIME ZONE,
  source TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table for analytics
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  name TEXT NOT NULL,
  properties JSONB DEFAULT '{}',
  device TEXT,
  app_version TEXT,
  country TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create whitelists table
CREATE TABLE public.whitelists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  release_id UUID REFERENCES public.releases(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  added_by_admin_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create likes table  
CREATE TABLE public.likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  track_id UUID REFERENCES public.tracks(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, track_id)
);

-- Create shares table
CREATE TABLE public.shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  track_id UUID REFERENCES public.tracks(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.releases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whitelists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shares ENABLE ROW LEVEL SECURITY;

-- RLS Policies for releases (admin can manage, users can view live releases)
CREATE POLICY "Admins can manage all releases"
ON public.releases
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IS NOT NULL
  )
);

CREATE POLICY "Users can view live releases"
ON public.releases
FOR SELECT
TO authenticated
USING (status = 'live');

CREATE POLICY "Public can view live releases"
ON public.releases
FOR SELECT
TO anon
USING (status = 'live');

-- RLS Policies for tracks
CREATE POLICY "Admins can manage all tracks"
ON public.tracks
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IS NOT NULL
  )
);

CREATE POLICY "Users can view tracks from live releases"
ON public.tracks
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.releases 
    WHERE releases.id = tracks.release_id 
    AND releases.status = 'live'
  )
);

-- RLS Policies for entitlements
CREATE POLICY "Users can view their own entitlements"
ON public.entitlements
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all entitlements"
ON public.entitlements
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IS NOT NULL
  )
);

CREATE POLICY "Service role can manage entitlements"
ON public.entitlements
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- RLS Policies for events
CREATE POLICY "Users can insert their own events"
ON public.events
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all events"
ON public.events
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IS NOT NULL
  )
);

-- RLS Policies for whitelists
CREATE POLICY "Admins can manage whitelists"
ON public.whitelists
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IS NOT NULL
  )
);

CREATE POLICY "Users can view their own whitelist entries"
ON public.whitelists
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- RLS Policies for likes
CREATE POLICY "Users can manage their own likes"
ON public.likes
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all likes"
ON public.likes
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IS NOT NULL
  )
);

-- RLS Policies for shares
CREATE POLICY "Users can manage their own shares"
ON public.shares
FOR ALL
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all shares"
ON public.shares
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IS NOT NULL
  )
);

-- Create triggers for updated_at
CREATE TRIGGER update_releases_updated_at
BEFORE UPDATE ON public.releases
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tracks_updated_at
BEFORE UPDATE ON public.tracks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_entitlements_updated_at
BEFORE UPDATE ON public.entitlements
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('audio-files', 'audio-files', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('cover-art', 'cover-art', true);

-- Create storage policies for audio files (admin only)
CREATE POLICY "Admins can upload audio files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'audio-files' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IS NOT NULL
  )
);

CREATE POLICY "Admins can view audio files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'audio-files' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IS NOT NULL
  )
);

-- Create storage policies for cover art
CREATE POLICY "Admins can upload cover art"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'cover-art' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IS NOT NULL
  )
);

CREATE POLICY "Public can view cover art"
ON storage.objects
FOR SELECT
USING (bucket_id = 'cover-art');

-- Create indexes for performance
CREATE INDEX idx_tracks_release_id ON public.tracks(release_id);
CREATE INDEX idx_entitlements_user_id ON public.entitlements(user_id);
CREATE INDEX idx_entitlements_release_id ON public.entitlements(release_id);
CREATE INDEX idx_events_user_id ON public.events(user_id);
CREATE INDEX idx_events_name ON public.events(name);
CREATE INDEX idx_events_created_at ON public.events(created_at);
CREATE INDEX idx_whitelists_user_id ON public.whitelists(user_id);
CREATE INDEX idx_whitelists_release_id ON public.whitelists(release_id);
CREATE INDEX idx_likes_user_id ON public.likes(user_id);
CREATE INDEX idx_likes_track_id ON public.likes(track_id);
CREATE INDEX idx_shares_user_id ON public.shares(user_id);
CREATE INDEX idx_shares_track_id ON public.shares(track_id);
CREATE INDEX idx_profiles_role ON public.profiles(role);

COMMENT ON TABLE public.releases IS 'Music releases (albums, singles, EPs)';
COMMENT ON TABLE public.tracks IS 'Individual tracks within releases';
COMMENT ON TABLE public.entitlements IS 'User access permissions for releases and features';
COMMENT ON TABLE public.events IS 'Analytics events for user behavior tracking';
COMMENT ON TABLE public.whitelists IS 'Early access whitelist for unreleased content';
COMMENT ON TABLE public.likes IS 'User likes on tracks';
COMMENT ON TABLE public.shares IS 'Track sharing events';