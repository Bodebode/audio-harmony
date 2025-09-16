import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Users, 
  Play, 
  Heart,
  Share2,
  TrendingUp,
  Calendar,
  Music
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
  Cell
} from "recharts";

const AdminAnalytics = () => {
  // Fetch analytics data
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const [
        { data: dailyPlays },
        { data: topTracks },
        { data: userGrowth },
        { data: premiumConversion },
        { data: deviceStats }
      ] = await Promise.all([
        // Daily plays for last 30 days
        supabase
          .from('events')
          .select('created_at')
          .eq('name', 'play_started')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        
        // Top tracks by play count
        supabase
          .from('events')
          .select('properties')
          .eq('name', 'play_started')
          .not('properties->track_id', 'is', null)
          .limit(1000),
        
        // User growth over time
        supabase
          .from('profiles')
          .select('created_at')
          .gte('created_at', new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()),
        
        // Premium conversion data
        supabase
          .from('profiles')
          .select('is_premium, created_at, premium_expires_at'),
        
        // Device stats
        supabase
          .from('events')
          .select('device')
          .not('device', 'is', null)
          .limit(1000)
      ]);

      // Process daily plays data
      const playsByDay = dailyPlays?.reduce((acc: any, play) => {
        const date = new Date(play.created_at).toLocaleDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {}) || {};

      const dailyPlaysChart = Object.entries(playsByDay)
        .map(([date, plays]) => ({ date, plays }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-14); // Last 14 days

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

      return {
        dailyPlaysChart,
        topTracksData,
        userGrowthChart,
        deviceData,
        totalUsers: premiumConversion?.length || 0,
        premiumUsers: premiumConversion?.filter(u => u.is_premium).length || 0,
        totalPlays: dailyPlays?.length || 0
      };
    },
  });

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

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
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">
            Detailed insights and metrics for AlkePlay
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3">
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
              <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.totalUsers ? 
                  ((analytics.premiumUsers / analytics.totalUsers) * 100).toFixed(1) : '0'}%
              </div>
              <p className="text-xs text-muted-foreground">Premium conversion</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Daily Plays Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Plays (Last 14 Days)</CardTitle>
              <CardDescription>Track listening activity</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics?.dailyPlaysChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="plays" stroke="#8884d8" strokeWidth={2} />
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
                  <Bar dataKey="users" fill="#82ca9d" />
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
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;