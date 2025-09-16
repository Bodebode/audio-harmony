import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ExternalLink, Calendar, Target } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PromotionalBanner {
  id: string;
  title: string;
  message: string;
  button_text: string | null;
  button_url: string | null;
  background_color: string;
  text_color: string;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  target_audience: 'all' | 'premium' | 'free';
  priority: number;
}

interface PromotionalBannerProps {
  onDismiss?: (bannerId: string) => void;
  maxBanners?: number;
}

export const PromotionalBanner = ({ onDismiss, maxBanners = 3 }: PromotionalBannerProps) => {
  const [banners, setBanners] = useState<PromotionalBanner[]>([]);
  const [dismissedBanners, setDismissedBanners] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchActiveBanners();
    
    // Load dismissed banners from localStorage
    const dismissed = localStorage.getItem('dismissedBanners');
    if (dismissed) {
      setDismissedBanners(JSON.parse(dismissed));
    }
  }, []);

  const fetchActiveBanners = async () => {
    try {
      const now = new Date().toISOString();
      
      // Using any type temporarily until Supabase types are regenerated
      const { data, error } = await supabase
        .from('promotional_banners' as any)
        .select('*')
        .eq('is_active', true)
        .or(`start_date.is.null,start_date.lte.${now}`)
        .or(`end_date.is.null,end_date.gte.${now}`)
        .order('priority', { ascending: false })
        .limit(maxBanners);

      if (error) throw error;
      setBanners((data as unknown as PromotionalBanner[]) || []);
    } catch (error) {
      console.error('Error fetching promotional banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = (bannerId: string) => {
    const newDismissed = [...dismissedBanners, bannerId];
    setDismissedBanners(newDismissed);
    localStorage.setItem('dismissedBanners', JSON.stringify(newDismissed));
    
    if (onDismiss) {
      onDismiss(bannerId);
    }

    toast({
      title: "Banner dismissed",
      description: "You won't see this banner again",
    });
  };

  const handleButtonClick = (banner: PromotionalBanner) => {
    if (banner.button_url) {
      window.open(banner.button_url, '_blank');
    }
  };

  const getVisibleBanners = () => {
    return banners.filter(banner => !dismissedBanners.includes(banner.id));
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return 'destructive';
    if (priority >= 5) return 'default';
    return 'secondary';
  };

  const getTargetAudienceIcon = (audience: string) => {
    switch (audience) {
      case 'premium': return '👑';
      case 'free': return '🆓';
      default: return '🎯';
    }
  };

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const visibleBanners = getVisibleBanners();

  if (visibleBanners.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {visibleBanners.map((banner) => (
        <Card
          key={banner.id}
          className="relative overflow-hidden border-l-4 border-l-primary"
          style={{
            backgroundColor: banner.background_color,
            color: banner.text_color,
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{banner.title}</h3>
                  <Badge variant={getPriorityColor(banner.priority)} className="text-xs">
                    {banner.priority >= 8 ? 'High' : banner.priority >= 5 ? 'Medium' : 'Low'}
                  </Badge>
                  <span className="text-sm">
                    {getTargetAudienceIcon(banner.target_audience)}
                  </span>
                </div>
                
                <p className="text-sm opacity-90 leading-relaxed">
                  {banner.message}
                </p>

                <div className="flex items-center gap-3 text-xs opacity-75">
                  {banner.start_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>From {new Date(banner.start_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {banner.end_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Until {new Date(banner.end_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Target className="h-3 w-3" />
                    <span className="capitalize">{banner.target_audience} users</span>
                  </div>
                </div>

                {banner.button_text && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleButtonClick(banner)}
                    className="mt-2"
                  >
                    {banner.button_text}
                    {banner.button_url && <ExternalLink className="ml-1 h-3 w-3" />}
                  </Button>
                )}
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDismiss(banner.id)}
                className="self-start opacity-70 hover:opacity-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};