import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EngagementAnalytics } from '@/components/marketing/EngagementAnalytics';
import { EmailCampaignManager } from '@/components/marketing/EmailCampaignManager';
import { PushNotificationSystem } from '@/components/marketing/PushNotificationSystem';
import { ArtistSpotlight } from '@/components/marketing/ArtistSpotlight';
import { PromotionalBanner } from '@/components/marketing/PromotionalBanner';
import { 
  BarChart3, 
  Mail, 
  Bell, 
  Star, 
  Megaphone,
  TrendingUp,
  Users,
  Target
} from 'lucide-react';
import { useAdmin } from '@/hooks/useAdmin';

export default function AdminMarketing() {
  const { isAdmin, isLoading } = useAdmin();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64" />
          <div className="h-64 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <Target className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
            <p className="text-muted-foreground">
              You need admin privileges to access marketing tools.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Megaphone className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Marketing & Engagement</h1>
          <p className="text-muted-foreground">Drive user engagement and grow your audience</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
                <p className="text-xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reach</p>
                <p className="text-xl font-bold">2.4K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Engagement</p>
                <p className="text-xl font-bold">68.4%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Target className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion</p>
                <p className="text-xl font-bold">12.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Analytics</span>
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Push</span>
          </TabsTrigger>
          <TabsTrigger value="spotlight" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span className="hidden sm:inline">Spotlight</span>
          </TabsTrigger>
          <TabsTrigger value="banners" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            <span className="hidden sm:inline">Banners</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <EngagementAnalytics />
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-6">
          <EmailCampaignManager />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <PushNotificationSystem />
        </TabsContent>

        <TabsContent value="spotlight" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Artist Spotlight Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ArtistSpotlight />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banners" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                Promotional Banners Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <PromotionalBanner maxBanners={5} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}