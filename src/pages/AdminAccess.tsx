import { AdminAccessInfo } from "@/components/admin/AdminAccessInfo";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const AdminAccess = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6">
            <div className="max-w-6xl mx-auto">
              <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Admin Access
                </h1>
                <p className="text-white/70">
                  Administrative access and system management
                </p>
              </div>

              <div className="mb-6 flex justify-center">
                <a 
                  href="/admin/releases" 
                  className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
                >
                  Go to Admin Dashboard →
                </a>
              </div>
              
              <AdminAccessInfo />
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};