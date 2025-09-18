import { useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Upload, Music, Users, BarChart3, Settings, Plus } from "lucide-react";

const Admin = () => {
  const { profile, loading } = useAuth();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("music");
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form state
  const [trackForm, setTrackForm] = useState({
    title: "",
    duration_sec: "",
    explicit: false,
    track_number: "",
    lyrics: ""
  });
  
  const [releaseForm, setReleaseForm] = useState({
    title: "",
    release_type: "single",
    notes: ""
  });

  // Check admin access
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!profile?.is_admin && profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleFileUpload = async (file: File, releaseId?: string) => {
    try {
      setUploading(true);
      
      // Upload to Supabase storage
      const fileName = `${Date.now()}-${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('audio-files')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('audio-files')
        .getPublicUrl(fileName);

      // Create or update release if needed
      let finalReleaseId = releaseId;
      if (!finalReleaseId) {
        const { data: releaseData, error: releaseError } = await (supabase as any)
          .from('releases')
          .insert({
            title: releaseForm.title || file.name.replace(/\.[^/.]+$/, ""),
            release_type: releaseForm.release_type as any,
            status: 'live',
            notes: releaseForm.notes,
            created_by_user_id: profile?.user_id
          })
          .select()
          .single();

        if (releaseError) throw releaseError;
        finalReleaseId = releaseData.id;
      }

      // Create track record
      const { error: trackError } = await (supabase as any)
        .from('tracks')
        .insert({
          title: trackForm.title || file.name.replace(/\.[^/.]+$/, ""),
          release_id: finalReleaseId,
          audio_file_url: urlData.publicUrl,
          duration_sec: trackForm.duration_sec ? parseInt(trackForm.duration_sec) : null,
          explicit: trackForm.explicit,
          track_number: trackForm.track_number ? parseInt(trackForm.track_number) : null,
          lyrics: trackForm.lyrics,
          status: 'ready'
        });

      if (trackError) throw trackError;

      toast({
        title: "Success!",
        description: `Track "${trackForm.title || file.name}" uploaded successfully!`,
      });

      // Reset forms
      setTrackForm({ title: "", duration_sec: "", explicit: false, track_number: "", lyrics: "" });
      setReleaseForm({ title: "", release_type: "single", notes: "" });
      
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error.message || "Failed to upload track",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your music platform</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="music" className="flex items-center gap-2">
              <Music className="h-4 w-4" />
              Music
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="music" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Upload New Track
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Release Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Release Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="release-title">Release Title</Label>
                      <Input
                        id="release-title"
                        value={releaseForm.title}
                        onChange={(e) => setReleaseForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Album/EP/Single name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="release-type">Release Type</Label>
                      <Select 
                        value={releaseForm.release_type}
                        onValueChange={(value) => setReleaseForm(prev => ({ ...prev, release_type: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="album">Album</SelectItem>
                          <SelectItem value="ep">EP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="release-notes">Release Notes</Label>
                    <Textarea
                      id="release-notes"
                      value={releaseForm.notes}
                      onChange={(e) => setReleaseForm(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Optional notes about this release"
                    />
                  </div>
                </div>

                {/* Track Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Track Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="track-title">Track Title</Label>
                      <Input
                        id="track-title"
                        value={trackForm.title}
                        onChange={(e) => setTrackForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Song name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="track-number">Track Number</Label>
                      <Input
                        id="track-number"
                        type="number"
                        value={trackForm.track_number}
                        onChange={(e) => setTrackForm(prev => ({ ...prev, track_number: e.target.value }))}
                        placeholder="1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (seconds)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={trackForm.duration_sec}
                      onChange={(e) => setTrackForm(prev => ({ ...prev, duration_sec: e.target.value }))}
                      placeholder="180"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lyrics">Lyrics (Optional)</Label>
                    <Textarea
                      id="lyrics"
                      value={trackForm.lyrics}
                      onChange={(e) => setTrackForm(prev => ({ ...prev, lyrics: e.target.value }))}
                      placeholder="Enter lyrics here..."
                      className="min-h-[100px]"
                    />
                  </div>
                </div>

                {/* File Upload */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Audio File</h3>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-semibold mb-2">Upload Audio File</p>
                    <p className="text-muted-foreground mb-4">Drag and drop or click to select</p>
                    <Button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                    >
                      {uploading ? "Uploading..." : "Select File"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">User management interface coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Settings panel coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;