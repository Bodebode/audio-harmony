import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Music, DollarSign, Play, TrendingUp, Eye } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";

const AdminDashboard = () => {
  // Fetch dashboard metrics
  const { data: metrics, isLoading, error } = useQuery({
    queryKey: ['admin-dashboard-metrics'],
    queryFn: async () => {
      try {
        const [
          profilesCount,
          releasesCount,
          tracksCount,
          playsCount,
          premiumCount,
          recentUsersResult,
          recentReleasesResult
        ] = await Promise.all([
          supabase.from('profiles').select('*', { count: 'exact', head: true }),
          supabase.from('releases').select('*', { count: 'exact', head: true }),
          supabase.from('tracks').select('*', { count: 'exact', head: true }),
          supabase.from('events').select('*', { count: 'exact', head: true }).eq('name', 'play_started'),
          supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_premium', true),
          supabase.from('profiles').select('display_name, created_at, is_premium').order('created_at', { ascending: false }).limit(5),
          supabase.from('releases').select('title, status, created_at').order('created_at', { ascending: false }).limit(5)
        ]);

        return {
          totalUsers: profilesCount.count || 0,
          totalReleases: releasesCount.count || 0,
          totalTracks: tracksCount.count || 0,
          totalPlays: playsCount.count || 0,
          premiumUsers: premiumCount.count || 0,
          recentUsers: recentUsersResult.data || [],
          recentReleases: recentReleasesResult.data || []
        };
      } catch (err) {
        console.error('Error fetching dashboard metrics:', err);
        return {
          totalUsers: 0,
          totalReleases: 0,
          totalTracks: 0,
          totalPlays: 0,
          premiumUsers: 0,
          recentUsers: [],
          recentReleases: []
        };
      }
    },
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  const conversionRate = metrics?.totalUsers ? 
    ((metrics.premiumUsers / metrics.totalUsers) * 100).toFixed(1) : '0';

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">
            Overview of your AlkePlay platform
          </p>
          {error && (
            <div className="mt-2 p-2 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded text-sm">
              Some metrics may be limited due to data access restrictions.
            </div>
          )}
        </div>

        {/* KPI Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered accounts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.premiumUsers}</div>
              <p className="text-xs text-muted-foreground">
                {conversionRate}% conversion rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Releases</CardTitle>
              <Music className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.totalReleases}</div>
              <p className="text-xs text-muted-foreground">
                {metrics?.totalTracks} total tracks
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Plays</CardTitle>
              <Play className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics?.totalPlays}</div>
              <p className="text-xs text-muted-foreground">
                All-time plays
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Latest user registrations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics?.recentUsers.map((user, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {user.display_name || 'Anonymous User'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    {user.is_premium && (
                      <Badge variant="secondary">Premium</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Releases</CardTitle>
              <CardDescription>Latest music releases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics?.recentReleases.map((release, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{release.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(release.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge 
                      variant={release.status === 'live' ? 'default' : 'secondary'}
                    >
                      {release.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;