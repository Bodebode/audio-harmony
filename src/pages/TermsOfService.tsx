import { AppSidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90 text-foreground">
      <AppSidebar />
      <Header />
      
      <main className="ml-0 lg:ml-64 pt-16 pb-20">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-8 border border-border/20">
            <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Terms of Service
            </h1>
            
            <div className="prose prose-invert max-w-none space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-primary">Acceptance of Terms</h2>
                <p className="text-muted-foreground leading-relaxed">
                  By accessing and using Audio Harmony, you accept and agree to be bound by the terms and provision 
                  of this agreement. These Terms of Service govern your use of our music streaming platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-primary">Service Description</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Audio Harmony is a music streaming platform that provides access to curated music content. 
                  We offer both free and premium subscription tiers with different features and capabilities.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-primary">User Accounts</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>You must provide accurate and complete information when creating an account</li>
                  <li>You are responsible for maintaining the security of your account</li>
                  <li>You must notify us immediately of any unauthorized use of your account</li>
                  <li>One account per user; sharing accounts is prohibited</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-primary">Subscription and Payments</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                  <li>Premium subscriptions are billed monthly or annually as selected</li>
                  <li>Payments are processed securely through Stripe or PayPal</li>
                  <li>Subscription fees are non-refundable except as required by law</li>
                  <li>You may cancel your subscription at any time through your account settings</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-primary">Acceptable Use</h2>
                <p className="text-muted-foreground leading-relaxed">
                  You agree not to use the service for any unlawful purpose or in any way that could damage, 
                  disable, or impair the service. You may not attempt to gain unauthorized access to any part 
                  of the service or its related systems.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-primary">Intellectual Property</h2>
                <p className="text-muted-foreground leading-relaxed">
                  All content on Audio Harmony, including music, text, graphics, and software, is protected by 
                  intellectual property rights. You may not copy, distribute, or create derivative works without permission.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-primary">Termination</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to terminate or suspend your account at any time for violations of these terms 
                  or for any other reason at our sole discretion.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibund mb-4 text-primary">Contact Information</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these Terms of Service, please contact us through our support page.
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

export default TermsOfService;