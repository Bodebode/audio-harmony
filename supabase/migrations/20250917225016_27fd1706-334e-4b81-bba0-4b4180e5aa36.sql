-- Fix RLS policy causing infinite recursion on profiles table
-- Drop problematic policies if they exist
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Recreate the admin policy without recursion
CREATE POLICY "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.user_id = auth.uid() 
    AND (p.is_admin = true OR p.role IN ('admin', 'editor', 'support'))
  )
);

-- Ensure the first user gets admin access automatically
SELECT public.ensure_first_user_admin();

-- Create a sample live release with ready tracks for immediate testing
WITH new_release AS (
  INSERT INTO public.releases (
    title, 
    release_type, 
    status, 
    release_date, 
    preview_only, 
    notes
  ) 
  VALUES (
    'Sample Album', 
    'album', 
    'live', 
    now(), 
    false, 
    'Demo tracks for testing'
  ) 
  RETURNING id
)
INSERT INTO public.tracks (
  release_id, 
  title, 
  status, 
  track_number, 
  duration_sec,
  audio_file_url
)
SELECT 
  new_release.id,
  track_data.title,
  'ready'::track_status,
  track_data.track_number,
  track_data.duration_sec,
  track_data.audio_file_url
FROM new_release,
(VALUES
  ('Demo Song 1', 1, 180, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'),
  ('Demo Song 2', 2, 210, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'),
  ('Demo Song 3', 3, 195, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3')
) AS track_data(title, track_number, duration_sec, audio_file_url);