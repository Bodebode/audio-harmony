import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ImageIcon, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AudioUpload } from './AudioUpload';

const releaseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  release_type: z.enum(['album', 'single', 'ep']),
  release_date: z.date().optional(),
  preview_only: z.boolean(),
  notes: z.string().optional(),
});

type ReleaseFormData = z.infer<typeof releaseSchema>;

interface ReleaseFormProps {
  onSuccess: () => void;
}

export function ReleaseForm({ onSuccess }: ReleaseFormProps) {
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [releaseId, setReleaseId] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<ReleaseFormData>({
    resolver: zodResolver(releaseSchema),
    defaultValues: {
      preview_only: false,
    },
  });

  const handleCoverUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverFile(file);
      const reader = new FileReader();
      reader.onload = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadCover = async (releaseId: string, file: File): Promise<string> => {
    const fileName = `${releaseId}/cover.jpg`;
    
    const { data, error } = await supabase.storage
      .from('cover-art')
      .upload(fileName, file, { upsert: true });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('cover-art')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const onSubmit = async (data: ReleaseFormData) => {
    try {
      setIsSubmitting(true);

      // Create release record
      const { data: release, error: releaseError } = await supabase
        .from('releases')
        .insert({
          title: data.title,
          release_type: data.release_type,
          release_date: data.release_date?.toISOString(),
          preview_only: data.preview_only,
          notes: data.notes,
          status: 'draft',
        })
        .select()
        .single();

      if (releaseError) throw releaseError;

      // Upload cover if provided
      let coverUrl = null;
      if (coverFile) {
        coverUrl = await uploadCover(release.id, coverFile);
        
        // Update release with cover URL
        const { error: updateError } = await supabase
          .from('releases')
          .update({ cover_url: coverUrl })
          .eq('id', release.id);

        if (updateError) throw updateError;
      }

      setReleaseId(release.id);
      
      toast({
        title: "Release created",
        description: "You can now upload audio files.",
      });

    } catch (error) {
      console.error('Error creating release:', error);
      toast({
        title: "Error",
        description: "Failed to create release",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFilesUploaded = (files: any[]) => {
    toast({
      title: "Upload complete",
      description: `${files.length} tracks uploaded successfully.`,
    });
    onSuccess();
  };

  if (releaseId) {
    return <AudioUpload releaseId={releaseId} onFilesUploaded={handleFilesUploaded} />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Release</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              {...form.register('title')}
              placeholder="Album or single title"
            />
            {form.formState.errors.title && (
              <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="release_type">Release Type</Label>
            <Select onValueChange={(value) => form.setValue('release_type', value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select release type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="album">Album</SelectItem>
                <SelectItem value="ep">EP</SelectItem>
                <SelectItem value="single">Single</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Cover Art</Label>
            <div className="flex items-center gap-4">
              {coverPreview ? (
                <img
                  src={coverPreview}
                  alt="Cover preview"
                  className="w-20 h-20 object-cover rounded"
                />
              ) : (
                <div className="w-20 h-20 border-2 border-dashed border-muted-foreground/25 rounded flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                </div>
              )}
              <div>
                <Button type="button" variant="outline" asChild>
                  <label htmlFor="cover-upload" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Cover
                  </label>
                </Button>
                <input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 3000x3000px, JPG/PNG
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Release Date (Optional)</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {form.watch('release_date') ? format(form.watch('release_date')!, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={form.watch('release_date')}
                  onSelect={(date) => form.setValue('release_date', date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="preview_only"
              checked={form.watch('preview_only')}
              onCheckedChange={(checked) => form.setValue('preview_only', checked)}
            />
            <Label htmlFor="preview_only">Preview Only (30 seconds)</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              {...form.register('notes')}
              placeholder="Internal notes about this release"
              rows={3}
            />
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Creating...' : 'Create Release'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}