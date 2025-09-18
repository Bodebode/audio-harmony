-- Upload the Love.mp3 file that was provided by the user
-- First create a release for it
INSERT INTO public.releases (title, release_type, status, notes, created_by_user_id)
VALUES (
  'Love - Single Release', 
  'single', 
  'live', 
  'User uploaded track via admin interface',
  (SELECT user_id FROM profiles WHERE is_admin = true OR role = 'admin' LIMIT 1)
);

-- Now create the track entry
-- We'll need to update this with the actual file URL after upload
INSERT INTO public.tracks (
  title, 
  release_id, 
  audio_file_url, 
  duration_sec, 
  track_number, 
  status
)
VALUES (
  'Love',
  (SELECT id FROM releases WHERE title = 'Love - Single Release' LIMIT 1),
  'https://rqvwqdzvsztzkbcvvpqj.supabase.co/storage/v1/object/public/audio-files/love-uploaded.mp3',
  180, -- Placeholder duration, will be updated with actual
  1,
  'ready'
);