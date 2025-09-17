import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Search, Crown, UserCheck, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminUsers = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ['admin-users', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('profiles')
        .select(`
          id, 
          user_id, 
          display_name, 
          avatar_url, 
          is_premium, 
          premium_expires_at, 
          role,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(
          `display_name.ilike.%${searchTerm}%,user_id.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleMakeAdmin = async (userId: string, role: 'admin' | 'editor' | 'support') => {
    try {
      // Security check - only existing admins can assign roles
      const { data: canManage } = await supabase.rpc('can_manage_admin_roles');
      
      if (!canManage) {
        toast({
          title: "Access Denied",
          description: "Only administrators can assign admin roles",
          variant: "destructive",
        });
        return;
      }

      // Additional confirmation for admin role assignments
      if (role === 'admin') {
        const confirmed = window.confirm(
          `Are you sure you want to grant ADMIN privileges to this user? This will give them full system access including the ability to assign roles to other users.`
        );
        if (!confirmed) return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ 
          role,
          is_admin: role === 'admin' 
        })
        .eq('user_id', userId);

      if (error) throw error;

      // Log the admin action for audit trail
      await supabase.rpc('log_admin_action', {
        action_type: 'role_assigned',
        target_user_id: userId,
        details: { new_role: role, assigned_at: new Date().toISOString() }
      });

      toast({
        title: "Success",
        description: `User has been made ${role}`,
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    try {
      // Security check - only existing admins can remove roles
      const { data: canManage } = await supabase.rpc('can_manage_admin_roles');
      
      if (!canManage) {
        toast({
          title: "Access Denied", 
          description: "Only administrators can remove admin roles",
          variant: "destructive",
        });
        return;
      }

      // Confirmation dialog for role removal
      const confirmed = window.confirm(
        `Are you sure you want to remove admin privileges from this user? They will lose all administrative access.`
      );
      if (!confirmed) return;

      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: null,
          is_admin: false 
        })
        .eq('user_id', userId);

      if (error) throw error;

      // Log the admin action for audit trail
      await supabase.rpc('log_admin_action', {
        action_type: 'role_removed',
        target_user_id: userId,
        details: { previous_role: 'admin', removed_at: new Date().toISOString() }
      });

      toast({
        title: "Success",
        description: "Admin role removed",
      });
      
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove admin role",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Users</h2>
          <p className="text-muted-foreground">
            Manage user accounts and permissions
          </p>
        </div>

        {/* Search */}
        <Card>
          <CardHeader>
            <CardTitle>Search Users</CardTitle>
            <CardDescription>Find users by name or ID</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Users ({users?.length || 0})</CardTitle>
            <CardDescription>User accounts and their details</CardDescription>
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
                    <TableHead>User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar_url || ''} />
                            <AvatarFallback>
                              {user.display_name?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {user.display_name || 'Anonymous User'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {user.user_id.slice(0, 8)}...
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          {user.is_premium ? (
                            <Badge variant="default">
                              <Crown className="h-3 w-3 mr-1" />
                              Premium
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Free</Badge>
                          )}
                          {user.premium_expires_at && (
                            <span className="text-xs text-muted-foreground">
                              Expires: {new Date(user.premium_expires_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.role ? (
                          <Badge variant="outline" className="capitalize">
                            {user.role}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">User</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {!user.role ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMakeAdmin(user.user_id, 'support')}
                              >
                                <UserCheck className="h-3 w-3 mr-1" />
                                Support
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMakeAdmin(user.user_id, 'editor')}
                              >
                                <Mail className="h-3 w-3 mr-1" />
                                Editor
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMakeAdmin(user.user_id, 'admin')}
                              >
                                <Crown className="h-3 w-3 mr-1" />
                                Admin
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRemoveAdmin(user.user_id)}
                            >
                              Remove Role
                            </Button>
                          )}
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

export default AdminUsers;