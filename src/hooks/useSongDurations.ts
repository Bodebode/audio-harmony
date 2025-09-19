import { useEffect, useCallback } from 'react';
import { songs } from '@/data/songs';
import { formatDuration } from '@/utils/formatDuration';

export const useSongDurations = () => {
  const preloadSongDurations = useCallback((forceReload = false) => {
    songs.forEach((song) => {
      // Skip if duration is already loaded (unless force reload)
      if (!forceReload && song.duration && song.duration !== "0:00") return;
      
      const audio = new Audio();
      audio.preload = 'metadata';
      audio.src = song.audioUrl;
      
      const handleLoadedMetadata = () => {
        const duration = formatDuration(audio.duration);
        // Update the song duration in the songs array
        const songIndex = songs.findIndex(s => s.id === song.id);
        if (songIndex !== -1) {
          songs[songIndex].duration = duration;
        }
        
        // Clean up
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('error', handleError);
      };
      
      const handleError = () => {
        // If there's an error loading, set a default duration
        const songIndex = songs.findIndex(s => s.id === song.id);
        if (songIndex !== -1) {
          songs[songIndex].duration = "0:00";
        }
        
        // Clean up
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        audio.removeEventListener('error', handleError);
      };
      
      audio.addEventListener('loadedmetadata', handleLoadedMetadata);
      audio.addEventListener('error', handleError);
    });
  }, []);

  useEffect(() => {
    // Preload durations when hook is first used
    preloadSongDurations();
  }, [preloadSongDurations]);

  return { preloadSongDurations };
};