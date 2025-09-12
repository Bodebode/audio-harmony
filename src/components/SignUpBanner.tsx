import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { User, ArrowRight } from "lucide-react";

export const SignUpBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40">
      <div className="bg-gradient-to-r from-[#1EAEDB]/95 to-[#0FA0CE]/95 backdrop-blur-lg border-t border-white/10 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-full">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">
                Join Bode Nathaniel's Music
              </h3>
              <p className="text-white/80 text-sm">
                Create your free account to access all features
              </p>
            </div>
          </div>
          
          <Button
            onClick={() => navigate('/auth')}
            className="bg-white text-[#1EAEDB] font-semibold px-6 py-2 hover:bg-white/90 transition-all duration-300 hover:scale-105"
          >
            Sign Up for Free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};