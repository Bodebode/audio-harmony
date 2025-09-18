-- Upload the Love.mp3 file and update the track record
-- First, let's get the track ID we created earlier
UPDATE tracks 
SET audio_file_url = 'https://rqvwqdzvsztzkbcvvpqj.supabase.co/storage/v1/object/public/audio-files/love.mp3',
    duration_sec = 240 -- Placeholder duration
WHERE title = 'Love' AND release_id IN (
  SELECT id FROM releases WHERE title = 'Love - Single Release'
);