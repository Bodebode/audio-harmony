import { Shield, UserCheck, Crown, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdmin } from "@/hooks/useAdmin";

export const AdminAccessInfo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, role } = useAdmin();

  if (!user) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Access Required
          </CardTitle>
          <CardDescription>
            You need to be logged in to access admin features.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/auth')} className="w-full">
            Sign In / Sign Up
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Admin Access System
          </CardTitle>
          <CardDescription>
            Manage administrative access and roles for your music platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-3">
              <UserCheck className="h-5 w-5" />
              <div>
                <p className="font-medium">Current Status</p>
                <p className="text-sm text-muted-foreground">
                  {isAdmin ? `Admin (${role})` : 'Regular User'}
                </p>
              </div>
            </div>
            <Badge variant={isAdmin ? "default" : "secondary"}>
              {isAdmin ? "Admin Access" : "Standard Access"}
            </Badge>
          </div>

          {isAdmin && (
            <div className="space-y-3">
              <Button 
                onClick={() => navigate('/admin')} 
                className="w-full"
                size="lg"
              >
                <Settings className="h-4 w-4 mr-2" />
                Open Admin Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How Admin Access Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex gap-3">
              <Crown className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Automatic First User Promotion</h4>
                <p className="text-sm text-muted-foreground">
                  The first user who signs up is automatically promoted to admin status.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <UserCheck className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Role Hierarchy</h4>
                <p className="text-sm text-muted-foreground">
                  Admin → Editor → Support → Regular User
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Settings className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium">Admin Features</h4>
                <p className="text-sm text-muted-foreground">
                  User management, content moderation, analytics, marketing campaigns, and system settings.
                </p>
              </div>
            </div>
          </div>

          {!isAdmin && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Need Admin Access?</strong> Contact an existing admin to grant you permissions, 
                or if you're the app owner, use the Supabase dashboard to update your role directly.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>Quick Admin Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-2">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/users')}
                className="justify-start"
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/releases')}
                className="justify-start"
              >
                <Settings className="h-4 w-4 mr-2" />
                Manage Releases
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/analytics')}
                className="justify-start"
              >
                <Settings className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/marketing')}
                className="justify-start"
              >
                <Settings className="h-4 w-4 mr-2" />
                Marketing Tools
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};