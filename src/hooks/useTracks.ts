import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Track {
  id: string;
  title: string;
  audio_file_url?: string;
  duration_sec?: number;
  explicit?: boolean;
  lyrics?: string;
  release?: {
    title: string;
    cover_url?: string;
  };
}

export const useTracks = () => {
  return useQuery({
    queryKey: ['tracks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tracks')
        .select(`
          *,
          release:releases!inner(title, cover_url, status)
        `)
        .eq('status', 'ready')
        .eq('release.status', 'live')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Track[];
    },
  });
};