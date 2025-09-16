import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Star, 
  Plus, 
  Edit, 
  Trash2, 
  Music, 
  User, 
  Calendar,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdminLayout } from './AdminLayout';

interface FeaturedItem {
  id: string;
  type: 'release' | 'artist' | 'playlist' | 'track';
  content_id: string;
  title: string;
  description?: string;
  image_url?: string;
  priority: number;
  is_active: boolean;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

const FeaturedContentManager = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FeaturedItem | null>(null);
  const [formData, setFormData] = useState({
    type: 'release',
    content_id: '',
    title: '',
    description: '',
    image_url: '',
    priority: 1,
    is_active: true,
    start_date: '',
    end_date: '',
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for featured content - in real app, this would come from database
  const { data: featuredItems, isLoading } = useQuery({
    queryKey: ['featured-content'],
    queryFn: async () => {
      // This would be a real query to get featured content
      const mockData: FeaturedItem[] = [
        {
          id: '1',
          type: 'release',
          content_id: 'rel-123',
          title: 'Featured Album of the Week',
          description: 'Amazing new album from rising artist',
          image_url: '/api/placeholder/300/300',
          priority: 1,
          is_active: true,
          start_date: new Date().toISOString(),
          end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          type: 'artist',
          content_id: 'artist-456',
          title: 'Artist Spotlight',
          description: 'Discover this talented artist',
          priority: 2,
          is_active: true,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          type: 'playlist',
          content_id: 'playlist-789',
          title: 'Curated Playlist',
          description: 'Best tracks of the month',
          priority: 3,
          is_active: false,
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      return mockData.sort((a, b) => a.priority - b.priority);
    }
  });

  // Mock query for available content to feature
  const { data: availableContent } = useQuery({
    queryKey: ['available-content', formData.type],
    queryFn: async () => {
      // This would be a real query based on type
      const mockContent = {
        release: [
          { id: 'rel-1', title: 'Album One' },
          { id: 'rel-2', title: 'Album Two' },
        ],
        artist: [
          { id: 'artist-1', title: 'Artist Name' },
          { id: 'artist-2', title: 'Another Artist' },
        ],
        playlist: [
          { id: 'playlist-1', title: 'Top Hits' },
          { id: 'playlist-2', title: 'Chill Vibes' },
        ],
        track: [
          { id: 'track-1', title: 'Song One' },
          { id: 'track-2', title: 'Song Two' },
        ]
      };
      return mockContent[formData.type as keyof typeof mockContent] || [];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // In real app, this would create in database
      console.log('Creating featured item:', data);
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Featured content created successfully",
      });
      setIsCreateDialogOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['featured-content'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create featured content",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<typeof formData>) => {
      // In real app, this would update in database
      console.log('Updating featured item:', { id, data });
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Featured content updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['featured-content'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update featured content",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // In real app, this would delete from database
      console.log('Deleting featured item:', id);
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Featured content deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['featured-content'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete featured content",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      type: 'release',
      content_id: '',
      title: '',
      description: '',
      image_url: '',
      priority: 1,
      is_active: true,
      start_date: '',
      end_date: '',
    });
    setSelectedItem(null);
  };

  const handleSubmit = () => {
    if (selectedItem) {
      updateMutation.mutate({ id: selectedItem.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (item: FeaturedItem) => {
    setSelectedItem(item);
    setFormData({
      type: item.type,
      content_id: item.content_id,
      title: item.title,
      description: item.description || '',
      image_url: item.image_url || '',
      priority: item.priority,
      is_active: item.is_active,
      start_date: item.start_date || '',
      end_date: item.end_date || '',
    });
    setIsCreateDialogOpen(true);
  };

  const handleToggleActive = (item: FeaturedItem) => {
    updateMutation.mutate({
      id: item.id,
      is_active: !item.is_active
    });
  };

  const handlePriorityChange = (item: FeaturedItem, direction: 'up' | 'down') => {
    const newPriority = direction === 'up' ? item.priority - 1 : item.priority + 1;
    updateMutation.mutate({
      id: item.id,
      priority: Math.max(1, newPriority)
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'release':
      case 'track':
        return <Music className="h-4 w-4" />;
      case 'artist':
        return <User className="h-4 w-4" />;
      default:
        return <Star className="h-4 w-4" />;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Featured Content</h2>
            <p className="text-muted-foreground">
              Manage featured content displayed on the platform
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Featured Content
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedItem ? 'Edit Featured Content' : 'Add Featured Content'}
                </DialogTitle>
                <DialogDescription>
                  Create or update featured content for the platform
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Content Type</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, type: value, content_id: '' }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="release">Release</SelectItem>
                        <SelectItem value="artist">Artist</SelectItem>
                        <SelectItem value="playlist">Playlist</SelectItem>
                        <SelectItem value="track">Track</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="content_id">Select Content</Label>
                    <Select 
                      value={formData.content_id} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, content_id: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose content..." />
                      </SelectTrigger>
                      <SelectContent>
                        {availableContent?.map((content) => (
                          <SelectItem key={content.id} value={content.id}>
                            {content.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="title">Display Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Featured content title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Description for the featured content"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="image_url">Custom Image URL (optional)</Label>
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Input
                      id="priority"
                      type="number"
                      min="1"
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: parseInt(e.target.value) || 1 }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="start_date">Start Date (optional)</Label>
                    <Input
                      id="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="end_date">End Date (optional)</Label>
                    <Input
                      id="end_date"
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!formData.title || !formData.content_id || createMutation.isPending || updateMutation.isPending}
                >
                  {selectedItem ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Featured Content Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Featured Content ({featuredItems?.length || 0})</CardTitle>
            <CardDescription>Manage your featured content items</CardDescription>
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
                    <TableHead>Priority</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {featuredItems?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handlePriorityChange(item, 'up')}
                            disabled={item.priority === 1}
                          >
                            <ArrowUp className="h-3 w-3" />
                          </Button>
                          <span className="font-mono text-sm">{item.priority}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handlePriorityChange(item, 'down')}
                          >
                            <ArrowDown className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(item.type)}
                          <Badge variant="outline" className="capitalize">
                            {item.type}
                          </Badge>
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
                        <div className="flex items-center gap-2">
                          {item.is_active ? (
                            <Eye className="h-4 w-4 text-green-500" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          )}
                          <Badge variant={item.is_active ? 'default' : 'secondary'}>
                            {item.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.start_date || item.end_date ? (
                          <div className="text-sm">
                            {item.start_date && (
                              <div>From: {new Date(item.start_date).toLocaleDateString()}</div>
                            )}
                            {item.end_date && (
                              <div>Until: {new Date(item.end_date).toLocaleDateString()}</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No schedule</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleActive(item)}
                          >
                            {item.is_active ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(item)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteMutation.mutate(item.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
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

export default FeaturedContentManager;