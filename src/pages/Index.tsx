
import { Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { NowPlayingSection } from "@/components/NowPlayingSection";
import { MiniMusicPlayer } from "@/components/MiniMusicPlayer";
import { Library } from "@/components/Library";
import { LikedSongs } from "@/components/LikedSongs";
import { AboutArtist } from "@/components/AboutArtist";
import { CompactPremiumShowcase } from "@/components/premium/CompactPremiumShowcase";
import { Footer } from "@/components/Footer";
import { BottomNavigation } from "@/components/BottomNavigation";
import { useAuth } from "@/hooks/useAuth";
import { usePremium } from "@/hooks/usePremium";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Crown, Zap, SkipForward, Star, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { isAuthenticated, loading, isGuest } = useAuth();
  const { isPremiumActive } = usePremium();
  const isMobile = useIsMobile();
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
        <div className="flex-1 overflow-auto pb-32 md:pb-28">
          <Header />
          <NowPlayingSection />
          <Library />
          <AboutArtist />
          <LikedSongs />
          {!isPremiumActive && !isGuest && (
            <section className="p-6">
              <CompactPremiumShowcase />
            </section>
          )}
          <Footer />
        </div>
        
        {/* Mini Music Player with scroll-based visibility */}
        <MiniMusicPlayer />
        
        {/* Mobile bottom navigation */}
        {isMobile && <BottomNavigation />}
      </div>
    </SidebarProvider>
  );
};

export default Index;
