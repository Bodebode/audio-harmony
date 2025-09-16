import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  MousePointer, 
  Clock, 
  Route,
  Search,
  Shuffle,
  Eye,
  ArrowRight,
  TrendingUp,
  Filter
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
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
  Sankey
} from 'recharts';

interface UserJourney {
  step: string;
  page: string;
  users: number;
  dropoffRate: number;
}

interface SessionData {
  duration: number;
  pagesVisited: number;
  actions: number;
  bounced: boolean;
  converted: boolean;
}

interface SearchBehavior {
  query: string;
  frequency: number;
  successRate: number;
}

export const UserBehaviorAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [journeyData, setJourneyData] = useState<UserJourney[]>([]);
  const [sessionData, setSessionData] = useState<SessionData[]>([]);
  const [searchData, setSearchData] = useState<SearchBehavior[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchBehaviorData();
  }, [timeRange]);

  const fetchBehaviorData = async () => {
    setLoading(true);
    try {
      // Simulate fetching user behavior data
      // In a real implementation, this would query the user_journeys, user_sessions tables
      
      // Sample user journey data
      setJourneyData([
        { step: '1', page: 'Homepage', users: 1000, dropoffRate: 15 },
        { step: '2', page: 'Browse Music', users: 850, dropoffRate: 25 },
        { step: '3', page: 'Play Track', users: 638, dropoffRate: 35 },
        { step: '4', page: 'Sign Up', users: 415, dropoffRate: 60 },
        { step: '5', page: 'Premium Signup', users: 166, dropoffRate: 80 },
        { step: '6', page: 'Payment', users: 33, dropoffRate: 10 }
      ]);

      // Sample session data
      const sessions: SessionData[] = [];
      for (let i = 0; i < 100; i++) {
        sessions.push({
          duration: Math.floor(Math.random() * 60) + 5,
          pagesVisited: Math.floor(Math.random() * 10) + 1,
          actions: Math.floor(Math.random() * 20) + 1,
          bounced: Math.random() > 0.6,
          converted: Math.random() > 0.85
        });
      }
      setSessionData(sessions);

      // Sample search behavior
      setSearchData([
        { query: 'hip hop', frequency: 245, successRate: 85 },
        { query: 'jazz music', frequency: 189, successRate: 78 },
        { query: 'pop songs', frequency: 167, successRate: 82 },
        { query: 'rock classics', frequency: 143, successRate: 90 },
        { query: 'electronic', frequency: 122, successRate: 75 },
        { query: 'acoustic', frequency: 98, successRate: 88 },
        { query: 'indie music', frequency: 87, successRate: 72 },
        { query: 'classical', frequency: 76, successRate: 95 }
      ]);
    } catch (error) {
      console.error('Error fetching behavior data:', error);
      toast({
        title: "Error",
        description: "Failed to load behavior analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-8 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-64 bg-muted rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  const avgSessionDuration = sessionData.reduce((acc, s) => acc + s.duration, 0) / sessionData.length;
  const avgPagesVisited = sessionData.reduce((acc, s) => acc + s.pagesVisited, 0) / sessionData.length;
  const bounceRate = (sessionData.filter(s => s.bounced).length / sessionData.length) * 100;
  const conversionRate = (sessionData.filter(s => s.converted).length / sessionData.length) * 100;

  const pageFlowData = journeyData.map((item, index) => ({
    ...item,
    conversion: index === 0 ? 100 : ((item.users / journeyData[0].users) * 100).toFixed(1)
  }));

  const sessionDurationData = [
    { range: '0-2 min', count: sessionData.filter(s => s.duration <= 2).length },
    { range: '2-5 min', count: sessionData.filter(s => s.duration > 2 && s.duration <= 5).length },
    { range: '5-10 min', count: sessionData.filter(s => s.duration > 5 && s.duration <= 10).length },
    { range: '10-20 min', count: sessionData.filter(s => s.duration > 10 && s.duration <= 20).length },
    { range: '20+ min', count: sessionData.filter(s => s.duration > 20).length }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MousePointer className="h-6 w-6 text-primary" />
            User Behavior Analytics
          </h2>
          <p className="text-muted-foreground">Detailed analysis of user interactions and journey patterns</p>
        </div>
        
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">Last day</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Session Duration</p>
                <p className="text-3xl font-bold">{avgSessionDuration.toFixed(1)}m</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+12%</span>
              <span className="text-muted-foreground ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pages per Session</p>
                <p className="text-3xl font-bold">{avgPagesVisited.toFixed(1)}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+8%</span>
              <span className="text-muted-foreground ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bounce Rate</p>
                <p className="text-3xl font-bold">{bounceRate.toFixed(1)}%</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Route className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-red-500">-3%</span>
              <span className="text-muted-foreground ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                <p className="text-3xl font-bold">{conversionRate.toFixed(1)}%</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-green-500">+5%</span>
              <span className="text-muted-foreground ml-1">vs last period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="journey" className="space-y-4">
        <TabsList>
          <TabsTrigger value="journey">User Journey</TabsTrigger>
          <TabsTrigger value="sessions">Session Analysis</TabsTrigger>
          <TabsTrigger value="search">Search Behavior</TabsTrigger>
          <TabsTrigger value="features">Feature Adoption</TabsTrigger>
        </TabsList>

        <TabsContent value="journey" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Flow Funnel */}
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>User journey from landing to conversion</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pageFlowData.map((step, index) => (
                    <div key={step.step} className="relative">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                            {step.step}
                          </div>
                          <div>
                            <h4 className="font-medium">{step.page}</h4>
                            <p className="text-sm text-muted-foreground">{step.users.toLocaleString()} users</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{step.conversion}%</p>
                          {index > 0 && (
                            <p className="text-sm text-red-500">-{step.dropoffRate}% dropoff</p>
                          )}
                        </div>
                      </div>
                      {index < pageFlowData.length - 1 && (
                        <div className="flex justify-center my-2">
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Page Flow Visualization */}
            <Card>
              <CardHeader>
                <CardTitle>User Flow Visualization</CardTitle>
                <CardDescription>Visual representation of user paths</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={pageFlowData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="page" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="users" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Session Duration Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Session Duration Distribution</CardTitle>
                <CardDescription>How long users spend on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sessionDurationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Session Quality Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Session Quality Metrics</CardTitle>
                <CardDescription>Analysis of session engagement quality</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span>High Engagement Sessions</span>
                    <Badge variant="default">
                      {sessionData.filter(s => s.duration > 10 && s.pagesVisited > 5).length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span>Medium Engagement Sessions</span>
                    <Badge variant="secondary">
                      {sessionData.filter(s => s.duration > 5 && s.duration <= 10).length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span>Low Engagement Sessions</span>
                    <Badge variant="outline">
                      {sessionData.filter(s => s.duration <= 5).length}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                    <span>Bounce Sessions</span>
                    <Badge variant="destructive">
                      {sessionData.filter(s => s.bounced).length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Search Behavior Analysis</CardTitle>
              <CardDescription>What users are searching for and success rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {searchData.map((search, index) => (
                  <div key={search.query} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium">"{search.query}"</h4>
                        <p className="text-sm text-muted-foreground">{search.frequency} searches</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={search.successRate > 80 ? "default" : search.successRate > 60 ? "secondary" : "destructive"}>
                        {search.successRate}% success
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Feature Adoption */}
            <Card>
              <CardHeader>
                <CardTitle>Feature Adoption Rates</CardTitle>
                <CardDescription>How users are adopting platform features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Music Player</span>
                      <span>95%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Playlists</span>
                      <span>68%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '68%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Likes/Favorites</span>
                      <span>72%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Social Sharing</span>
                      <span>34%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '34%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Premium Features</span>
                      <span>18%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '18%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* User Segments */}
            <Card>
              <CardHeader>
                <CardTitle>User Segments by Behavior</CardTitle>
                <CardDescription>Different user behavior patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Active Listeners', value: 45, color: '#3b82f6' },
                        { name: 'Casual Users', value: 30, color: '#10b981' },
                        { name: 'Premium Subscribers', value: 15, color: '#f59e0b' },
                        { name: 'New Users', value: 10, color: '#ef4444' }
                      ]}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {[
                        { name: 'Active Listeners', value: 45, color: '#3b82f6' },
                        { name: 'Casual Users', value: 30, color: '#10b981' },
                        { name: 'Premium Subscribers', value: 15, color: '#f59e0b' },
                        { name: 'New Users', value: 10, color: '#ef4444' }
                      ].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
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
  );
};