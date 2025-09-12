
import { Navigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { MusicPlayer } from "@/components/MusicPlayer";
import { Library } from "@/components/Library";
import { LikedSongs } from "@/components/LikedSongs";
import { AboutArtist } from "@/components/AboutArtist";
import { BottomBanner } from "@/components/BottomBanner";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();

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
  if (!user) {
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
        </div>
      </div>
      <BottomBanner />
    </SidebarProvider>
  );
};

export default Index;
