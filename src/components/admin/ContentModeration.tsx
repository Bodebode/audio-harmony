import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  Flag,
  Music,
  User,
  MessageSquare
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdminLayout } from './AdminLayout';

interface ModerationItem {
  id: string;
  type: 'release' | 'track' | 'profile' | 'comment';
  title: string;
  description?: string;
  status: 'pending' | 'approved' | 'rejected';
  flagged_reason?: string;
  flagged_at: string;
  flagged_by?: string;
  content_data: any;
  review_notes?: string;
}

const ContentModeration = () => {
  const [selectedItem, setSelectedItem] = useState<ModerationItem | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for moderation queue - in real app, this would come from database
  const { data: moderationItems, isLoading } = useQuery({
    queryKey: ['moderation-queue'],
    queryFn: async () => {
      // This would be a real query to get flagged content
      const mockData: ModerationItem[] = [
        {
          id: '1',
          type: 'release',
          title: 'Questionable Album Title',
          description: 'Release contains potentially inappropriate content',
          status: 'pending',
          flagged_reason: 'Inappropriate content',
          flagged_at: new Date().toISOString(),
          content_data: { release_id: 'rel-123', artist: 'Artist Name' }
        },
        {
          id: '2',
          type: 'track',
          title: 'Track with explicit lyrics',
          description: 'Track flagged for explicit content without proper marking',
          status: 'pending',
          flagged_reason: 'Missing explicit tag',
          flagged_at: new Date(Date.now() - 86400000).toISOString(),
          content_data: { track_id: 'track-456', title: 'Song Title' }
        },
        {
          id: '3',
          type: 'profile',
          title: 'Inappropriate profile content',
          description: 'User profile contains inappropriate bio/images',
          status: 'pending',
          flagged_reason: 'Inappropriate profile content',
          flagged_at: new Date(Date.now() - 172800000).toISOString(),
          content_data: { user_id: 'user-789', display_name: 'User Name' }
        }
      ];
      return mockData;
    }
  });

  const moderationMutation = useMutation({
    mutationFn: async ({ itemId, action, notes }: { itemId: string, action: 'approve' | 'reject', notes: string }) => {
      // In real app, this would update the database
      console.log('Moderation action:', { itemId, action, notes });
      return { success: true };
    },
    onSuccess: (_, variables) => {
      toast({
        title: "Success",
        description: `Content ${variables.action}d successfully`,
      });
      queryClient.invalidateQueries({ queryKey: ['moderation-queue'] });
      setSelectedItem(null);
      setReviewNotes('');
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process moderation action",
        variant: "destructive",
      });
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'release':
      case 'track':
        return <Music className="h-4 w-4" />;
      case 'profile':
        return <User className="h-4 w-4" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Flag className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const handleModeration = (action: 'approve' | 'reject') => {
    if (!selectedItem) return;
    
    moderationMutation.mutate({
      itemId: selectedItem.id,
      action,
      notes: reviewNotes
    });
  };

  const pendingItems = moderationItems?.filter(item => item.status === 'pending') || [];
  const reviewedItems = moderationItems?.filter(item => item.status !== 'pending') || [];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Content Moderation</h2>
          <p className="text-muted-foreground">
            Review and moderate flagged content across the platform
          </p>
        </div>

        {/* Pending Review */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Pending Review ({pendingItems.length})
            </CardTitle>
            <CardDescription>
              Content awaiting moderation review
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : pendingItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <p>All content has been reviewed!</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Flagged</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(item.type)}
                          <span className="capitalize">{item.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{item.title}</p>
                          {item.description && (
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {item.flagged_reason}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {new Date(item.flagged_at).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <Badge variant={getStatusColor(item.status)} className="capitalize">
                            {item.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedItem(item)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Review
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                {getTypeIcon(item.type)}
                                Review {item.type}: {item.title}
                              </DialogTitle>
                              <DialogDescription>
                                Flagged for: {item.flagged_reason}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium mb-2">Content Details</h4>
                                <div className="p-4 bg-muted rounded-lg">
                                  <pre className="text-sm">
                                    {JSON.stringify(item.content_data, null, 2)}
                                  </pre>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium mb-2">Review Notes</h4>
                                <Textarea
                                  placeholder="Add your review notes here..."
                                  value={reviewNotes}
                                  onChange={(e) => setReviewNotes(e.target.value)}
                                  rows={3}
                                />
                              </div>
                            </div>

                            <DialogFooter className="gap-2">
                              <Button
                                variant="destructive"
                                onClick={() => handleModeration('reject')}
                                disabled={moderationMutation.isPending}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                              <Button
                                onClick={() => handleModeration('approve')}
                                disabled={moderationMutation.isPending}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Recently Reviewed */}
        {reviewedItems.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recently Reviewed ({reviewedItems.length})</CardTitle>
              <CardDescription>
                Recently processed moderation items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reviewed</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reviewedItems.slice(0, 10).map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(item.type)}
                          <span className="capitalize">{item.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{item.title}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          <Badge variant={getStatusColor(item.status)} className="capitalize">
                            {item.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {new Date(item.flagged_at).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {item.review_notes || 'No notes'}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
};

export default ContentModeration;