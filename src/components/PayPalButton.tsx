import React, { useEffect, useRef, useState } from 'react';

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
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const containerId = `paypal-button-container-${planId}`;

  useEffect(() => {
    const loadPayPalSDK = () => {
      if (window.PayPalSDKLoaded || document.querySelector('[src*="paypal.com/sdk/js"]')) {
        setIsLoading(false);
        return Promise.resolve();
      }

      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://www.paypal.com/sdk/js?client-id=ATua47QvA3LF0-XtC5U0sJ0F1L2yvlmloqhqiSDPn9pfC6t7q4dwNDzu2cM_xpLG8YJ1JhIJtevxVrCH&vault=true&intent=subscription';
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
      if (!window.paypal || !paypalRef.current || buttonRendered.current) {
        return;
      }

      // Clear any existing buttons in the container
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '';
      }

      buttonRendered.current = true;

      const buttonConfig: any = {
        style: {
          shape: 'rect',
          color: color,
          layout: 'vertical',
          label: style === 'subscription' ? 'subscribe' : 'paypal'
        },
        onApprove: (data: any, actions: any) => {
          console.log('PayPal payment approved:', data);
          if (onApprove) {
            onApprove(data);
          } else {
            alert(`Payment ID: ${data.subscriptionID || data.orderID}`);
          }
        },
        onError: (err: any) => {
          console.error('PayPal payment error:', err);
          if (onError) {
            onError(err);
          }
        }
      };

      if (style === 'subscription') {
        buttonConfig.createSubscription = (data: any, actions: any) => {
          return actions.subscription.create({
            plan_id: planId
          });
        };
      } else {
        buttonConfig.createOrder = (data: any, actions: any) => {
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
        window.paypal.Buttons(buttonConfig).render(`#${containerId}`);
      } catch (error) {
        console.error('Error rendering PayPal button:', error);
      }
    };

    loadPayPalSDK()
      .then(() => {
        // Small delay to ensure DOM is ready
        setTimeout(renderPayPalButton, 100);
      })
      .catch((error) => {
        console.error('PayPal SDK loading error:', error);
        setLoadingError('Failed to load payment system');
        setIsLoading(false);
      });

    return () => {
      buttonRendered.current = false;
      setIsLoading(true);
      setLoadingError(null);
      // Clear the container on cleanup
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '';
      }
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