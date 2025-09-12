import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const BottomBanner = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/auth');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-gradient-to-r from-purple-600 to-purple-500 px-3 py-2 sm:px-4 sm:py-3 flex items-center justify-between shadow-lg min-h-[60px] sm:min-h-[70px]">
      <div className="text-white flex-1 pr-2">
        <p className="font-semibold text-xs sm:text-sm md:text-base leading-tight">
          Preview only, sign up to get unlimited songs, no payments required.
        </p>
      </div>
      <Button 
        variant="secondary" 
        onClick={handleSignUp}
        className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-3 py-1.5 sm:px-6 sm:py-2 rounded-full transition-all duration-200 hover:scale-105 text-xs sm:text-sm whitespace-nowrap flex-shrink-0"
      >
        Sign up for free
      </Button>
    </div>
  );
};