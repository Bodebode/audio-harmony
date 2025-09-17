-- Update the demo tracks with better audio URLs that work properly
UPDATE public.tracks 
SET audio_file_url = CASE 
  WHEN title = 'Demo Song 1' THEN 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
  WHEN title = 'Demo Song 2' THEN 'https://sample-videos.com/zip/10/mp3/mp3-15s/mp3-15s.mp3'
  WHEN title = 'Demo Song 3' THEN 'https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3'
  ELSE audio_file_url
END
WHERE title IN ('Demo Song 1', 'Demo Song 2', 'Demo Song 3');