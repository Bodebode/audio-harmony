import { Button } from "@/components/ui/button";

export const BottomBanner = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-purple-500 px-4 py-3 flex items-center justify-between shadow-lg">
      <div className="text-white">
        <p className="font-semibold text-sm md:text-base">
          Preview only, sign up to get unlimited songs, No Credit Card needed.
        </p>
      </div>
      <Button 
        variant="secondary" 
        className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-6 py-2 rounded-full transition-all duration-200 hover:scale-105"
      >
        Sign up free
      </Button>
    </div>
  );
};