
import { Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Library } from "@/components/Library";
import { LikedSongs } from "@/components/LikedSongs";
import { AboutArtist } from "@/components/AboutArtist";

import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { usePremium } from "@/hooks/usePremium";
import { Button } from "@/components/ui/button";
import { Crown, Zap, SkipForward, Star, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { isAuthenticated, loading, isGuest } = useAuth();
  const { isPremiumActive } = usePremium();
  const navigate = useNavigate();

  // Show loading spinner while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0FA0CE] via-[#222222] to-[#1EAEDB] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-white mx-auto mb-4" />
          <p className="text-white/80">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-[#0FA0CE] via-[#222222] to-[#1EAEDB]">
        <AppSidebar />
        <div className="flex-1 overflow-auto pb-16">
          <Header />
          <MusicPlayer />
          <Library />
          <LikedSongs />
          <AboutArtist />
          {!isGuest && !isPremiumActive && (
            <div className="container mx-auto px-6 py-12">
              <div className="max-w-4xl mx-auto text-center">
                <div className="mb-8">
                  <div className="flex justify-center mb-6">
                    <div className="bg-yellow-400/20 rounded-full p-4">
                      <Crown className="h-12 w-12 text-yellow-400" />
                    </div>
                  </div>
                  
                  <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                    Upgrade to Premium
                  </h2>
                  
                  <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                    Unlock the full potential of your music experience with these exclusive features
                  </p>
                </div>

                {/* Feature Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="glass-card p-6 rounded-xl">
                    <div className="bg-red-500/20 rounded-lg p-3 w-fit mx-auto mb-4">
                      <Zap className="h-6 w-6 text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Advertisements</h3>
                    <p className="text-white/70">Uninterrupted music experience</p>
                  </div>
                  
                  <div className="glass-card p-6 rounded-xl">
                    <div className="bg-purple-500/20 rounded-lg p-3 w-fit mx-auto mb-4">
                      <SkipForward className="h-6 w-6 text-purple-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Unlimited Skips</h3>
                    <p className="text-white/70">Skip songs without limits</p>
                  </div>
                  
                  <div className="glass-card p-6 rounded-xl">
                    <div className="bg-yellow-500/20 rounded-lg p-3 w-fit mx-auto mb-4">
                      <Star className="h-6 w-6 text-yellow-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Exclusive Content</h3>
                    <p className="text-white/70">Access premium-only releases</p>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mb-8">
                  <Button
                    onClick={() => navigate('/premium')}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold px-12 py-6 text-xl rounded-full hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-400/25"
                  >
                    <Crown className="mr-3 h-6 w-6" />
                    Get Premium Now
                  </Button>
                </div>

                <div className="pt-6">
                  <p className="text-white/60">
                    Start your premium experience today
                  </p>
                </div>
              </div>
            </div>
          )}
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
