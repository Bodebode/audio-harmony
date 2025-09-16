import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Music, Clock, Edit3, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const trackSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  track_number: z.number().min(1).optional(),
  isrc: z.string().optional(),
  explicit: z.boolean(),
  lyrics: z.string().optional(),
  duration_sec: z.number().min(1).optional(),
});

type TrackFormData = z.infer<typeof trackSchema>;

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

interface TrackEditorProps {
  track: Track;
  onUpdate: () => void;
}

export function TrackEditor({ track, onUpdate }: TrackEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<TrackFormData>({
    resolver: zodResolver(trackSchema),
    defaultValues: {
      title: track.title,
      track_number: track.track_number || undefined,
      isrc: track.isrc || '',
      explicit: track.explicit || false,
      lyrics: track.lyrics || '',
      duration_sec: track.duration_sec || undefined,
    },
  });

  const onSubmit = async (data: TrackFormData) => {
    try {
      setIsSubmitting(true);

      const { error } = await supabase
        .from('tracks')
        .update({
          title: data.title,
          track_number: data.track_number,
          isrc: data.isrc,
          explicit: data.explicit,
          lyrics: data.lyrics,
          duration_sec: data.duration_sec,
        })
        .eq('id', track.id);

      if (error) throw error;

      toast({
        title: "Track updated",
        description: "Track details have been saved successfully.",
      });

      setIsOpen(false);
      onUpdate();

    } catch (error) {
      console.error('Error updating track:', error);
      toast({
        title: "Error",
        description: "Failed to update track",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return 'Unknown';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Music className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="text-lg">{track.title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  {track.track_number && (
                    <Badge variant="outline">Track {track.track_number}</Badge>
                  )}
                  <Badge variant={track.status === 'ready' ? 'default' : 'secondary'}>
                    {track.status}
                  </Badge>
                  {track.explicit && (
                    <Badge variant="destructive">Explicit</Badge>
                  )}
                </div>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
              <Edit3 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(track.duration_sec)}
              </span>
            </div>
            {track.isrc && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">ISRC:</span>
                <span className="font-mono text-xs">{track.isrc}</span>
              </div>
            )}
            {track.lyrics && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Lyrics:</span>
                <span>Available</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Track: {track.title}</DialogTitle>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...form.register('title')}
                  placeholder="Track title"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="track_number">Track Number</Label>
                <Input
                  id="track_number"
                  type="number"
                  min="1"
                  {...form.register('track_number', { valueAsNumber: true })}
                  placeholder="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="isrc">ISRC Code</Label>
                <Input
                  id="isrc"
                  {...form.register('isrc')}
                  placeholder="USUM71703861"
                  className="font-mono"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration_sec">Duration (seconds)</Label>
                <Input
                  id="duration_sec"
                  type="number"
                  min="1"
                  {...form.register('duration_sec', { valueAsNumber: true })}
                  placeholder="180"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="explicit"
                checked={form.watch('explicit')}
                onCheckedChange={(checked) => form.setValue('explicit', checked)}
              />
              <Label htmlFor="explicit">Explicit Content</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="lyrics">Lyrics</Label>
              <Textarea
                id="lyrics"
                {...form.register('lyrics')}
                placeholder="Enter track lyrics..."
                rows={12}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                Format: One line per lyric line. Empty lines for spacing.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isSubmitting}
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}