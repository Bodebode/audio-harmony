import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { uploadLoveTrack } from "@/utils/uploadLoveTrack";

interface Track {
  id: string;
  title: string;
  duration_sec: number | null;
  audio_file_url: string | null;
  release_id: string | null;
  explicit: boolean | null;
  status: string;
  isPremium?: boolean;
}

export const useTracks = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTracks = async () => {
    try {
      setLoading(true);
      
      // First try to ensure Love.mp3 is uploaded
      console.log('Checking if Love.mp3 needs to be uploaded...');
      await uploadLoveTrack();
      
      // Fetch tracks from the database
      const { data: tracksData, error: tracksError } = await (supabase as any)
        .from('tracks')
        .select(`
          id,
          title,
          duration_sec,
          audio_file_url,
          release_id,
          explicit,
          status,
          releases!inner(status)
        `)
        .eq('releases.status', 'live')
        .eq('status', 'ready');

      if (tracksError) {
        console.error('Error fetching tracks:', tracksError);
        throw tracksError;
      }

      console.log('Fetched tracks:', tracksData);
      setTracks(tracksData || []);
      
    } catch (err: any) {
      console.error('Error in useTracks:', err);
      setError(err.message || 'Failed to fetch tracks');
      
      // Fallback to sample data if database fetch fails
      const fallbackTracks = [
        { 
          id: 'sample-1', 
          title: 'Love', 
          duration_sec: 240, 
          audio_file_url: '/uploads/Love.mp3',
          release_id: 'sample-release',
          explicit: false,
          status: 'ready',
          isPremium: false 
        }
      ];
      setTracks(fallbackTracks);
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracks();
  }, []);

  const formatDuration = (seconds: number | null): string => {
    if (!seconds) return "3:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTrackWithFormattedDuration = (track: Track) => ({
    ...track,
    duration: formatDuration(track.duration_sec),
    formattedId: parseInt(track.id.slice(-8), 16) || 1 // Convert UUID to number for compatibility
  });

  return {
    tracks: tracks.map(getTrackWithFormattedDuration),
    loading,
    error,
    refetch: fetchTracks
  };
};