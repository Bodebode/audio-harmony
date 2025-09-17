import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Upload, Music, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface AudioFile {
  id: string;
  file: File;
  title: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  url?: string;
}

export const QuickUpload = () => {
  const [files, setFiles] = useState<AudioFile[]>([]);
  const [releaseTitle, setReleaseTitle] = useState('');
  const [releaseNotes, setReleaseNotes] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    const audioFiles = acceptedFiles.filter(file => 
      file.type.startsWith('audio/') || 
      file.name.toLowerCase().endsWith('.mp3') ||
      file.name.toLowerCase().endsWith('.wav') ||
      file.name.toLowerCase().endsWith('.m4a')
    );

    if (audioFiles.length === 0) {
      toast.error('Please upload audio files only');
      return;
    }

    const newFiles: AudioFile[] = audioFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
      status: 'pending',
      progress: 0
    }));

    setFiles(prev => [...prev, ...newFiles]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.flac', '.aac']
    },
    multiple: true
  });

  const updateFileTitle = (id: string, newTitle: string) => {
    setFiles(prev => prev.map(file => 
      file.id === id ? { ...file, title: newTitle } : file
    ));
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const uploadFile = async (audioFile: AudioFile): Promise<boolean> => {
    try {
      setFiles(prev => prev.map(f => 
        f.id === audioFile.id ? { ...f, status: 'uploading', progress: 0 } : f
      ));

      // Upload to Supabase storage
      const fileName = `${Date.now()}-${audioFile.file.name}`;
      
      // Set progress to 50% during upload
      setFiles(prev => prev.map(f => 
        f.id === audioFile.id ? { ...f, progress: 50 } : f
      ));
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(fileName, audioFile.file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('audio-files')
        .getPublicUrl(fileName);

      setFiles(prev => prev.map(f => 
        f.id === audioFile.id ? { ...f, status: 'success', url: publicUrl, progress: 100 } : f
      ));

      return true;
    } catch (error) {
      console.error('Upload error:', error);
      setFiles(prev => prev.map(f => 
        f.id === audioFile.id ? { ...f, status: 'error' } : f
      ));
      return false;
    }
  };

  const createReleaseAndTracks = async () => {
    if (files.length === 0) {
      toast.error('Please add some audio files first');
      return;
    }

    if (!releaseTitle.trim()) {
      toast.error('Please enter a release title');
      return;
    }

    setIsUploading(true);

    try {
      // Upload all files
      const uploadPromises = files.map(file => uploadFile(file));
      const uploadResults = await Promise.all(uploadPromises);
      
      const successfulUploads = files.filter((_, index) => uploadResults[index]);
      
      if (successfulUploads.length === 0) {
        toast.error('No files were uploaded successfully');
        return;
      }

      // Create release
      const { data: release, error: releaseError } = await supabase
        .from('releases')
        .insert({
          title: releaseTitle,
          release_type: 'album',
          status: 'live',
          release_date: new Date().toISOString(),
          preview_only: false,
          notes: releaseNotes || null
        })
        .select()
        .single();

      if (releaseError) throw releaseError;

      // Create tracks
      const trackPromises = successfulUploads.map((file, index) => 
        supabase.from('tracks').insert({
          release_id: release.id,
          title: file.title,
          audio_file_url: file.url,
          track_number: index + 1,
          status: 'ready',
          duration_sec: null, // Will be calculated later
          explicit: false
        })
      );

      await Promise.all(trackPromises);

      toast.success(`Successfully created release "${releaseTitle}" with ${successfulUploads.length} tracks!`);
      
      // Reset form
      setFiles([]);
      setReleaseTitle('');
      setReleaseNotes('');

    } catch (error) {
      console.error('Error creating release:', error);
      toast.error('Failed to create release. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const getStatusIcon = (status: AudioFile['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'uploading':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Music className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Quick Upload</h1>
        <p className="text-muted-foreground">
          Upload your songs instantly and make them available on the app immediately
        </p>
      </div>

      <div className="space-y-6">
        {/* Release Info */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Release Information</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="release-title">Release Title *</Label>
              <Input
                id="release-title"
                value={releaseTitle}
                onChange={(e) => setReleaseTitle(e.target.value)}
                placeholder="Enter release title..."
              />
            </div>
            <div>
              <Label htmlFor="release-notes">Release Notes (Optional)</Label>
              <Textarea
                id="release-notes"
                value={releaseNotes}
                onChange={(e) => setReleaseNotes(e.target.value)}
                placeholder="Add any notes about this release..."
                rows={3}
              />
            </div>
          </div>
        </Card>

        {/* File Upload Area */}
        <Card className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-gray-300 hover:border-primary hover:bg-primary/5'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            {isDragActive ? (
              <p className="text-lg">Drop your audio files here...</p>
            ) : (
              <div>
                <p className="text-lg mb-2">Drag & drop audio files here</p>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse (MP3, WAV, M4A, FLAC, AAC)
                </p>
                <Button variant="outline">Choose Files</Button>
              </div>
            )}
          </div>
        </Card>

        {/* File List */}
        {files.length > 0 && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Audio Files ({files.length})</h3>
            <div className="space-y-3">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  {getStatusIcon(file.status)}
                  <div className="flex-1">
                    <Input
                      value={file.title}
                      onChange={(e) => updateFileTitle(file.id, e.target.value)}
                      className="font-medium"
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">
                        {(file.file.size / (1024 * 1024)).toFixed(1)} MB
                      </span>
                      {file.status === 'uploading' && (
                        <span className="text-sm text-blue-600">
                          {file.progress}%
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    disabled={file.status === 'uploading'}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Upload Button */}
        {files.length > 0 && (
          <div className="flex justify-center">
            <Button
              onClick={createReleaseAndTracks}
              disabled={isUploading || !releaseTitle.trim()}
              size="lg"
              className="px-8"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating Release...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Create Release & Upload All
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};