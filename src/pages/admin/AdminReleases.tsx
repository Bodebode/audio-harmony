import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Plus, Music, Calendar, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

interface NewRelease {
  title: string;
  release_type: 'album' | 'single' | 'ep';
  release_date: string;
  preview_only: boolean;
  notes: string;
}

const AdminReleases = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newRelease, setNewRelease] = useState<NewRelease>({
    title: '',
    release_type: 'album',
    release_date: '',
    preview_only: false,
    notes: ''
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: releases, isLoading } = useQuery({
    queryKey: ['admin-releases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('releases')
        .select(`
          *,
          tracks (
            id,
            title,
            status
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const createReleaseMutation = useMutation({
    mutationFn: async (release: NewRelease) => {
      const { data, error } = await supabase
        .from('releases')
        .insert({
          ...release,
          release_date: release.release_date ? new Date(release.release_date).toISOString() : null,
          created_by_user_id: user?.id
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Release created successfully",
      });
      setIsCreateDialogOpen(false);
      setNewRelease({
        title: '',
        release_type: 'album',
        release_date: '',
        preview_only: false,
        notes: ''
      });
      queryClient.invalidateQueries({ queryKey: ['admin-releases'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create release",
        variant: "destructive",
      });
      console.error('Create release error:', error);
    },
  });

  const handleCreateRelease = () => {
    if (!newRelease.title.trim()) {
      toast({
        title: "Error",
        description: "Release title is required",
        variant: "destructive",
      });
      return;
    }
    
    createReleaseMutation.mutate(newRelease);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'default';
      case 'scheduled': return 'secondary';
      case 'draft': return 'outline';
      case 'archived': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Releases</h2>
            <p className="text-muted-foreground">
              Manage your music releases and tracks
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Release
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Release</DialogTitle>
                <DialogDescription>
                  Create a new music release (album, single, or EP)
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title *
                  </label>
                  <Input
                    id="title"
                    value={newRelease.title}
                    onChange={(e) => setNewRelease({ ...newRelease, title: e.target.value })}
                    placeholder="Enter release title"
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="type" className="text-sm font-medium">
                    Type
                  </label>
                  <Select
                    value={newRelease.release_type}
                    onValueChange={(value: 'album' | 'single' | 'ep') => 
                      setNewRelease({ ...newRelease, release_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="album">Album</SelectItem>
                      <SelectItem value="single">Single</SelectItem>
                      <SelectItem value="ep">EP</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="release_date" className="text-sm font-medium">
                    Release Date
                  </label>
                  <Input
                    id="release_date"
                    type="datetime-local"
                    value={newRelease.release_date}
                    onChange={(e) => setNewRelease({ ...newRelease, release_date: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    Notes
                  </label>
                  <Textarea
                    id="notes"
                    value={newRelease.notes}
                    onChange={(e) => setNewRelease({ ...newRelease, notes: e.target.value })}
                    placeholder="Internal notes about this release"
                    rows={3}
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={createReleaseMutation.isPending}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateRelease}
                  disabled={createReleaseMutation.isPending}
                >
                  {createReleaseMutation.isPending ? 'Creating...' : 'Create Release'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Releases Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Releases ({releases?.length || 0})</CardTitle>
            <CardDescription>Your music releases and their status</CardDescription>
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
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tracks</TableHead>
                    <TableHead>Release Date</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {releases?.map((release) => (
                    <TableRow key={release.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Music className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{release.title}</p>
                            {release.preview_only && (
                              <Badge variant="outline" className="text-xs">
                                Preview Only
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {release.release_type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(release.status)} className="capitalize">
                          {release.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {release.tracks?.length || 0} tracks
                        </span>
                      </TableCell>
                      <TableCell>
                        {release.release_date ? (
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3 w-3 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(release.release_date).toLocaleDateString()}
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Not set</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {new Date(release.created_at).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
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

export default AdminReleases;