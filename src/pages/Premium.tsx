import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { PremiumHeader } from "@/components/premium/PremiumHeader";
import { PremiumFeaturesComparison } from "@/components/premium/PremiumFeaturesComparison";
import { PremiumCTA } from "@/components/premium/PremiumCTA";
import { Footer } from "@/components/Footer";
import { useAuth } from "@/hooks/useAuth";
import { usePremium } from "@/hooks/usePremium";
import { Navigate } from "react-router-dom";
import { Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Premium = () => {
  const { isAuthenticated, loading, isGuest } = useAuth();
  const { isPremiumActive, expiresAt } = usePremium();
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

  // Premium status component for existing subscribers
  if (isPremiumActive && !isGuest) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gradient-to-br from-[#0FA0CE] via-[#222222] to-[#1EAEDB]">
          <AppSidebar />
          <div className="flex-1 overflow-auto pb-16">
            <Header />
            <div className="container mx-auto px-6 py-12">
              <div className="max-w-2xl mx-auto text-center">
                <div className="glass-card rounded-2xl p-8 mb-8">
                  <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                  <h1 className="text-3xl font-bold text-white mb-4">You're Premium!</h1>
                  <p className="text-white/80 mb-6">
                    Enjoy all premium features including unlimited playlists, ad-free experience, and exclusive content.
                  </p>
                  {expiresAt && (
                    <p className="text-yellow-400 text-sm mb-6">
                      Premium expires: {new Date(expiresAt).toLocaleDateString()}
                    </p>
                  )}
                  <Button
                    onClick={() => navigate('/')}
                    className="bg-gradient-to-r from-[#1EAEDB] to-[#0FA0CE] text-white font-semibold px-8 py-3 hover:scale-105 transition-all duration-300"
                  >
                    Back to Music
                  </Button>
                </div>
              </div>
            </div>
            <Footer />
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-[#0FA0CE] via-[#222222] to-[#1EAEDB]">
        <AppSidebar />
        <div className="flex-1 overflow-auto pb-16">
          <Header />
          <PremiumHeader />
          <PremiumFeaturesComparison />
          <PremiumCTA />
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Premium;