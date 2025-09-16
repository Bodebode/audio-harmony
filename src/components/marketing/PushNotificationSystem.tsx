import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Bell, 
  Send, 
  Users, 
  Music, 
  Star, 
  AlertCircle,
  Plus,
  X,
  ExternalLink,
  Clock,
  Check
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';

interface PushNotification {
  id: string;
  title: string;
  message: string;
  user_id: string | null;
  target_audience: 'all' | 'premium' | 'free' | 'specific_user';
  notification_type: 'general' | 'release' | 'promotion' | 'system';
  is_read: boolean;
  action_url: string | null;
  metadata: any;
  created_at: string;
  expires_at: string | null;
}

interface NotificationFormData {
  title: string;
  message: string;
  target_audience: 'all' | 'premium' | 'free' | 'specific_user';
  notification_type: 'general' | 'release' | 'promotion' | 'system';
  action_url: string;
  expires_at: string;
  specific_user_email: string;
}

export const PushNotificationSystem = () => {
  const [notifications, setNotifications] = useState<PushNotification[]>([]);
  const [userNotifications, setUserNotifications] = useState<PushNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState<NotificationFormData>({
    title: '',
    message: '',
    target_audience: 'all',
    notification_type: 'general',
    action_url: '',
    expires_at: '',
    specific_user_email: ''
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const { isAdmin } = useAdmin();

  useEffect(() => {
    if (user) {
      fetchUserNotifications();
      
      if (isAdmin) {
        fetchAllNotifications();
      }
    }
  }, [user, isAdmin]);

  const fetchUserNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('push_notifications' as any)
        .select('*')
        .or(`user_id.eq.${user?.id},user_id.is.null`)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setUserNotifications((data as unknown as PushNotification[]) || []);
    } catch (error) {
      console.error('Error fetching user notifications:', error);
    }
  };

  const fetchAllNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('push_notifications' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications((data as unknown as PushNotification[]) || []);
    } catch (error) {
      console.error('Error fetching all notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let targetUserId = null;
      
      // If targeting specific user, find their ID
      if (formData.target_audience === 'specific_user' && formData.specific_user_email) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('user_id')
          .eq('display_name', formData.specific_user_email)
          .single();
        
        if (profileData) {
          targetUserId = profileData.user_id;
        } else {
          toast({
            title: "User not found",
            description: "Could not find user with that email",
            variant: "destructive",
          });
          return;
        }
      }

      const notificationData = {
        title: formData.title,
        message: formData.message,
        user_id: targetUserId,
        target_audience: formData.target_audience,
        notification_type: formData.notification_type,
        action_url: formData.action_url || null,
        expires_at: formData.expires_at || null,
        metadata: {}
      };

      const { error } = await supabase
        .from('push_notifications' as any)
        .insert([notificationData]);

      if (error) throw error;

      toast({
        title: "Notification sent",
        description: "Push notification has been sent successfully",
      });

      setIsCreateOpen(false);
      setFormData({
        title: '',
        message: '',
        target_audience: 'all',
        notification_type: 'general',
        action_url: '',
        expires_at: '',
        specific_user_email: ''
      });
      
      fetchAllNotifications();
      fetchUserNotifications();
    } catch (error) {
      console.error('Error creating notification:', error);
      toast({
        title: "Error",
        description: "Failed to send notification",
        variant: "destructive",
      });
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('push_notifications' as any)
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      setUserNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const dismissNotification = (notificationId: string) => {
    setUserNotifications(prev =>
      prev.filter(notif => notif.id !== notificationId)
    );
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'release': return Music;
      case 'promotion': return Star;
      case 'system': return AlertCircle;
      default: return Bell;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'release': return 'default';
      case 'promotion': return 'secondary';
      case 'system': return 'destructive';
      default: return 'outline';
    }
  };

  const unreadCount = userNotifications.filter(n => !n.is_read).length;

  return (
    <div className="space-y-6">
      {/* User Notifications Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Your Notifications
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            {userNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No notifications</h3>
                <p className="text-muted-foreground">You're all caught up!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {userNotifications.map((notification) => {
                  const Icon = getNotificationIcon(notification.notification_type);
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 rounded-lg border transition-colors ${
                        notification.is_read 
                          ? 'bg-muted/30 border-muted' 
                          : 'bg-primary/5 border-primary/20'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm">{notification.title}</h4>
                              <Badge variant={getTypeColor(notification.notification_type)} className="text-xs">
                                {notification.notification_type}
                              </Badge>
                              {!notification.is_read && (
                                <div className="h-2 w-2 bg-primary rounded-full" />
                              )}
                            </div>
                            
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(notification.created_at).toLocaleDateString()}
                              </span>
                              
                              {notification.expires_at && (
                                <span>
                                  Expires: {new Date(notification.expires_at).toLocaleDateString()}
                                </span>
                              )}
                            </div>

                            {notification.action_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2"
                                onClick={() => window.open(notification.action_url!, '_blank')}
                              >
                                <ExternalLink className="h-3 w-3 mr-1" />
                                View
                              </Button>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => dismissNotification(notification.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Admin Panel */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Notification Management</CardTitle>
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Send Notification
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Send Push Notification</DialogTitle>
                  </DialogHeader>
                  
                  <form onSubmit={handleCreateNotification} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                          placeholder="Notification title"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="notification_type">Type</Label>
                        <Select 
                          value={formData.notification_type} 
                          onValueChange={(value: any) => setFormData({ ...formData, notification_type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General</SelectItem>
                            <SelectItem value="release">New Release</SelectItem>
                            <SelectItem value="promotion">Promotion</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Notification message"
                        rows={3}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="target_audience">Target Audience</Label>
                        <Select 
                          value={formData.target_audience} 
                          onValueChange={(value: any) => setFormData({ ...formData, target_audience: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Users</SelectItem>
                            <SelectItem value="premium">Premium Users</SelectItem>
                            <SelectItem value="free">Free Users</SelectItem>
                            <SelectItem value="specific_user">Specific User</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {formData.target_audience === 'specific_user' && (
                        <div className="space-y-2">
                          <Label htmlFor="specific_user_email">User Email</Label>
                          <Input
                            id="specific_user_email"
                            value={formData.specific_user_email}
                            onChange={(e) => setFormData({ ...formData, specific_user_email: e.target.value })}
                            placeholder="user@example.com"
                            required
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="action_url">Action URL (Optional)</Label>
                        <Input
                          id="action_url"
                          value={formData.action_url}
                          onChange={(e) => setFormData({ ...formData, action_url: e.target.value })}
                          placeholder="https://example.com"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="expires_at">Expires At (Optional)</Label>
                        <Input
                          id="expires_at"
                          type="datetime-local"
                          value={formData.expires_at}
                          onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        <Send className="h-4 w-4 mr-2" />
                        Send Notification
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Bell className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">Total Sent</p>
                        <p className="text-2xl font-bold">{notifications.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">Active Today</p>
                        <p className="text-2xl font-bold">
                          {notifications.filter(n => 
                            new Date(n.created_at).toDateString() === new Date().toDateString()
                          ).length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="text-sm font-medium">Promotions</p>
                        <p className="text-2xl font-bold">
                          {notifications.filter(n => n.notification_type === 'promotion').length}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};