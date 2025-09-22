import React, { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PayPalButtonProps {
  planId: string;
  amount?: string;
  color?: 'blue' | 'silver' | 'gold';
  onApprove?: (data: any) => void;
  onError?: (err: any) => void;
  style?: 'subscription' | 'payment';
}

declare global {
  interface Window {
    paypal?: any;
    PayPalSDKLoaded?: boolean;
  }
}

const PayPalButton: React.FC<PayPalButtonProps> = ({
  planId,
  amount,
  color = 'blue',
  onApprove,
  onError,
  style = 'subscription'
}) => {
  const paypalRef = useRef<HTMLDivElement>(null);
  const buttonRendered = useRef(false);
  const paypalButtonInstance = useRef<any>(null);
  const isUnmounting = useRef(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  const [paypalConfig, setPaypalConfig] = useState<any>(null);

  const containerId = `paypal-button-container-${planId}`;

  useEffect(() => {
    isUnmounting.current = false; // Reset unmounting flag on mount
    
    const fetchPayPalConfig = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-paypal-config');
        
        if (error) {
          throw new Error('Failed to fetch PayPal configuration');
        }
        
        if (!data?.clientId) {
          throw new Error('PayPal client ID not configured');
        }
        
        setPaypalConfig(data);
        return data.clientId;
      } catch (error) {
        console.error('PayPal config error:', error);
        setLoadingError('Failed to load PayPal configuration');
        setIsLoading(false);
        throw error;
      }
    };

    const loadPayPalSDK = async (clientId: string) => {
      if (window.PayPalSDKLoaded || document.querySelector('[src*="paypal.com/sdk/js"]')) {
        setIsLoading(false);
        return Promise.resolve();
      }

      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription`;
        script.onload = () => {
          window.PayPalSDKLoaded = true;
          setIsLoading(false);
          resolve();
        };
        script.onerror = () => {
          setLoadingError('Failed to load PayPal SDK');
          setIsLoading(false);
          reject(new Error('Failed to load PayPal SDK'));
        };
        document.head.appendChild(script);
      });
    };

    const renderPayPalButton = () => {
      if (!window.paypal || !paypalRef.current || buttonRendered.current || isUnmounting.current) {
        return;
      }

      // Ensure container exists and is in DOM
      const container = document.getElementById(containerId);
      if (!container || !document.body.contains(container)) {
        return;
      }

      // Clear any existing PayPal button instance
      if (paypalButtonInstance.current) {
        try {
          if (paypalButtonInstance.current.close) {
            paypalButtonInstance.current.close();
          }
        } catch (error) {
          console.log('PayPal button cleanup warning:', error);
        }
        paypalButtonInstance.current = null;
      }

      // Clear container content
      container.innerHTML = '';
      buttonRendered.current = true;

      const buttonConfig: any = {
        style: {
          shape: 'rect',
          color: color,
          layout: 'vertical',
          label: style === 'subscription' ? 'subscribe' : 'paypal'
        },
        onApprove: (data: any, actions: any) => {
          if (isUnmounting.current) return;
          console.log('PayPal payment approved:', data);
          if (onApprove) {
            onApprove(data);
          } else {
            alert(`Payment ID: ${data.subscriptionID || data.orderID}`);
          }
        },
        onError: (err: any) => {
          if (isUnmounting.current) return;
          console.error('PayPal payment error:', err);
          if (onError) {
            onError(err);
          }
        }
      };

      if (style === 'subscription') {
        buttonConfig.createSubscription = (data: any, actions: any) => {
          if (isUnmounting.current) return Promise.reject('Component unmounting');
          return actions.subscription.create({
            plan_id: planId
          });
        };
      } else {
        buttonConfig.createOrder = (data: any, actions: any) => {
          if (isUnmounting.current) return Promise.reject('Component unmounting');
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount || '5.00',
                currency_code: 'GBP'
              }
            }]
          });
        };
      }

      try {
        paypalButtonInstance.current = window.paypal.Buttons(buttonConfig);
        paypalButtonInstance.current.render(`#${containerId}`).catch((error: any) => {
          if (!isUnmounting.current) {
            console.error('Error rendering PayPal button:', error);
          }
        });
      } catch (error) {
        console.error('Error creating PayPal button:', error);
        buttonRendered.current = false;
      }
    };

    fetchPayPalConfig()
      .then((clientId) => loadPayPalSDK(clientId))
      .then(() => {
        // Small delay to ensure DOM is ready
        setTimeout(renderPayPalButton, 100);
      })
      .catch((error) => {
        console.error('PayPal loading error:', error);
        setLoadingError('Failed to load payment system');
        setIsLoading(false);
      });

    return () => {
      isUnmounting.current = true;
      buttonRendered.current = false;
      
      // Cleanup PayPal button instance before clearing DOM
      if (paypalButtonInstance.current) {
        try {
          if (paypalButtonInstance.current.close) {
            paypalButtonInstance.current.close();
          }
        } catch (error) {
          // Silently handle cleanup errors
          console.log('PayPal cleanup:', error);
        }
        paypalButtonInstance.current = null;
      }

      // Wait a bit before clearing container to let PayPal finish any pending operations
      setTimeout(() => {
        const container = document.getElementById(containerId);
        if (container) {
          container.innerHTML = '';
        }
      }, 50);
      
      setIsLoading(true);
      setLoadingError(null);
    };
  }, [planId, amount, color, onApprove, onError, style, containerId]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="paypal-button-container min-h-12 flex items-center justify-center">
        <div className="flex items-center gap-2 text-white/70">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white/70"></div>
          <span className="text-sm">Loading PayPal...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (loadingError) {
    return (
      <div className="paypal-button-container min-h-12 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-sm mb-2">{loadingError}</p>
          <button 
            onClick={() => {
              setIsLoading(true);
              setLoadingError(null);
              // Retry loading
              window.location.reload();
            }}
            className="text-xs text-white/70 hover:text-white underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return <div id={containerId} ref={paypalRef} className="paypal-button-container" />;
};

export default PayPalButton;