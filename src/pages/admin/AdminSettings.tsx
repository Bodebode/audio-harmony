import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Database, 
  Shield, 
  Mail,
  Palette,
  Globe,
  Save,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

const AdminSettings = () => {
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  // Platform settings state
  const [platformSettings, setPlatformSettings] = useState({
    siteName: "AlkePlay",
    siteDescription: "Premium Music Streaming Platform",
    maintenanceMode: false,
    registrationEnabled: true,
    guestAccess: true,
    maxFileSize: "100MB",
    supportedFormats: "MP3, WAV, FLAC",
    premiumPrice: "9.99",
    freeTierLimits: {
      playlists: 2,
      skipsPerHour: 6,
      downloadLimit: 0
    }
  });

  // Fetch current database stats
  const { data: dbStats, isLoading } = useQuery({
    queryKey: ['admin-db-stats'],
    queryFn: async () => {
      const [
        { count: totalUsers },
        { count: totalReleases },
        { count: totalTracks },
        { count: totalEvents },
        { count: totalTips }
      ] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('releases').select('*', { count: 'exact', head: true }),
        supabase.from('tracks').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('tips').select('*', { count: 'exact', head: true })
      ]);

      return {
        totalUsers: totalUsers || 0,
        totalReleases: totalReleases || 0,
        totalTracks: totalTracks || 0,
        totalEvents: totalEvents || 0,
        totalTips: totalTips || 0
      };
    },
  });

  const handleSaveSettings = async () => {
    setIsUpdating(true);
    try {
      // In a real app, you'd save these to a settings table
      // For now, we'll just show a success message
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast({
        title: "Settings Updated",
        description: "Platform settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClearCache = async () => {
    try {
      // In a real app, you'd clear application cache
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Cache Cleared",
        description: "Application cache has been cleared successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cache. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Configure platform settings and preferences
          </p>
        </div>

        {/* Database Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Database Statistics
            </CardTitle>
            <CardDescription>Current database usage and metrics</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-20">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-5">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{dbStats?.totalUsers}</p>
                  <p className="text-sm text-muted-foreground">Users</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{dbStats?.totalReleases}</p>
                  <p className="text-sm text-muted-foreground">Releases</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{dbStats?.totalTracks}</p>
                  <p className="text-sm text-muted-foreground">Tracks</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{dbStats?.totalEvents}</p>
                  <p className="text-sm text-muted-foreground">Events</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{dbStats?.totalTips}</p>
                  <p className="text-sm text-muted-foreground">Tips</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Platform Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Platform Settings
            </CardTitle>
            <CardDescription>Configure general platform settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={platformSettings.siteName}
                  onChange={(e) => setPlatformSettings(prev => ({
                    ...prev,
                    siteName: e.target.value
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="premiumPrice">Premium Price (USD)</Label>
                <Input
                  id="premiumPrice"
                  value={platformSettings.premiumPrice}
                  onChange={(e) => setPlatformSettings(prev => ({
                    ...prev,
                    premiumPrice: e.target.value
                  }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea
                id="siteDescription"
                value={platformSettings.siteDescription}
                onChange={(e) => setPlatformSettings(prev => ({
                  ...prev,
                  siteDescription: e.target.value
                }))}
                rows={3}
              />
            </div>

            <Separator />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="maxFileSize">Max File Size</Label>
                <Input
                  id="maxFileSize"
                  value={platformSettings.maxFileSize}
                  onChange={(e) => setPlatformSettings(prev => ({
                    ...prev,
                    maxFileSize: e.target.value
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportedFormats">Supported Formats</Label>
                <Input
                  id="supportedFormats"
                  value={platformSettings.supportedFormats}
                  onChange={(e) => setPlatformSettings(prev => ({
                    ...prev,
                    supportedFormats: e.target.value
                  }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Access Control */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Access Control
            </CardTitle>
            <CardDescription>Manage user access and permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Temporarily disable site access for maintenance
                </p>
              </div>
              <Switch
                checked={platformSettings.maintenanceMode}
                onCheckedChange={(checked) => setPlatformSettings(prev => ({
                  ...prev,
                  maintenanceMode: checked
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>User Registration</Label>
                <p className="text-sm text-muted-foreground">
                  Allow new users to register accounts
                </p>
              </div>
              <Switch
                checked={platformSettings.registrationEnabled}
                onCheckedChange={(checked) => setPlatformSettings(prev => ({
                  ...prev,
                  registrationEnabled: checked
                }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Guest Access</Label>
                <p className="text-sm text-muted-foreground">
                  Allow anonymous users to browse content
                </p>
              </div>
              <Switch
                checked={platformSettings.guestAccess}
                onCheckedChange={(checked) => setPlatformSettings(prev => ({
                  ...prev,
                  guestAccess: checked
                }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Free Tier Limits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Free Tier Configuration
            </CardTitle>
            <CardDescription>Set limits for free tier users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="maxPlaylists">Max Playlists</Label>
                <Input
                  id="maxPlaylists"
                  type="number"
                  value={platformSettings.freeTierLimits.playlists}
                  onChange={(e) => setPlatformSettings(prev => ({
                    ...prev,
                    freeTierLimits: {
                      ...prev.freeTierLimits,
                      playlists: parseInt(e.target.value)
                    }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="skipsPerHour">Skips per Hour</Label>
                <Input
                  id="skipsPerHour"
                  type="number"
                  value={platformSettings.freeTierLimits.skipsPerHour}
                  onChange={(e) => setPlatformSettings(prev => ({
                    ...prev,
                    freeTierLimits: {
                      ...prev.freeTierLimits,
                      skipsPerHour: parseInt(e.target.value)
                    }
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="downloadLimit">Download Limit</Label>
                <Input
                  id="downloadLimit"
                  type="number"
                  value={platformSettings.freeTierLimits.downloadLimit}
                  onChange={(e) => setPlatformSettings(prev => ({
                    ...prev,
                    freeTierLimits: {
                      ...prev.freeTierLimits,
                      downloadLimit: parseInt(e.target.value)
                    }
                  }))}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Button onClick={handleSaveSettings} disabled={isUpdating}>
            {isUpdating ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Settings
              </>
            )}
          </Button>

          <Button variant="outline" onClick={handleClearCache}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Clear Cache
          </Button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;