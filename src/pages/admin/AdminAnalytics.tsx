import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart3, 
  Users, 
  Play, 
  Heart,
  Share2,
  TrendingUp,
  Calendar,
  Music,
  Activity,
  FileText,
  MousePointer,
  RefreshCw
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import { RealTimeAnalytics } from "@/components/analytics/RealTimeAnalytics";
import { AdvancedReporting } from "@/components/analytics/AdvancedReporting";
import { UserBehaviorAnalytics } from "@/components/analytics/UserBehaviorAnalytics";
import { useState } from "react";

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Fetch enhanced analytics data
  const { data: analytics, isLoading, refetch } = useQuery({
    queryKey: ['admin-analytics', timeRange, refreshKey],
    queryFn: async () => {
      const days = parseInt(timeRange.replace('d', ''));
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const [
        { data: dailyAnalytics },
        { data: dailyPlays },
        { data: topTracks },
        { data: userGrowth },
        { data: premiumConversion },
        { data: deviceStats },
        { data: revenueData }
      ] = await Promise.all([
        // Fetch from analytics_daily table
        supabase
          .from('analytics_daily')
          .select('*')
          .gte('date', startDate.toISOString().split('T')[0])
          .order('date', { ascending: true }),
        // Daily plays for selected period
        supabase
          .from('events')
          .select('created_at')
          .eq('name', 'play_started')
          .gte('created_at', startDate.toISOString()),
        
        // Top tracks by play count
        supabase
          .from('events')
          .select('properties')
          .eq('name', 'play_started')
          .not('properties->track_id', 'is', null)
          .limit(1000),
        
        // User growth over selected period
        supabase
          .from('profiles')
          .select('created_at')
          .gte('created_at', startDate.toISOString()),
        
        // Premium conversion data
        supabase
          .from('profiles')
          .select('is_premium, created_at, premium_expires_at'),
        
        // Device stats
        supabase
          .from('events')
          .select('device')
          .not('device', 'is', null)
          .gte('created_at', startDate.toISOString())
          .limit(1000),
        
        // Revenue data from tips and premium subscriptions
        supabase
          .from('tips')
          .select('amount, created_at, currency')
          .gte('created_at', startDate.toISOString())
      ]);

      // Process daily analytics data from aggregated table
      const dailyAnalyticsChart = dailyAnalytics?.map(day => ({
        date: new Date(day.date).toLocaleDateString(),
        users: day.active_users,
        plays: day.total_plays,
        likes: day.total_likes,
        shares: day.total_shares,
        revenue: day.revenue || 0,
        conversionRate: day.conversion_rate || 0
      })) || [];

      // Process daily plays data (fallback for real-time data)
      const playsByDay = dailyPlays?.reduce((acc: any, play) => {
        const date = new Date(play.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {}) || {};

      const dailyPlaysChart = Object.entries(playsByDay)
        .map(([date, plays]) => ({ date, plays }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Process top tracks
      const trackCounts = topTracks?.reduce((acc: any, event) => {
        const properties = event.properties as any;
        const trackId = properties?.track_id;
        if (trackId) {
          acc[trackId] = (acc[trackId] || 0) + 1;
        }
        return acc;
      }, {}) || {};

      const topTracksData = Object.entries(trackCounts)
        .map(([trackId, count]) => ({ trackId, plays: count }))
        .sort((a, b) => (b.plays as number) - (a.plays as number))
        .slice(0, 10);

      // Process user growth
      const usersByDay = userGrowth?.reduce((acc: any, user) => {
        const date = new Date(user.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {}) || {};

      const userGrowthChart = Object.entries(usersByDay)
        .map(([date, users]) => ({ date, users }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

      // Process device stats
      const deviceCounts = deviceStats?.reduce((acc: any, event) => {
        const device = event.device || 'Unknown';
        acc[device] = (acc[device] || 0) + 1;
        return acc;
      }, {}) || {};

      const deviceData = Object.entries(deviceCounts)
        .map(([device, count]) => ({ device, count }));

      // Calculate totals and KPIs
      const totalRevenue = revenueData?.reduce((sum, tip) => sum + (tip.amount || 0), 0) || 0;
      const avgSessionDuration = dailyAnalytics?.reduce((sum, day) => sum + day.average_session_duration_minutes, 0) / (dailyAnalytics?.length || 1) || 0;
      const avgBounceRate = dailyAnalytics?.reduce((sum, day) => sum + day.bounce_rate, 0) / (dailyAnalytics?.length || 1) || 0;

      return {
        dailyAnalyticsChart,
        dailyPlaysChart,
        topTracksData,
        userGrowthChart,
        deviceData,
        totalUsers: premiumConversion?.length || 0,
        premiumUsers: premiumConversion?.filter(u => u.is_premium).length || 0,
        totalPlays: dailyPlays?.length || 0,
        totalRevenue,
        avgSessionDuration,
        avgBounceRate,
        conversionRate: ((premiumConversion?.filter(u => u.is_premium).length || 0) / (premiumConversion?.length || 1)) * 100
      };
    },
  });

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    refetch();
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-primary" />
              Advanced Analytics
            </h2>
            <p className="text-muted-foreground">
              Comprehensive insights and real-time analytics for AlkePlay
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="365d">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Enhanced Analytics Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="realtime">Real-time</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="legacy">Legacy</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Enhanced Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">£{analytics?.totalRevenue?.toFixed(2) || '0.00'}</div>
                  <p className="text-xs text-muted-foreground">From tips & subscriptions</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.avgSessionDuration?.toFixed(1) || '0'}m</div>
                  <p className="text-xs text-muted-foreground">Session duration</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.avgBounceRate?.toFixed(1) || '0'}%</div>
                  <p className="text-xs text-muted-foreground">Users leaving quickly</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.conversionRate?.toFixed(1) || '0'}%</div>
                  <p className="text-xs text-muted-foreground">Premium conversion</p>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Charts */}
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>User Activity Overview</CardTitle>
                  <CardDescription>Comprehensive activity metrics over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analytics?.dailyAnalyticsChart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="users" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                      <Area type="monotone" dataKey="plays" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue & Conversion Trends</CardTitle>
                  <CardDescription>Financial metrics and conversion tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics?.dailyAnalyticsChart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} name="Revenue" />
                      <Line type="monotone" dataKey="conversionRate" stroke="#ef4444" strokeWidth={2} name="Conversion %" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="realtime">
            <RealTimeAnalytics />
          </TabsContent>

          <TabsContent value="behavior">
            <UserBehaviorAnalytics />
          </TabsContent>

          <TabsContent value="reports">
            <AdvancedReporting />
          </TabsContent>

          <TabsContent value="legacy" className="space-y-6">

            {/* Legacy Analytics View */}
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Plays</CardTitle>
                  <Play className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalPlays.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">All-time plays</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Registered users</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.premiumUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">Premium subscribers</p>
                </CardContent>
              </Card>
            </div>

            {/* Legacy Charts */}
            <div className="grid gap-4 md:grid-cols-2">
              {/* Daily Plays Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Plays</CardTitle>
                  <CardDescription>Track listening activity over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics?.dailyPlaysChart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="plays" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* User Growth Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>New user registrations over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics?.userGrowthChart}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {/* Top Tracks */}
              <Card>
            <CardHeader>
              <CardTitle>Top Tracks</CardTitle>
              <CardDescription>Most played tracks by play count</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.topTracksData.slice(0, 5).map((track, index) => (
                  <div key={track.trackId} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">#{index + 1}</Badge>
                      <div>
                        <p className="text-sm font-medium">Track {track.trackId.slice(0, 8)}...</p>
                        <p className="text-xs text-muted-foreground">{String(track.plays)} plays</p>
                      </div>
                    </div>
                    <Music className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

              {/* Device Stats */}
              <Card>
            <CardHeader>
              <CardTitle>Device Usage</CardTitle>
              <CardDescription>User device distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={analytics?.deviceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    label={(entry: any) => `${entry.device} ${((entry.percent || 0) * 100).toFixed(0)}%`}
                  >
                    {analytics?.deviceData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;