import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Mail, 
  Send, 
  Calendar, 
  Users, 
  Eye, 
  MousePointer, 
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  BarChart3
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/hooks/useAdmin';

interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  target_audience: 'all' | 'premium' | 'free' | 'new_users';
  status: 'draft' | 'scheduled' | 'sending' | 'sent' | 'cancelled';
  scheduled_at: string | null;
  sent_at: string | null;
  recipients_count: number;
  opened_count: number;
  clicked_count: number;
  created_at: string;
}

interface CampaignFormData {
  name: string;
  subject: string;
  content: string;
  target_audience: 'all' | 'premium' | 'free' | 'new_users';
  scheduled_at: string;
}

export const EmailCampaignManager = () => {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<EmailCampaign | null>(null);
  const [formData, setFormData] = useState<CampaignFormData>({
    name: '',
    subject: '',
    content: '',
    target_audience: 'all',
    scheduled_at: ''
  });
  const { toast } = useToast();
  const { isAdmin } = useAdmin();

  useEffect(() => {
    if (isAdmin) {
      fetchCampaigns();
    }
  }, [isAdmin]);

  const fetchCampaigns = async () => {
    try {
      const { data, error } = await supabase
        .from('email_campaigns' as any)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns((data as unknown as EmailCampaign[]) || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast({
        title: "Error",
        description: "Failed to load email campaigns",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const campaignData = {
        ...formData,
        scheduled_at: formData.scheduled_at || null,
        status: formData.scheduled_at ? 'scheduled' : 'draft'
      };

      if (editingCampaign) {
        const { error } = await supabase
          .from('email_campaigns' as any)
          .update(campaignData)
          .eq('id', editingCampaign.id);

        if (error) throw error;
        toast({
          title: "Campaign updated",
          description: "Email campaign has been updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('email_campaigns' as any)
          .insert([campaignData]);

        if (error) throw error;
        toast({
          title: "Campaign created",
          description: "Email campaign has been created successfully",
        });
      }

      setIsCreateOpen(false);
      setEditingCampaign(null);
      setFormData({
        name: '',
        subject: '',
        content: '',
        target_audience: 'all',
        scheduled_at: ''
      });
      fetchCampaigns();
    } catch (error) {
      console.error('Error saving campaign:', error);
      toast({
        title: "Error",
        description: "Failed to save campaign",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (campaign: EmailCampaign) => {
    setEditingCampaign(campaign);
    setFormData({
      name: campaign.name,
      subject: campaign.subject,
      content: campaign.content,
      target_audience: campaign.target_audience,
      scheduled_at: campaign.scheduled_at ? campaign.scheduled_at.slice(0, 16) : ''
    });
    setIsCreateOpen(true);
  };

  const handleDelete = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const { error } = await supabase
        .from('email_campaigns' as any)
        .delete()
        .eq('id', campaignId);

      if (error) throw error;
      
      toast({
        title: "Campaign deleted",
        description: "Email campaign has been deleted successfully",
      });
      fetchCampaigns();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        title: "Error",
        description: "Failed to delete campaign",
        variant: "destructive",
      });
    }
  };

  const handleSendNow = async (campaignId: string) => {
    if (!confirm('Are you sure you want to send this campaign now?')) return;

    try {
      // Update campaign status to sending
      const { error } = await supabase
        .from('email_campaigns' as any)
        .update({ 
          status: 'sending',
          sent_at: new Date().toISOString()
        })
        .eq('id', campaignId);

      if (error) throw error;

      toast({
        title: "Campaign sent",
        description: "Email campaign is being sent to recipients",
      });
      fetchCampaigns();
    } catch (error) {
      console.error('Error sending campaign:', error);
      toast({
        title: "Error",
        description: "Failed to send campaign",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'scheduled': return 'default';
      case 'sending': return 'default';
      case 'sent': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return Edit;
      case 'scheduled': return Calendar;
      case 'sending': return Send;
      case 'sent': return Eye;
      case 'cancelled': return Pause;
      default: return Edit;
    }
  };

  const calculateOpenRate = (campaign: EmailCampaign) => {
    if (campaign.recipients_count === 0) return 0;
    return ((campaign.opened_count / campaign.recipients_count) * 100).toFixed(1);
  };

  const calculateClickRate = (campaign: EmailCampaign) => {
    if (campaign.recipients_count === 0) return 0;
    return ((campaign.clicked_count / campaign.recipients_count) * 100).toFixed(1);
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Access Denied</h3>
          <p className="text-muted-foreground">You need admin privileges to access email campaigns.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-muted rounded w-48 animate-pulse" />
          <div className="h-10 bg-muted rounded w-32 animate-pulse" />
        </div>
        <Card className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-64 bg-muted rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Email Campaigns</h2>
          <p className="text-muted-foreground">Create and manage marketing email campaigns</p>
        </div>
        
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingCampaign ? 'Edit Campaign' : 'Create New Campaign'}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter campaign name"
                    required
                  />
                </div>
                
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
                      <SelectItem value="new_users">New Users</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Email Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Enter email subject"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="content">Email Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Enter email content (HTML supported)"
                  rows={8}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="scheduled_at">Schedule (Optional)</Label>
                <Input
                  id="scheduled_at"
                  type="datetime-local"
                  value={formData.scheduled_at}
                  onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCampaign ? 'Update Campaign' : 'Create Campaign'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Campaigns Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center py-12">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No campaigns yet</h3>
              <p className="text-muted-foreground mb-4">Create your first email campaign to get started.</p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Audience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Open Rate</TableHead>
                  <TableHead>Click Rate</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => {
                  const StatusIcon = getStatusIcon(campaign.status);
                  return (
                    <TableRow key={campaign.id}>
                      <TableCell className="font-medium">{campaign.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{campaign.subject}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {campaign.target_audience.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(campaign.status)} className="capitalize">
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {campaign.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{campaign.recipients_count.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3 text-muted-foreground" />
                          {calculateOpenRate(campaign)}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MousePointer className="h-3 w-3 text-muted-foreground" />
                          {calculateClickRate(campaign)}%
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {campaign.status === 'draft' && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(campaign)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleSendNow(campaign.id)}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(campaign.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};