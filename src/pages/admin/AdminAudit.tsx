import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  FileText, 
  Search, 
  Filter,
  Shield,
  User,
  Music,
  Play,
  Heart,
  Share2,
  Calendar,
  Clock
} from "lucide-react";
import { format } from "date-fns";

const AdminAudit = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [eventFilter, setEventFilter] = useState("all");
  const [dateRange, setDateRange] = useState("7d");

  const { data: auditEvents, isLoading } = useQuery({
    queryKey: ['admin-audit', searchTerm, eventFilter, dateRange],
    queryFn: async () => {
      let query = supabase
        .from('events')
        .select(`
          id,
          name,
          user_id,
          properties,
          created_at,
          device,
          country,
          city
        `)
        .order('created_at', { ascending: false });

      // Apply date filter
      const now = new Date();
      let startDate: Date;
      switch (dateRange) {
        case '1d':
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case '7d':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case '30d':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      }

      query = query.gte('created_at', startDate.toISOString());

      // Apply event type filter
      if (eventFilter !== "all") {
        query = query.eq('name', eventFilter);
      }

      // Apply search filter
      if (searchTerm) {
        query = query.or(
          `name.ilike.%${searchTerm}%,user_id.ilike.%${searchTerm}%,device.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query.limit(100);
      if (error) throw error;
      return data;
    },
  });

  const getEventIcon = (eventName: string) => {
    switch (eventName) {
      case 'play_started':
        return <Play className="h-4 w-4" />;
      case 'track_liked':
        return <Heart className="h-4 w-4" />;
      case 'track_shared':
        return <Share2 className="h-4 w-4" />;
      case 'user_login':
        return <User className="h-4 w-4" />;
      case 'music_uploaded':
        return <Music className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getEventBadgeColor = (eventName: string) => {
    switch (eventName) {
      case 'play_started':
        return 'default';
      case 'track_liked':
        return 'secondary';
      case 'track_shared':
        return 'outline';
      case 'user_login':
        return 'default';
      case 'music_uploaded':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const formatEventName = (name: string) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Get unique event types for filter
  const eventTypes = Array.from(new Set(auditEvents?.map(e => e.name) || []));

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Audit Log</h2>
          <p className="text-muted-foreground">
            Monitor system events and user activity
          </p>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            <CardDescription>Filter and search audit events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-2 flex-1">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search events, users, or devices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm"
                />
              </div>

              <Select value={eventFilter} onValueChange={setEventFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Event Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {eventTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {formatEventName(type)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24h</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Events Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Recent Events ({auditEvents?.length || 0})
            </CardTitle>
            <CardDescription>System events and user activities</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditEvents?.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getEventIcon(event.name)}
                          <Badge variant={getEventBadgeColor(event.name) as any}>
                            {formatEventName(event.name)}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {event.user_id ? (
                            <>
                              <p className="font-medium">{event.user_id.slice(0, 8)}...</p>
                              <p className="text-muted-foreground">
                                {event.device || 'Unknown device'}
                              </p>
                            </>
                          ) : (
                            <span className="text-muted-foreground">Anonymous</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {event.properties ? (
                            <div className="space-y-1">
                              {Object.entries(event.properties as Record<string, any>).map(([key, value]) => (
                                <div key={key} className="flex items-center gap-1">
                                  <span className="font-medium">{key}:</span>
                                  <span className="text-muted-foreground">
                                    {typeof value === 'string' && value.length > 20 
                                      ? `${value.slice(0, 20)}...` 
                                      : String(value)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">No details</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {event.city && event.country ? (
                            <p>{event.city}, {event.country}</p>
                          ) : event.country ? (
                            <p>{event.country}</p>
                          ) : (
                            <span className="text-muted-foreground">Unknown</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(event.created_at), 'MMM dd, HH:mm')}
                          </div>
                          <p className="text-muted-foreground text-xs">
                            {format(new Date(event.created_at), 'yyyy')}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminAudit;