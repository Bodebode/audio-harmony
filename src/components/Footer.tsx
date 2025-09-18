import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Music, User, ArrowRight } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Footer = () => {
  const navigate = useNavigate();
  const { isGuest } = useAuth();

  if (!isGuest) {
    return null;
  }

  return (
    <footer className="bg-gradient-to-r from-[#0FA0CE]/10 to-[#1EAEDB]/10 backdrop-blur-sm border-t border-white/10 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-3 bg-gradient-to-r from-[#1EAEDB] to-[#0FA0CE] rounded-full">
              <Music className="h-8 w-8 text-white" />
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">
              Ready to join the fan-mily?
            </h3>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Join thousands of music lovers and create your free account today
            </p>
          </div>
          
           <Button
             onClick={() => {
               console.log('Footer Sign Up button clicked, navigating to /auth');
               navigate('/auth');
             }}
             size="lg"
             className="bg-gradient-to-r from-[#1EAEDB] to-[#0FA0CE] text-white font-semibold text-lg px-8 py-3 hover:from-[#1EAEDB]/90 hover:to-[#0FA0CE]/90 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
           >
            <User className="mr-2 h-5 w-5" />
            Sign Up for Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          
          <p className="text-white/60 text-sm">
            No credit card required • Free forever
          </p>
        </div>
      </div>
    </footer>
  );
};