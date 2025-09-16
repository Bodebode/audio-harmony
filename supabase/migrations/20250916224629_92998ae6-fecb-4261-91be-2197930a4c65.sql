-- Fix admin access and audio storage issues

-- 1. Make audio-files bucket public so tracks can be played
UPDATE storage.buckets 
SET public = true 
WHERE id = 'audio-files';

-- 2. Create a function to easily grant admin access to the first user
CREATE OR REPLACE FUNCTION public.ensure_first_user_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- If no admin exists, make the first user (by creation date) an admin
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE is_admin = true OR role = 'admin') THEN
    UPDATE profiles 
    SET role = 'admin', is_admin = true
    WHERE user_id = (
      SELECT user_id FROM profiles 
      ORDER BY created_at ASC 
      LIMIT 1
    );
  END IF;
END;
$$;

-- 3. Run the function to make first user admin
SELECT public.ensure_first_user_admin();

-- 4. Create a function to automatically set tracks to ready when uploaded
CREATE OR REPLACE FUNCTION public.auto_ready_uploaded_tracks()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  -- When a track gets an audio_file_url, automatically set it to ready
  IF NEW.audio_file_url IS NOT NULL AND OLD.audio_file_url IS NULL THEN
    NEW.status = 'ready'::track_status;
  END IF;
  RETURN NEW;
END;
$$;

-- 5. Create trigger to auto-ready tracks when audio is uploaded
DROP TRIGGER IF EXISTS auto_ready_tracks_trigger ON tracks;
CREATE TRIGGER auto_ready_tracks_trigger
  BEFORE UPDATE ON tracks
  FOR EACH ROW
  EXECUTE FUNCTION auto_ready_uploaded_tracks();