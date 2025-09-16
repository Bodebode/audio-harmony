import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Coffee, Star, Gift, Music } from "lucide-react";
import PayPalButton from "@/components/PayPalButton";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Support = () => {
  const [customAmount, setCustomAmount] = useState('');
  const [supporterName, setSupporterName] = useState('');
  const [supporterEmail, setSupporterEmail] = useState('');
  const [message, setMessage] = useState('');
  const [selectedAmount, setSelectedAmount] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const predefinedAmounts = [
    { amount: '5', planId: 'P-2LM460357N721533WNDEMQEI', color: 'silver' as const, icon: Coffee, label: 'Buy me a coffee' },
    { amount: '10', planId: 'P-7A373816S2101190ANDEMTKY', color: 'gold' as const, icon: Heart, label: 'Show some love' },
    { amount: '25', planId: 'P-5X178743BT784302PNDEMU2I', color: 'gold' as const, icon: Star, label: "Fanmily" },
    { amount: '100', planId: 'P-2LE84220VT3721543NDEMV4A', color: 'blue' as const, icon: Gift, label: "Destiny Helper" }
  ];

  const handlePayPalSuccess = async (data: any) => {
    try {
      // Store tip in database
      const tipData = {
        user_id: user?.id || null,
        supporter_name: supporterName || 'Anonymous',
        supporter_email: supporterEmail || '',
        amount: parseFloat(selectedAmount || customAmount),
        currency: 'GBP',
        message: message || '',
        payment_method: 'paypal',
        paypal_order_id: data.subscriptionID || data.orderID,
        status: 'completed'
      };

      const { error } = await supabase
        .from('tips')
        .insert([tipData]);

      if (error) {
        console.error('Error storing tip:', error);
      }

      toast({
        title: "Thank you! 🎉",
        description: "Your support means the world to me! I truly appreciate your generosity.",
      });

      // Reset form
      setCustomAmount('');
      setSupporterName('');
      setSupporterEmail('');
      setMessage('');
      setSelectedAmount(null);
    } catch (error) {
      console.error('Error processing tip:', error);
      toast({
        title: "Success!",
        description: "Thank you for your support! Your payment was processed successfully.",
      });
    }
  };

  const handlePayPalError = (err: any) => {
    console.error('PayPal error:', err);
    toast({
      title: "Payment Error",
      description: "There was an issue processing your payment. Please try again.",
      variant: "destructive"
    });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-[#0FA0CE] via-[#222222] to-[#1EAEDB]">
        <AppSidebar />
        <div className="flex-1 overflow-auto pb-16">
          <Header />
          
          <div className="container mx-auto px-6 py-12">
            <div className="max-w-4xl mx-auto">
              {/* Header Section */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <Music className="h-8 w-8 text-yellow-400" />
                  <h1 className="text-4xl font-bold text-white">Support the Artist</h1>
                  <Heart className="h-8 w-8 text-red-400" />
                </div>
                <p className="text-white/80 text-lg max-w-2xl mx-auto">
                  Your support helps me create more amazing music and keep this platform running. 
                  Every contribution, no matter the size, is deeply appreciated! 🎵
                </p>
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                {/* Support Options */}
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl">Choose Your Support Level</CardTitle>
                    <CardDescription className="text-white/70">
                      Select a predefined amount or enter your own custom amount
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Predefined Amounts */}
                    <div className="grid grid-cols-2 gap-4">
                      {predefinedAmounts.map(({ amount, planId, color, icon: Icon, label }) => (
                        <div key={amount} className="space-y-3">
                          <Button
                            variant={selectedAmount === amount ? "default" : "outline"}
                            className={`w-full h-20 flex flex-col gap-2 ${
                              selectedAmount === amount 
                                ? 'bg-gradient-to-r from-[#1EAEDB] to-[#0FA0CE] text-white' 
                                : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                            }`}
                            onClick={() => setSelectedAmount(amount)}
                          >
                            <Icon className="h-5 w-5" />
                            <span className="font-semibold">£{amount}</span>
                            <Badge variant="secondary" className="text-xs">
                              {label}
                            </Badge>
                          </Button>
                          
                          {selectedAmount === amount && (
                            <div className="paypal-button-wrapper">
                              <PayPalButton
                                planId={planId}
                                amount={amount}
                                color={color}
                                style="payment"
                                onApprove={handlePayPalSuccess}
                                onError={handlePayPalError}
                              />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Custom Amount */}
                    <div className="pt-6 border-t border-white/20">
                      <label htmlFor="custom-amount" className="block text-white font-medium mb-2">
                        Or enter a custom amount (£)
                      </label>
                      <div className="flex gap-2">
                        <Input
                          id="custom-amount"
                          type="number"
                          min="1"
                          max="1000"
                          step="0.01"
                          placeholder="25.00"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="bg-white/10 border-white/20 text-white placeholder-white/50"
                        />
                        <Button
                          variant={customAmount ? "default" : "outline"}
                          className={customAmount 
                            ? 'bg-gradient-to-r from-[#1EAEDB] to-[#0FA0CE] text-white' 
                            : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                          }
                          onClick={() => setSelectedAmount('custom')}
                          disabled={!customAmount || parseFloat(customAmount) < 1}
                        >
                          Select
                        </Button>
                      </div>
                      
                      {selectedAmount === 'custom' && customAmount && (
                        <div className="mt-4">
                          <PayPalButton
                            planId="custom"
                            amount={customAmount}
                            color="blue"
                            style="payment"
                            onApprove={handlePayPalSuccess}
                            onError={handlePayPalError}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Message */}
                <Card className="glass-card border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-2xl">Leave a Message</CardTitle>
                    <CardDescription className="text-white/70">
                      Optional: Share your thoughts or just say hello!
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label htmlFor="supporter-name" className="block text-white font-medium mb-2">
                        Your Name (Optional)
                      </label>
                      <Input
                        id="supporter-name"
                        placeholder="Your name"
                        value={supporterName}
                        onChange={(e) => setSupporterName(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-white/50"
                      />
                    </div>

                    <div>
                      <label htmlFor="supporter-email" className="block text-white font-medium mb-2">
                        Your Email (Optional)
                      </label>
                      <Input
                        id="supporter-email"
                        type="email"
                        placeholder="your@email.com"
                        value={supporterEmail}
                        onChange={(e) => setSupporterEmail(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-white/50"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-white font-medium mb-2">
                        Message (Optional)
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Leave a kind message or feedback..."
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="bg-white/10 border-white/20 text-white placeholder-white/50 resize-none"
                      />
                    </div>

                    <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-4 rounded-lg border border-white/20">
                      <p className="text-white/90 text-sm">
                        💝 <strong>Thank you!</strong> Your support helps me:
                      </p>
                      <ul className="text-white/80 text-sm mt-2 space-y-1">
                        <li>• Create new original music</li>
                        <li>• Improve the platform experience</li>
                        <li>• Cover hosting and development costs</li>
                        <li>• Invest in better music equipment</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Info */}
              <div className="mt-12 text-center">
                <div className="glass-card p-6 max-w-2xl mx-auto">
                  <h3 className="text-white font-semibold text-lg mb-3">
                    🎵 Every contribution makes a difference! 🎵
                  </h3>
                  <p className="text-white/80 text-sm">
                    All payments are processed securely through PayPal. You don't need a PayPal account to contribute - 
                    you can use any major credit or debit card. Your support is what keeps the music playing! 🎶
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Support;