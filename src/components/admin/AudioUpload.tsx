import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, Music, X, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AudioFile {
  id: string;
  file: File;
  title: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress: number;
  url?: string;
}

interface AudioUploadProps {
  releaseId: string;
  onFilesUploaded: (files: AudioFile[]) => void;
}

export function AudioUpload({ releaseId, onFilesUploaded }: AudioUploadProps) {
  const [files, setFiles] = useState<AudioFile[]>([]);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const audioFiles: AudioFile[] = acceptedFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
      title: file.name.replace(/\.[^/.]+$/, ''),
      status: 'pending',
      progress: 0,
    }));
    
    setFiles(prev => [...prev, ...audioFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.flac', '.m4a'],
    },
    multiple: true,
  });

  const uploadFile = async (audioFile: AudioFile) => {
    try {
      setFiles(prev => prev.map(f => 
        f.id === audioFile.id 
          ? { ...f, status: 'uploading' as const, progress: 0 }
          : f
      ));

      const fileName = `${releaseId}/${audioFile.id}-${audioFile.file.name}`;
      
      const { data, error } = await supabase.storage
        .from('audio-files')
        .upload(fileName, audioFile.file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('audio-files')
        .getPublicUrl(fileName);

      // Create track record
      const { data: track, error: trackError } = await supabase
        .from('tracks')
        .insert({
          release_id: releaseId,
          title: audioFile.title,
          audio_file_url: publicUrl,
          status: 'uploaded',
        })
        .select()
        .single();

      if (trackError) throw trackError;

      setFiles(prev => prev.map(f => 
        f.id === audioFile.id 
          ? { ...f, status: 'completed' as const, url: publicUrl, progress: 100 }
          : f
      ));

      toast({
        title: "Upload successful",
        description: `${audioFile.title} has been uploaded.`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      setFiles(prev => prev.map(f => 
        f.id === audioFile.id 
          ? { ...f, status: 'error' as const }
          : f
      ));
      
      toast({
        title: "Upload failed",
        description: `Failed to upload ${audioFile.title}`,
        variant: "destructive",
      });
    }
  };

  const uploadAll = async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    for (const file of pendingFiles) {
      await uploadFile(file);
    }
    onFilesUploaded(files.filter(f => f.status === 'completed'));
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const updateTitle = (id: string, title: string) => {
    setFiles(prev => prev.map(f => 
      f.id === id ? { ...f, title } : f
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Audio Upload
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          {isDragActive ? (
            <p>Drop the audio files here...</p>
          ) : (
            <div>
              <p className="text-lg font-medium mb-2">Drop audio files here</p>
              <p className="text-sm text-muted-foreground">
                or click to select files. Supports MP3, WAV, FLAC, M4A
              </p>
            </div>
          )}
        </div>

        {files.length > 0 && (
          <div className="space-y-3">
            {files.map((file) => (
              <div key={file.id} className="flex items-center gap-3 p-3 border rounded">
                <div className="flex-1">
                  <input
                    type="text"
                    value={file.title}
                    onChange={(e) => updateTitle(file.id, e.target.value)}
                    className="w-full bg-transparent border-none outline-none font-medium"
                    disabled={file.status === 'uploading'}
                  />
                  <p className="text-sm text-muted-foreground">
                    {(file.file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>

                {file.status === 'uploading' && (
                  <div className="w-24">
                    <Progress value={file.progress} className="h-2" />
                  </div>
                )}

                {file.status === 'completed' && (
                  <Check className="h-5 w-5 text-green-500" />
                )}

                {file.status === 'error' && (
                  <X className="h-5 w-5 text-red-500" />
                )}

                {file.status === 'pending' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFile(file.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}

            {files.some(f => f.status === 'pending') && (
              <Button onClick={uploadAll} className="w-full">
                Upload All Files
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}