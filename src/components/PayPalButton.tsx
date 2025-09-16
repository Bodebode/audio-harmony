import React, { useEffect, useRef } from 'react';

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

  const containerId = `paypal-button-container-${planId}`;

  useEffect(() => {
    const loadPayPalSDK = () => {
      if (window.PayPalSDKLoaded || document.querySelector('[src*="paypal.com/sdk/js"]')) {
        return Promise.resolve();
      }

      return new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://www.paypal.com/sdk/js?client-id=ATua47QvA3LF0-XtC5U0sJ0F1L2yvlmloqhqiSDPn9pfC6t7q4dwNDzu2cM_xpLG8YJ1JhIJtevxVrCH&vault=true&intent=subscription';
        script.onload = () => {
          window.PayPalSDKLoaded = true;
          resolve();
        };
        script.onerror = () => reject(new Error('Failed to load PayPal SDK'));
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
      .catch(console.error);

    return () => {
      buttonRendered.current = false;
      // Clear the container on cleanup
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [planId, amount, color, onApprove, onError, style, containerId]);

  return <div id={containerId} ref={paypalRef} className="paypal-button-container" />;
};

export default PayPalButton;