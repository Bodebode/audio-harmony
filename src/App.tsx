import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AboutArtist from "./pages/AboutArtist";
import Premium from "./pages/Premium";
import Support from "./pages/Support";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Merch from "./pages/Merch";
import NotFound from "./pages/NotFound";
import ErrorBoundary from "./components/ErrorBoundary";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminReleases from "./pages/admin/AdminReleases";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminAudit from "./pages/admin/AdminAudit";
import AdminMarketing from "./pages/admin/AdminMarketing";
import { AdminAccess } from "./pages/AdminAccess";
import { QuickUpload } from "./pages/QuickUpload";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ErrorBoundary>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about-artist" element={<AboutArtist />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/support" element={<Support />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/merch" element={<Merch />} />
            <Route path="/quick-upload" element={<QuickUpload />} />
            <Route path="/admin-access" element={<AdminAccess />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/releases" element={<AdminReleases />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/marketing" element={<AdminMarketing />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/audit" element={<AdminAudit />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
