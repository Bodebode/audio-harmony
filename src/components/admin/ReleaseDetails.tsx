import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Music, 
  Calendar, 
  Users, 
  Play, 
  Settings, 
  Eye,
  Download,
  Share2,
  Clock
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { TrackEditor } from './TrackEditor';
import { useToast } from '@/hooks/use-toast';

interface Track {
  id: string;
  title: string;
  track_number?: number;
  isrc?: string;
  explicit?: boolean;
  lyrics?: string;
  duration_sec?: number;
  status: string;
  audio_file_url?: string;
}

interface Release {
  id: string;
  title: string;
  release_type: string;
  status: string;
  cover_url?: string;
  release_date?: string;
  preview_only: boolean;
  notes?: string;
  created_at: string;
}

interface ReleaseDetailsProps {
  releaseId: string;
  onClose: () => void;
}

export function ReleaseDetails({ releaseId, onClose }: ReleaseDetailsProps) {
  const [showPublishDialog, setShowPublishDialog] = useState(false);
  const { toast } = useToast();

  const { data: release, isLoading: releaseLoading, refetch: refetchRelease } = useQuery({
    queryKey: ['release-details', releaseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('releases')
        .select('*')
        .eq('id', releaseId)
        .single();
      
      if (error) throw error;
      return data as Release;
    },
  });

  const { data: tracks, isLoading: tracksLoading, refetch: refetchTracks } = useQuery({
    queryKey: ['release-tracks', releaseId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tracks')
        .select('*')
        .eq('release_id', releaseId)
        .order('track_number', { ascending: true });
      
      if (error) throw error;
      return data as Track[];
    },
  });

  const { data: whitelistCount } = useQuery({
    queryKey: ['release-whitelist-count', releaseId],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('whitelists')
        .select('*', { count: 'exact', head: true })
        .eq('release_id', releaseId);
      
      if (error) throw error;
      return count || 0;
    },
  });

  const publishRelease = async () => {
    try {
      const { error } = await supabase
        .from('releases')
        .update({ status: 'live' })
        .eq('id', releaseId);

      if (error) throw error;

      toast({
        title: "Release published",
        description: "Your release is now live and accessible to users.",
      });

      setShowPublishDialog(false);
      refetchRelease();

    } catch (error) {
      console.error('Error publishing release:', error);
      toast({
        title: "Error",
        description: "Failed to publish release",
        variant: "destructive",
      });
    }
  };

  const getTotalDuration = () => {
    if (!tracks) return 0;
    return tracks.reduce((total, track) => total + (track.duration_sec || 0), 0);
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (releaseLoading || tracksLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!release) {
    return <div>Release not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Release Header */}
      <div className="flex items-start gap-6">
        {release.cover_url ? (
          <img
            src={release.cover_url}
            alt={release.title}
            className="w-32 h-32 object-cover rounded-lg shadow-md"
          />
        ) : (
          <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center">
            <Music className="h-12 w-12 text-muted-foreground" />
          </div>
        )}

        <div className="flex-1 space-y-3">
          <div>
            <h1 className="text-3xl font-bold">{release.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="capitalize">
                {release.release_type}
              </Badge>
              <Badge variant={release.status === 'live' ? 'default' : 'outline'}>
                {release.status}
              </Badge>
              {release.preview_only && (
                <Badge variant="outline">Preview Only</Badge>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Play className="h-4 w-4 text-muted-foreground" />
              <span>{tracks?.length || 0} tracks</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{formatDuration(getTotalDuration())}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{whitelistCount || 0} whitelisted</span>
            </div>
            {release.release_date && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(release.release_date).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            {release.status !== 'live' && (
              <Dialog open={showPublishDialog} onOpenChange={setShowPublishDialog}>
                <DialogTrigger asChild>
                  <Button>
                    <Play className="h-4 w-4 mr-2" />
                    Publish Release
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Publish Release</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <p>
                      Are you sure you want to publish "{release.title}"? 
                      This will make it accessible to users based on their entitlements.
                    </p>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setShowPublishDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={publishRelease}>
                        Publish Now
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Manage Access
            </Button>
            
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Tracks List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Tracks</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {tracks && tracks.length > 0 ? (
          <div className="grid gap-4">
            {tracks.map((track) => (
              <TrackEditor
                key={track.id}
                track={track}
                onUpdate={refetchTracks}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Music className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h3 className="text-lg font-medium mb-2">No tracks yet</h3>
              <p className="text-muted-foreground">
                Upload some audio files to get started.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Release Notes */}
      {release.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Release Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {release.notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}