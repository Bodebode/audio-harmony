import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
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
  ListMusic, 
  Plus, 
  Edit, 
  Trash2, 
  Music, 
  Play,
  Eye,
  EyeOff,
  Star,
  Clock,
  Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Playlist {
  id: string;
  title: string;
  description?: string;
  cover_url?: string;
  is_public: boolean;
  is_featured: boolean;
  created_by: string;
  track_count: number;
  total_duration: number;
  play_count: number;
  created_at: string;
  updated_at: string;
}

interface PlaylistTrack {
  id: string;
  playlist_id: string;
  track_id: string;
  position: number;
  added_at: string;
  track: {
    title: string;
    duration_sec: number;
    release: {
      title: string;
    };
  };
}

const AdminPlaylist = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'details'>('list');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    cover_url: '',
    is_public: true,
    is_featured: false,
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock data for playlists - in real app, this would come from database
  const { data: playlists, isLoading } = useQuery({
    queryKey: ['admin-playlists'],
    queryFn: async () => {
      // This would be a real query to get playlists
      const mockData: Playlist[] = [
        {
          id: '1',
          title: 'Top Hits 2024',
          description: 'The biggest hits of the year',
          cover_url: '/api/placeholder/300/300',
          is_public: true,
          is_featured: true,
          created_by: 'admin',
          track_count: 25,
          total_duration: 5400, // seconds
          play_count: 1250,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Chill Vibes',
          description: 'Relaxing music for any time',
          is_public: true,
          is_featured: false,
          created_by: 'admin',
          track_count: 18,
          total_duration: 3600,
          play_count: 856,
          created_at: new Date(Date.now() - 86400000).toISOString(),
          updated_at: new Date(Date.now() - 86400000).toISOString()
        },
        {
          id: '3',
          title: 'New Discoveries',
          description: 'Fresh tracks from emerging artists',
          is_public: false,
          is_featured: false,
          created_by: 'admin',
          track_count: 12,
          total_duration: 2880,
          play_count: 234,
          created_at: new Date(Date.now() - 172800000).toISOString(),
          updated_at: new Date(Date.now() - 172800000).toISOString()
        }
      ];
      return mockData;
    }
  });

  // Mock data for playlist tracks
  const { data: playlistTracks } = useQuery({
    queryKey: ['playlist-tracks', selectedPlaylist?.id],
    queryFn: async () => {
      if (!selectedPlaylist) return [];
      
      // This would be a real query to get playlist tracks
      const mockTracks: PlaylistTrack[] = [
        {
          id: '1',
          playlist_id: selectedPlaylist.id,
          track_id: 'track-1',
          position: 1,
          added_at: new Date().toISOString(),
          track: {
            title: 'Amazing Song',
            duration_sec: 210,
            release: { title: 'Great Album' }
          }
        },
        {
          id: '2',
          playlist_id: selectedPlaylist.id,
          track_id: 'track-2',
          position: 2,
          added_at: new Date().toISOString(),
          track: {
            title: 'Another Hit',
            duration_sec: 195,
            release: { title: 'Hit Collection' }
          }
        }
      ];
      return mockTracks;
    },
    enabled: !!selectedPlaylist && viewMode === 'details'
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      // In real app, this would create in database
      console.log('Creating playlist:', data);
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Playlist created successfully",
      });
      setIsCreateDialogOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['admin-playlists'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create playlist",
        variant: "destructive",
      });
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<typeof formData>) => {
      // In real app, this would update in database
      console.log('Updating playlist:', { id, data });
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Playlist updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-playlists'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update playlist",
        variant: "destructive",
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // In real app, this would delete from database
      console.log('Deleting playlist:', id);
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Playlist deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-playlists'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete playlist",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      cover_url: '',
      is_public: true,
      is_featured: false,
    });
    setSelectedPlaylist(null);
  };

  const handleSubmit = () => {
    if (selectedPlaylist) {
      updateMutation.mutate({ id: selectedPlaylist.id, ...formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setFormData({
      title: playlist.title,
      description: playlist.description || '',
      cover_url: playlist.cover_url || '',
      is_public: playlist.is_public,
      is_featured: playlist.is_featured,
    });
    setIsCreateDialogOpen(true);
  };

  const handleToggleVisibility = (playlist: Playlist) => {
    updateMutation.mutate({
      id: playlist.id,
      is_public: !playlist.is_public
    });
  };

  const handleToggleFeatured = (playlist: Playlist) => {
    updateMutation.mutate({
      id: playlist.id,
      is_featured: !playlist.is_featured
    });
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  if (viewMode === 'details' && selectedPlaylist) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <div>
            <Button 
              variant="outline" 
              onClick={() => {
                setViewMode('list');
                setSelectedPlaylist(null);
              }}
              className="mb-4"
            >
              ← Back to Playlists
            </Button>
            <h2 className="text-3xl font-bold tracking-tight">{selectedPlaylist.title}</h2>
            <p className="text-muted-foreground">
              {selectedPlaylist.description || 'No description'}
            </p>
          </div>

          {/* Playlist Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Tracks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedPlaylist.track_count}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatDuration(selectedPlaylist.total_duration)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Plays</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{selectedPlaylist.play_count}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Badge variant={selectedPlaylist.is_public ? 'default' : 'secondary'}>
                    {selectedPlaylist.is_public ? 'Public' : 'Private'}
                  </Badge>
                  {selectedPlaylist.is_featured && (
                    <Badge variant="outline">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Playlist Tracks */}
          <Card>
            <CardHeader>
              <CardTitle>Tracks</CardTitle>
              <CardDescription>Songs in this playlist</CardDescription>
            </CardHeader>
            <CardContent>
              {playlistTracks && playlistTracks.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Album</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Added</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {playlistTracks.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.position}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Music className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{item.track.title}</span>
                          </div>
                        </TableCell>
                        <TableCell>{item.track.release.title}</TableCell>
                        <TableCell>{formatDuration(item.track.duration_sec)}</TableCell>
                        <TableCell>
                          {new Date(item.added_at).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ListMusic className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No tracks in this playlist yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Playlists</h2>
            <p className="text-muted-foreground">
              Manage curated playlists and collections
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
            setIsCreateDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Playlist
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {selectedPlaylist ? 'Edit Playlist' : 'Create Playlist'}
                </DialogTitle>
                <DialogDescription>
                  Create or update a curated playlist
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Playlist title"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe this playlist"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="cover_url">Cover Image URL (optional)</Label>
                  <Input
                    id="cover_url"
                    value={formData.cover_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, cover_url: e.target.value }))}
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_public"
                      checked={formData.is_public}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="is_public">Public playlist</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="is_featured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                      className="rounded"
                    />
                    <Label htmlFor="is_featured">Featured playlist</Label>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={!formData.title || createMutation.isPending || updateMutation.isPending}
                >
                  {selectedPlaylist ? 'Update' : 'Create'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Playlists Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Playlists ({playlists?.length || 0})</CardTitle>
            <CardDescription>Manage your curated playlists</CardDescription>
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
                    <TableHead>Title</TableHead>
                    <TableHead>Tracks</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Plays</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {playlists?.map((playlist) => (
                    <TableRow key={playlist.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ListMusic className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{playlist.title}</p>
                            {playlist.description && (
                              <p className="text-sm text-muted-foreground truncate max-w-xs">
                                {playlist.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Music className="h-3 w-3 text-muted-foreground" />
                          <span>{playlist.track_count}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span>{formatDuration(playlist.total_duration)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Play className="h-3 w-3 text-muted-foreground" />
                          <span>{playlist.play_count}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Badge variant={playlist.is_public ? 'default' : 'secondary'}>
                            {playlist.is_public ? 'Public' : 'Private'}
                          </Badge>
                          {playlist.is_featured && (
                            <Badge variant="outline">
                              <Star className="h-3 w-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {new Date(playlist.created_at).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedPlaylist(playlist);
                              setViewMode('details');
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleVisibility(playlist)}
                          >
                            {playlist.is_public ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleFeatured(playlist)}
                          >
                            <Star className={`h-3 w-3 ${playlist.is_featured ? 'fill-current' : ''}`} />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(playlist)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteMutation.mutate(playlist.id)}
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

export default AdminPlaylist;