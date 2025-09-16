import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Star, Truck, Shield, Heart } from "lucide-react";

const Merch = () => {
  const navigate = useNavigate();

  const merchItems = [
    {
      id: 1,
      name: "Bode Nathaniel Signature T-Shirt",
      price: "£25.00",
      image: "/lovable-uploads/74cb0a2d-58c7-4be3-a188-27a043b76a3d.png",
      description: "Premium cotton t-shirt with exclusive Bode Nathaniel artwork",
      badge: "Popular",
      sizes: ["S", "M", "L", "XL", "XXL"]
    },
    {
      id: 2,
      name: "Limited Edition Hoodie",
      price: "£45.00",
      image: "/lovable-uploads/74cb0a2d-58c7-4be3-a188-27a043b76a3d.png",
      description: "Cozy hoodie with embroidered logo and lyric details",
      badge: "Limited",
      sizes: ["S", "M", "L", "XL"]
    },
    {
      id: 3,
      name: "Vinyl Collection Bundle",
      price: "£35.00",
      image: "/lovable-uploads/74cb0a2d-58c7-4be3-a188-27a043b76a3d.png",
      description: "Complete collection of Bode Nathaniel's latest releases on vinyl",
      badge: "Exclusive",
      sizes: []
    },
    {
      id: 4,
      name: "Afrobeat Fusion Poster Set",
      price: "£15.00",
      image: "/lovable-uploads/74cb0a2d-58c7-4be3-a188-27a043b76a3d.png",
      description: "Set of 3 high-quality art prints featuring album artwork",
      badge: "New",
      sizes: []
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-[#0FA0CE] via-[#222222] to-[#1EAEDB]">
        <AppSidebar />
        <div className="flex-1 overflow-auto pb-16">
          <Header />
          
          <div className="container mx-auto px-6 py-8">
            <div className="max-w-6xl mx-auto">
              {/* Back button */}
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-white hover:text-[#1EAEDB] mb-6"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>

              {/* Header Section */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center gap-3 mb-6">
                  <ShoppingCart className="h-8 w-8 text-[#1EAEDB]" />
                  <h1 className="text-4xl font-bold text-white">Official Merch Store</h1>
                  <Heart className="h-8 w-8 text-red-400" />
                </div>
                <p className="text-white/80 text-lg max-w-2xl mx-auto">
                  Get exclusive Bode Nathaniel merchandise and support your favorite artist! 
                  All items are high-quality and officially licensed.
                </p>
              </div>

              {/* Coming Soon Notice */}
              <Card className="glass-card border-[#1EAEDB]/20 mb-8">
                <CardContent className="p-8 text-center">
                  <div className="max-w-md mx-auto">
                    <ShoppingCart className="h-16 w-16 text-[#1EAEDB] mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-4">Store Coming Soon!</h2>
                    <p className="text-white/80 mb-6">
                      We're working hard to bring you amazing merchandise. 
                      The official store will be launching very soon with exclusive items you won't find anywhere else!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Button 
                        onClick={() => navigate('/support')}
                        className="bg-gradient-to-r from-[#1EAEDB] to-[#0FA0CE] text-white"
                      >
                        Support the Artist Now
                      </Button>
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                        Get Notified
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Preview Items Grid */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white text-center mb-6">Coming Soon - Preview</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {merchItems.map((item) => (
                    <Card key={item.id} className="glass-card border-white/20 group hover:border-[#1EAEDB]/30 transition-all duration-300">
                      <CardHeader className="p-4">
                        <div className="aspect-square bg-[#222222] rounded-lg overflow-hidden mb-3 relative">
                          <img 
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity duration-300"
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge className="bg-[#1EAEDB] text-white">Coming Soon</Badge>
                          </div>
                          {item.badge && (
                            <Badge 
                              variant="secondary" 
                              className="absolute top-2 left-2 bg-gradient-to-r from-[#1EAEDB] to-[#0FA0CE] text-white"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-white text-lg leading-tight">{item.name}</CardTitle>
                        <div className="flex items-center justify-between">
                          <span className="text-[#1EAEDB] font-bold text-xl">{item.price}</span>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-white/70 text-sm">New</span>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-white/70 text-sm mb-3">{item.description}</p>
                        {item.sizes.length > 0 && (
                          <div className="mb-3">
                            <p className="text-white text-xs mb-1">Available sizes:</p>
                            <div className="flex gap-1">
                              {item.sizes.map(size => (
                                <Badge key={size} variant="outline" className="border-white/20 text-white text-xs">
                                  {size}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <Button 
                          disabled
                          className="w-full bg-white/10 text-white/50 cursor-not-allowed"
                        >
                          Coming Soon
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Store Features */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="glass-card border-white/20 text-center">
                  <CardContent className="p-6">
                    <Truck className="h-8 w-8 text-[#1EAEDB] mx-auto mb-3" />
                    <h3 className="text-white font-semibold mb-2">Free Shipping</h3>
                    <p className="text-white/70 text-sm">Free delivery on orders over £30</p>
                  </CardContent>
                </Card>

                <Card className="glass-card border-white/20 text-center">
                  <CardContent className="p-6">
                    <Shield className="h-8 w-8 text-[#1EAEDB] mx-auto mb-3" />
                    <h3 className="text-white font-semibold mb-2">Secure Payment</h3>
                    <p className="text-white/70 text-sm">Safe and secure checkout process</p>
                  </CardContent>
                </Card>

                <Card className="glass-card border-white/20 text-center">
                  <CardContent className="p-6">
                    <Star className="h-8 w-8 text-[#1EAEDB] mx-auto mb-3" />
                    <h3 className="text-white font-semibold mb-2">Premium Quality</h3>
                    <p className="text-white/70 text-sm">High-quality materials and prints</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
          
          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Merch;