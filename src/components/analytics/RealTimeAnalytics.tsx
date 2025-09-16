import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Users, 
  Play, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Pause,
  PlayCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface RealTimeMetrics {
  activeUsers: number;
  currentPlays: number;
  newSignups: number;
  conversionEvents: number;
  timestamp: string;
}

export const RealTimeAnalytics = () => {
  const [metrics, setMetrics] = useState<RealTimeMetrics[]>([]);
  const [isTracking, setIsTracking] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTracking) {
      // Fetch initial data
      fetchRealTimeMetrics();
      
      // Set up real-time updates every 30 seconds
      interval = setInterval(fetchRealTimeMetrics, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking]);

  const fetchRealTimeMetrics = async () => {
    try {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

      const [
        { data: recentEvents },
        { data: newProfiles },
        { data: premiumConversions }
      ] = await Promise.all([
        supabase
          .from('events')
          .select('name, created_at, user_id')
          .gte('created_at', fiveMinutesAgo.toISOString()),
        supabase
          .from('profiles')
          .select('created_at')
          .gte('created_at', oneHourAgo.toISOString()),
        supabase
          .from('profiles')
          .select('created_at, is_premium')
          .eq('is_premium', true)
          .gte('created_at', oneHourAgo.toISOString())
      ]);

      const activeUsers = new Set(recentEvents?.map(e => e.user_id) || []).size;
      const currentPlays = recentEvents?.filter(e => e.name === 'play_started').length || 0;
      const newSignups = newProfiles?.length || 0;
      const conversionEvents = premiumConversions?.length || 0;

      const newMetric: RealTimeMetrics = {
        activeUsers,
        currentPlays,
        newSignups,
        conversionEvents,
        timestamp: now.toISOString()
      };

      setMetrics(prev => [...prev.slice(-19), newMetric]); // Keep last 20 data points
      setLastUpdate(now);
    } catch (error) {
      console.error('Error fetching real-time metrics:', error);
      toast({
        title: "Error",
        description: "Failed to fetch real-time analytics",
        variant: "destructive",
      });
    }
  };

  const currentMetrics = metrics[metrics.length - 1];
  const previousMetrics = metrics[metrics.length - 2];

  const getChangeIndicator = (current: number, previous: number) => {
    if (!previous) return { change: 0, isIncrease: false };
    const change = ((current - previous) / previous) * 100;
    return { change: Math.abs(change), isIncrease: change > 0 };
  };

  const toggleTracking = () => {
    setIsTracking(!isTracking);
    if (!isTracking) {
      toast({
        title: "Real-time tracking resumed",
        description: "Analytics will update every 30 seconds",
      });
    } else {
      toast({
        title: "Real-time tracking paused",
        description: "Click play to resume tracking",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            Real-Time Analytics
          </h2>
          <p className="text-muted-foreground">Live activity monitoring and alerts</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant={isTracking ? "default" : "secondary"} className="animate-pulse">
            {isTracking ? "Live" : "Paused"}
          </Badge>
          <Button variant="outline" size="sm" onClick={toggleTracking}>
            {isTracking ? (
              <Pause className="h-4 w-4 mr-1" />
            ) : (
              <PlayCircle className="h-4 w-4 mr-1" />
            )}
            {isTracking ? "Pause" : "Resume"}
          </Button>
          <Button variant="outline" size="sm" onClick={fetchRealTimeMetrics}>
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Last Update */}
      <div className="text-sm text-muted-foreground">
        Last updated: {lastUpdate.toLocaleTimeString()}
      </div>

      {/* Real-time Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-3xl font-bold">{currentMetrics?.activeUsers || 0}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            {currentMetrics && previousMetrics && (
              <div className="mt-4 flex items-center text-sm">
                {getChangeIndicator(currentMetrics.activeUsers, previousMetrics.activeUsers).isIncrease ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={getChangeIndicator(currentMetrics.activeUsers, previousMetrics.activeUsers).isIncrease ? "text-green-500" : "text-red-500"}>
                  {getChangeIndicator(currentMetrics.activeUsers, previousMetrics.activeUsers).change.toFixed(1)}%
                </span>
                <span className="text-muted-foreground ml-1">vs previous</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Plays</p>
                <p className="text-3xl font-bold">{currentMetrics?.currentPlays || 0}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Play className="h-6 w-6 text-green-600" />
              </div>
            </div>
            {currentMetrics && previousMetrics && (
              <div className="mt-4 flex items-center text-sm">
                {getChangeIndicator(currentMetrics.currentPlays, previousMetrics.currentPlays).isIncrease ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={getChangeIndicator(currentMetrics.currentPlays, previousMetrics.currentPlays).isIncrease ? "text-green-500" : "text-red-500"}>
                  {getChangeIndicator(currentMetrics.currentPlays, previousMetrics.currentPlays).change.toFixed(1)}%
                </span>
                <span className="text-muted-foreground ml-1">vs previous</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">New Signups (1h)</p>
                <p className="text-3xl font-bold">{currentMetrics?.newSignups || 0}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            {currentMetrics && previousMetrics && (
              <div className="mt-4 flex items-center text-sm">
                {getChangeIndicator(currentMetrics.newSignups, previousMetrics.newSignups).isIncrease ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={getChangeIndicator(currentMetrics.newSignups, previousMetrics.newSignups).isIncrease ? "text-green-500" : "text-red-500"}>
                  {getChangeIndicator(currentMetrics.newSignups, previousMetrics.newSignups).change.toFixed(1)}%
                </span>
                <span className="text-muted-foreground ml-1">vs previous</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversions (1h)</p>
                <p className="text-3xl font-bold">{currentMetrics?.conversionEvents || 0}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            {currentMetrics && previousMetrics && (
              <div className="mt-4 flex items-center text-sm">
                {getChangeIndicator(currentMetrics.conversionEvents, previousMetrics.conversionEvents).isIncrease ? (
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                )}
                <span className={getChangeIndicator(currentMetrics.conversionEvents, previousMetrics.conversionEvents).isIncrease ? "text-green-500" : "text-red-500"}>
                  {getChangeIndicator(currentMetrics.conversionEvents, previousMetrics.conversionEvents).change.toFixed(1)}%
                </span>
                <span className="text-muted-foreground ml-1">vs previous</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Real-time Chart */}
      {metrics.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Real-Time Activity</CardTitle>
            <CardDescription>Live user activity over the last 10 minutes</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleTimeString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleTimeString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="activeUsers" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Active Users"
                />
                <Line 
                  type="monotone" 
                  dataKey="currentPlays" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Current Plays"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};