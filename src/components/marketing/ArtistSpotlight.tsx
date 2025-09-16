import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Play, Heart, Share2, Music, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SpotlightRelease {
  id: string;
  title: string;
  cover_url: string | null;
  release_date: string | null;
  release_type: 'album' | 'single' | 'ep';
  notes: string | null;
  tracks: Array<{
    id: string;
    title: string;
    duration_sec: number | null;
  }>;
}

export const ArtistSpotlight = () => {
  const [spotlightReleases, setSpotlightReleases] = useState<SpotlightRelease[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchSpotlightReleases();
  }, []);

  const fetchSpotlightReleases = async () => {
    try {
      const { data, error } = await supabase
        .from('releases')
        .select(`
          id,
          title,
          cover_url,
          release_date,
          release_type,
          notes,
          tracks:tracks(id, title, duration_sec)
        `)
        .eq('status', 'live')
        .order('release_date', { ascending: false })
        .limit(5);

      if (error) throw error;
      setSpotlightReleases(data || []);
    } catch (error) {
      console.error('Error fetching spotlight releases:', error);
      toast({
        title: "Error",
        description: "Failed to load featured releases",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlay = (releaseId: string) => {
    toast({
      title: "Playing",
      description: "Starting playback...",
    });
  };

  const handleLike = (releaseId: string) => {
    toast({
      title: "Liked",
      description: "Added to your favorites",
    });
  };

  const handleShare = (releaseId: string) => {
    toast({
      title: "Shared",
      description: "Release shared successfully",
    });
  };

  if (loading) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center gap-2 mb-6">
          <Star className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">Featured Releases</h2>
        </div>
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-[300px] animate-pulse">
              <div className="aspect-square bg-muted rounded-t-lg" />
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (spotlightReleases.length === 0) {
    return (
      <div className="text-center py-12">
        <Music className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium">No featured releases yet</h3>
        <p className="text-muted-foreground">Check back soon for new music!</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Star className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Featured Releases
        </h2>
      </div>

      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {spotlightReleases.map((release) => (
            <CarouselItem key={release.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <Card className="group hover:shadow-lg transition-all duration-300 border-primary/20 bg-gradient-to-b from-background to-background/80">
                <div className="relative overflow-hidden rounded-t-lg">
                  {release.cover_url ? (
                    <img
                      src={release.cover_url}
                      alt={release.title}
                      className="aspect-square w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="aspect-square w-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                      <Music className="h-16 w-16 text-primary/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <Button
                    size="sm"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={() => handlePlay(release.id)}
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Play
                  </Button>
                </div>

                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <h3 className="font-semibold text-lg line-clamp-1">{release.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {release.release_type.toUpperCase()}
                        </Badge>
                        {release.release_date && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(release.release_date).getFullYear()}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {release.notes && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {release.notes}
                    </p>
                  )}

                  {release.tracks.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">
                        {release.tracks.length} track{release.tracks.length > 1 ? 's' : ''}
                      </p>
                      <div className="space-y-1 max-h-16 overflow-hidden">
                        {release.tracks.slice(0, 2).map((track) => (
                          <div key={track.id} className="flex items-center justify-between text-xs">
                            <span className="line-clamp-1 flex-1">{track.title}</span>
                            {track.duration_sec && (
                              <span className="text-muted-foreground ml-2">
                                {formatDuration(track.duration_sec)}
                              </span>
                            )}
                          </div>
                        ))}
                        {release.tracks.length > 2 && (
                          <p className="text-xs text-muted-foreground">
                            +{release.tracks.length - 2} more tracks
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLike(release.id)}
                      className="flex-1"
                    >
                      <Heart className="h-3 w-3 mr-1" />
                      Like
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleShare(release.id)}
                      className="flex-1"
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
    </div>
  );
};