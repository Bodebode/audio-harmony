import { cn } from "@/lib/utils";

interface SkeletonLoaderProps {
  className?: string;
  variant?: 'default' | 'shimmer' | 'wave';
  children?: React.ReactNode;
}

export const SkeletonLoader = ({ 
  className, 
  variant = 'default',
  children 
}: SkeletonLoaderProps) => {
  const baseClasses = "rounded-md bg-muted/20";
  
  const variantClasses = {
    default: "animate-pulse",
    shimmer: "skeleton-shimmer",
    wave: "skeleton-base"
  };

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
    >
      {children}
    </div>
  );
};

// Specific skeleton components for common patterns
export const SkeletonSong = ({ className }: { className?: string }) => (
  <div className={cn("flex items-center gap-3 p-3", className)}>
    <SkeletonLoader variant="shimmer" className="h-8 w-8 rounded-full" />
    <div className="flex-1 space-y-2">
      <SkeletonLoader variant="wave" className="h-4 w-3/4" />
      <SkeletonLoader variant="wave" className="h-3 w-1/2" />
    </div>
    <SkeletonLoader variant="shimmer" className="h-4 w-12" />
    <SkeletonLoader variant="shimmer" className="h-8 w-8 rounded-full" />
  </div>
);

export const SkeletonGrid = ({ 
  count = 6, 
  className 
}: { 
  count?: number; 
  className?: string; 
}) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonSong key={i} />
    ))}
  </div>
);