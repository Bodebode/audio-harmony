import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { usePremium } from "@/hooks/usePremium";
import { useNavigate, Navigate } from "react-router-dom";
import { User, Crown, Settings, LogOut, ArrowLeft, MessageCircle, Activity, Menu } from "lucide-react";
import { PremiumBadge } from "@/components/premium/PremiumBadge";

const Profile = () => {
  const { user, profile, isGuest, signOut, loading } = useAuth();
  const { isPremiumActive } = usePremium();
  const navigate = useNavigate();

  // Redirect guests to auth
  if (!loading && (isGuest || !user)) {
    return <Navigate to="/auth" replace />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0FA0CE] via-[#222222] to-[#1EAEDB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/80">Loading profile...</p>
        </div>
      </div>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleUpgradeToPremium = () => {
    navigate('/premium');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-[#0FA0CE] via-[#222222] to-[#1EAEDB]">
        <AppSidebar />
        <div className="flex-1 overflow-auto pb-16">
          <Header />
          
          <div className="container mx-auto px-6 py-8">
            <div className="max-w-4xl mx-auto">
              {/* Back button */}
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-white hover:text-[#1EAEDB] mb-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>

              {/* Profile Header */}
              <Card className="glass-card border-white/20 mb-8">
                <CardHeader>
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarFallback className="bg-gradient-to-r from-[#1EAEDB] to-[#0FA0CE] text-white text-2xl">
                        {profile?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-white text-2xl">
                          {profile?.display_name || user?.email}
                        </CardTitle>
                        <PremiumBadge size="md" variant="glow" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={isPremiumActive ? "default" : "secondary"} className="bg-gradient-to-r from-[#1EAEDB] to-[#0FA0CE]">
                          {isPremiumActive ? 'Premium Member' : 'Free User'}
                        </Badge>
                        {isPremiumActive && profile?.premium_expires_at && (
                          <p className="text-white/70 text-sm">
                            Premium until {new Date(profile.premium_expires_at).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Account Information */}
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Account Information
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Your account details and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="display-name" className="text-white font-medium">Display Name</Label>
                      <Input
                        id="display-name"
                        value={profile?.display_name || ''}
                        readOnly
                        className="bg-white/10 border-white/20 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-white font-medium">Email</Label>
                      <Input
                        id="email"
                        value={user?.email || ''}
                        readOnly
                        className="bg-white/10 border-white/20 text-white mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-white font-medium">Member Since</Label>
                      <p className="text-white/70 text-sm mt-1">
                        {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Recently joined'}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Subscription Management */}
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Crown className="h-5 w-5" />
                      Subscription
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Manage your premium subscription
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isPremiumActive ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-gradient-to-r from-yellow-500 to-amber-600">
                            Premium Active
                          </Badge>
                        </div>
                        <p className="text-white/70 text-sm">
                          Enjoy unlimited skips, exclusive content, and ad-free listening!
                        </p>
                        <Button 
                          variant="outline" 
                          className="w-full border-white/20 text-white hover:bg-white/10"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Manage Subscription
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-white/70 text-sm">
                          Upgrade to Premium for unlimited access to all features!
                        </p>
                        <Button 
                          onClick={handleUpgradeToPremium}
                          className="w-full bg-gradient-to-r from-[#1EAEDB] to-[#0FA0CE] text-white hover:opacity-90"
                        >
                          <Crown className="h-4 w-4 mr-2" />
                          Upgrade to Premium
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Messages & Inbox - Coming Soon */}
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Messages
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Connect with other music lovers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6">
                      <MessageCircle className="h-12 w-12 text-white/30 mx-auto mb-3" />
                      <p className="text-white/50 mb-2">Coming Soon</p>
                      <p className="text-white/30 text-sm">
                        Send and receive messages from friends and other users
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Activity & Stats - Coming Soon */}
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Activity
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Your music listening statistics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-6">
                      <Activity className="h-12 w-12 text-white/30 mx-auto mb-3" />
                      <p className="text-white/50 mb-2">Coming Soon</p>
                      <p className="text-white/30 text-sm">
                        Track your listening history and favorite genres
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Account Settings - Simplified */}
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Account</CardTitle>
                    <CardDescription className="text-white/70">
                      Account management
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={handleSignOut}
                      variant="outline" 
                      className="w-full border-red-400/20 text-red-400 hover:bg-red-400/10"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Profile;