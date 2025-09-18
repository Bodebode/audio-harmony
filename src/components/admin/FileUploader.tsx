import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FileUploaderProps {
  onUploadComplete?: (url: string, fileName: string) => void;
  acceptedTypes?: string;
  maxSize?: number;
}

interface UploadFile {
  file: File;
  id: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  url?: string;
  error?: string;
}

export const FileUploader = ({ 
  onUploadComplete,
  acceptedTypes = "audio/*",
  maxSize = 50 * 1024 * 1024 // 50MB
}: FileUploaderProps) => {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const { toast } = useToast();

  const uploadFile = async (uploadFile: UploadFile) => {
    try {
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'uploading' as const, progress: 0 }
          : f
      ));

      const fileName = `${Date.now()}-${uploadFile.file.name}`;
      
      const { data, error } = await supabase.storage
        .from('audio-files')
        .upload(fileName, uploadFile.file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Simulate progress for now
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => {
          if (f.id === uploadFile.id && f.progress < 90) {
            return { ...f, progress: f.progress + 10 };
          }
          return f;
        }));
      }, 100);

      setTimeout(() => {
        clearInterval(progressInterval);
        setFiles(prev => prev.map(f => 
          f.id === uploadFile.id 
            ? { ...f, progress: 100 }
            : f
        ));
      }, 1000);

      const { data: urlData } = supabase.storage
        .from('audio-files')
        .getPublicUrl(fileName);

      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'completed' as const, progress: 100, url: urlData.publicUrl }
          : f
      ));

      onUploadComplete?.(urlData.publicUrl, uploadFile.file.name);

      toast({
        title: "Upload successful",
        description: `${uploadFile.file.name} has been uploaded.`,
      });

    } catch (error: any) {
      console.error('Upload error:', error);
      setFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, status: 'error' as const, error: error.message }
          : f
      ));

      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload file",
        variant: "destructive"
      });
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(7),
      progress: 0,
      status: 'pending' as const
    }));

    setFiles(prev => [...prev, ...newFiles]);

    // Start uploading each file
    newFiles.forEach(newFile => {
      setTimeout(() => uploadFile(newFile), 100);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { [acceptedTypes]: [] },
    maxSize,
    multiple: true
  });

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const retryUpload = (fileToRetry: UploadFile) => {
    uploadFile(fileToRetry);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-muted-foreground/25 hover:border-primary/50'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-lg font-semibold mb-2">
          {isDragActive ? 'Drop files here...' : 'Upload Audio Files'}
        </p>
        <p className="text-muted-foreground mb-4">
          Drag and drop audio files or click to select
        </p>
        <Button variant="outline">
          Select Files
        </Button>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold">Upload Progress</h3>
          {files.map(uploadFile => (
            <div
              key={uploadFile.id}
              className="flex items-center gap-3 p-3 border rounded-lg"
            >
              <div className="flex-shrink-0">
                {uploadFile.status === 'completed' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : uploadFile.status === 'error' ? (
                  <X className="h-5 w-5 text-red-500" />
                ) : (
                  <File className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {uploadFile.file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(uploadFile.file.size / (1024 * 1024)).toFixed(2)} MB
                </p>
                
                {uploadFile.status === 'uploading' && (
                  <Progress value={uploadFile.progress} className="mt-1" />
                )}
                
                {uploadFile.status === 'error' && (
                  <p className="text-xs text-red-500 mt-1">
                    {uploadFile.error}
                  </p>
                )}
              </div>
              
              <div className="flex gap-2">
                {uploadFile.status === 'error' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => retryUpload(uploadFile)}
                  >
                    Retry
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeFile(uploadFile.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};