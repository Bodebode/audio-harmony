import { AppSidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 text-foreground">
      <AppSidebar />
      <Header />
      
      <main className="ml-0 lg:ml-64 pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-border/20">
            <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            
            <div className="prose prose-invert max-w-none space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-primary">Information We Collect</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We collect information you provide directly to us, such as when you create an account, make a purchase, 
                  or contact us for support. This may include your email address, display name, and payment information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-primary">How We Use Your Information</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>To provide and maintain our music streaming service</li>
                  <li>To process payments and manage subscriptions</li>
                  <li>To send you technical notices and support messages</li>
                  <li>To improve our services and user experience</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-primary">Data Security</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We implement appropriate technical and organizational security measures to protect your personal information 
                  against unauthorized access, alteration, disclosure, or destruction. Payment information is processed securely 
                  through trusted payment providers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-primary">Third-Party Services</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We use third-party services including Stripe and PayPal for payment processing, and Supabase for backend 
                  services. These services have their own privacy policies governing the collection and use of your information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-primary">Your Rights</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You have the right to access, update, or delete your personal information. You can manage your account 
                  settings or contact us if you need assistance with your data rights.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-primary">Contact Us</h2>
                <p className="text-muted-foreground leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us through our support page.
                </p>
              </section>

              <section>
                <p className="text-sm text-muted-foreground border-t border-border/20 pt-4">
                  Last updated: {new Date().toLocaleDateString()}
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;