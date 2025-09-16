import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Plus, Music, Calendar, Eye, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ReleaseForm } from "@/components/admin/ReleaseForm";

const AdminReleases = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();
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
    mutationFn: async () => {
      // This will be handled by the ReleaseForm component
      return null;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Release created successfully",
      });
      setIsCreateDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['admin-releases'] });
    },
  });

  const handleReleaseCreated = () => {
    setIsCreateDialogOpen(false);
    queryClient.invalidateQueries({ queryKey: ['admin-releases'] });
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
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Release</DialogTitle>
                <DialogDescription>
                  Create a new music release and upload audio files
                </DialogDescription>
              </DialogHeader>
              <ReleaseForm onSuccess={handleReleaseCreated} />
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