import { useMemo } from 'react';

interface PricingData {
  currency: string;
  symbol: string;
  originalPrice: number;
  discountedPrice: number;
  originalFormatted: string;
  discountedFormatted: string;
  savingsPercentage: number;
}

export const usePricing = (): PricingData => {
  return useMemo(() => {
    // Detect user location using browser APIs
    const userLocale = navigator.language || 'en-US';
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Determine region and pricing
    let currency: string;
    let symbol: string;
    let originalPrice: number;
    let discountedPrice: number;
    
    // UK detection
    if (userLocale.startsWith('en-GB') || timezone.includes('London') || timezone.includes('Edinburgh')) {
      currency = 'GBP';
      symbol = '£';
      originalPrice = 5.99;
      discountedPrice = 0.99;
    }
    // Europe detection (major EU countries)
    else if (
      userLocale.startsWith('de-') || 
      userLocale.startsWith('fr-') || 
      userLocale.startsWith('es-') || 
      userLocale.startsWith('it-') || 
      userLocale.startsWith('nl-') || 
      userLocale.startsWith('pt-') ||
      timezone.includes('Berlin') ||
      timezone.includes('Paris') ||
      timezone.includes('Madrid') ||
      timezone.includes('Rome') ||
      timezone.includes('Amsterdam')
    ) {
      currency = 'EUR';
      symbol = '€';
      originalPrice = 6.99;
      discountedPrice = 1.19;
    }
    // Default to USD for rest of world
    else {
      currency = 'USD';
      symbol = '$';
      originalPrice = 7.99;
      discountedPrice = 1.29;
    }
    
    // Format prices based on currency
    const formatPrice = (price: number) => {
      if (currency === 'GBP') {
        return price < 1 ? `${Math.round(price * 100)}p` : `${symbol}${price.toFixed(2)}`;
      }
      return `${symbol}${price.toFixed(2)}`;
    };
    
    const originalFormatted = formatPrice(originalPrice);
    const discountedFormatted = formatPrice(discountedPrice);
    const savingsPercentage = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
    
    return {
      currency,
      symbol,
      originalPrice,
      discountedPrice,
      originalFormatted,
      discountedFormatted,
      savingsPercentage
    };
  }, []);
};