import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Music, UserCheck, Mail } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const { signIn, signUp, signInWithSocial, continueAsGuest, isAuthenticated, loading } = useAuth();

  // Redirect if already authenticated
  if (isAuthenticated && !loading) {
    return <Navigate to="/" replace />;
  }

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0FA0CE] via-[#222222] to-[#1EAEDB] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white" />
      </div>
    );
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn(email, password);
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signUp(email, password, displayName);
    setIsLoading(false);
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook' | 'twitter') => {
    setSocialLoading(provider);
    await signInWithSocial(provider);
    setSocialLoading(null);
  };

  const handleGuestAccess = () => {
    continueAsGuest();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0FA0CE] via-[#222222] to-[#1EAEDB] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Music className="h-8 w-8 text-[#1EAEDB]" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-[#1EAEDB] bg-clip-text text-transparent">
              Bode Nathaniel
            </h1>
          </div>
          <p className="text-white/80">Access your premium music experience</p>
        </div>

        <Card className="bg-black/60 backdrop-blur-lg border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-center">Welcome</CardTitle>
            <CardDescription className="text-white/70 text-center">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Guest Access Button */}
            <div className="mb-6">
              <Button
                onClick={handleGuestAccess}
                className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/20"
                variant="outline"
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Continue as Guest
              </Button>
            </div>

            <div className="relative mb-6">
              <Separator className="bg-white/20" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-[#0FA0CE] via-[#222222] to-[#1EAEDB] px-3">
                <span className="text-white/70 text-sm">or sign in with account</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <Button
                onClick={() => handleSocialLogin('google')}
                disabled={socialLoading === 'google'}
                className="w-full bg-white hover:bg-white/90 text-gray-900"
              >
                {socialLoading === 'google' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                Continue with Google
              </Button>
              
              <Button
                onClick={() => handleSocialLogin('facebook')}
                disabled={socialLoading === 'facebook'}
                className="w-full bg-[#1877F2] hover:bg-[#166FE5] text-white"
              >
                {socialLoading === 'facebook' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                )}
                Continue with Facebook
              </Button>
              
              <Button
                onClick={() => handleSocialLogin('twitter')}
                disabled={socialLoading === 'twitter'}
                className="w-full bg-[#1DA1F2] hover:bg-[#1A91DA] text-white"
              >
                {socialLoading === 'twitter' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                )}
                Continue with Twitter
              </Button>
            </div>

            <div className="relative mb-6">
              <Separator className="bg-white/20" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-[#0FA0CE] via-[#222222] to-[#1EAEDB] px-3">
                <span className="text-white/70 text-sm">or use email</span>
              </div>
            </div>

            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/10">
                <TabsTrigger value="signin" className="text-white data-[state=active]:bg-[#1EAEDB] data-[state=active]:text-white">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-white data-[state=active]:bg-[#1EAEDB] data-[state=active]:text-white">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-white">Email</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-white">Password</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#1EAEDB] hover:bg-[#0FA0CE] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-white">Display Name</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your display name"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white">Password</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#1EAEDB] hover:bg-[#0FA0CE] text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;