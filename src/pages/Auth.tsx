import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Music, UserCheck, Mail, Phone, Eye, EyeOff } from 'lucide-react';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [contactMethod, setContactMethod] = useState<'email' | 'phone'>('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const { signIn, signUp, signInWithSocial, continueAsGuest, user, isAuthenticated, loading } = useAuth();

  // Redirect if already authenticated (but not guests)
  if (user && !loading) {
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
    
    // Validate passwords match
    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    setPasswordError('');
    setIsLoading(true);
    
    const contact = contactMethod === 'email' ? email : phone;
    await signUp(contact, password, displayName, contactMethod);
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
    <div className="min-h-screen bg-gradient-to-br from-[#0FA0CE] via-[#222222] to-[#1EAEDB] flex items-center justify-center p-4 md:p-6">
      <div className="w-full max-w-md mx-auto">
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
                         className="bg-white/10 border-white/20 text-white placeholder:text-white/50 h-12 md:h-10 text-base md:text-sm"
                       />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-white">Password</Label>
                    <div className="relative">
                       <Input
                         id="signin-password"
                         type={showPassword ? "text" : "password"}
                         placeholder="Enter your password"
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         required
                         className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-12 h-12 md:h-10 text-base md:text-sm"
                       />
                       <button
                         type="button"
                         onClick={() => setShowPassword(!showPassword)}
                         className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors h-8 w-8 flex items-center justify-center"
                       >
                         {showPassword ? <EyeOff className="h-5 w-5 md:h-4 md:w-4" /> : <Eye className="h-5 w-5 md:h-4 md:w-4" />}
                       </button>
                    </div>
                  </div>
                   <Button
                     type="submit"
                     className="w-full bg-[#1EAEDB] hover:bg-[#0FA0CE] text-white h-12 md:h-10 text-base md:text-sm"
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
                  
                  {/* Contact Method Toggle */}
                  <div className="space-y-2">
                    <Label className="text-white">Contact Method</Label>
                     <div className="flex gap-2">
                       <Button
                         type="button"
                         onClick={() => setContactMethod('email')}
                         className={`flex-1 h-12 md:h-10 ${contactMethod === 'email' 
                           ? 'bg-[#1EAEDB] text-white' 
                           : 'bg-white/10 text-white/70 hover:bg-white/20'
                         }`}
                         variant={contactMethod === 'email' ? 'default' : 'outline'}
                       >
                         <Mail className="mr-2 h-5 w-5 md:h-4 md:w-4" />
                         Email
                       </Button>
                       <Button
                         type="button"
                         onClick={() => setContactMethod('phone')}
                         className={`flex-1 h-12 md:h-10 ${contactMethod === 'phone' 
                           ? 'bg-[#1EAEDB] text-white' 
                           : 'bg-white/10 text-white/70 hover:bg-white/20'
                         }`}
                         variant={contactMethod === 'phone' ? 'default' : 'outline'}
                       >
                         <Phone className="mr-2 h-5 w-5 md:h-4 md:w-4" />
                         Phone
                       </Button>
                     </div>
                  </div>

                  {/* Email or Phone Input */}
                  <div className="space-y-2">
                    <Label htmlFor={`signup-${contactMethod}`} className="text-white">
                      {contactMethod === 'email' ? 'Email Address' : 'Phone Number'}
                    </Label>
                    <Input
                      id={`signup-${contactMethod}`}
                      type={contactMethod === 'email' ? 'email' : 'tel'}
                      placeholder={contactMethod === 'email' ? 'Enter your email' : 'Enter your phone number'}
                      value={contactMethod === 'email' ? email : phone}
                      onChange={(e) => contactMethod === 'email' ? setEmail(e.target.value) : setPhone(e.target.value)}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password (min. 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-white">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Re-enter your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {passwordError && (
                      <p className="text-red-400 text-sm mt-1">{passwordError}</p>
                    )}
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