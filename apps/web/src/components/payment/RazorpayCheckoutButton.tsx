'use client';

import React, { useState } from 'react';
import { Loader2, ShieldCheck, CreditCard } from 'lucide-react';
import { useToast } from '@/lib/toast-context';

export interface PaymentSuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  [key: string]: any;
}

export interface RazorpayCheckoutProps {
  amount: number; // in paise (e.g. 50000 for ₹500.00) or rupees if converted before passing
  currency?: string;
  name?: string;
  description?: string;
  receipt?: string;
  notes?: Record<string, string>;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  themeColor?: string;
  createOrderEndpoint?: string;
  verifyPaymentEndpoint?: string;
  onSuccess?: (response: PaymentSuccessResponse) => void;
  onError?: (error: any) => void;
  onCancel?: () => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const RazorpayCheckoutButton: React.FC<RazorpayCheckoutProps> = ({
  amount,
  currency = 'INR',
  name = 'ASTRA 2026',
  description = 'Event Registration / Payment',
  receipt,
  notes,
  prefill,
  themeColor = '#0a0a0a',
  createOrderEndpoint = '/api/create-order',
  verifyPaymentEndpoint = '/api/verify-payment',
  onSuccess,
  onError,
  onCancel,
  className = '',
  children,
  disabled = false,
}) => {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handlePayment = async () => {
    if (loading || disabled) return;

    if (amount < 100) {
      const errorMsg = 'Minimum payment amount is ₹1.00 (100 paise).';
      showToast(errorMsg, 'error');
      if (onError) onError(new Error(errorMsg));
      return;
    }

    setLoading(true);

    try {
      // 1. Load Razorpay SDK Script
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
      }

      // 2. Call Backend Create Order Endpoint
      const createOrderRes = await fetch(createOrderEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(typeof window !== 'undefined' && localStorage.getItem('jwt_access_token')
            ? { Authorization: `Bearer ${localStorage.getItem('jwt_access_token')}` }
            : {}),
        },
        body: JSON.stringify({
          amount: Math.round(amount),
          currency,
          receipt,
          notes,
        }),
      });

      const orderData = await createOrderRes.json();

      if (!createOrderRes.ok) {
        throw new Error(orderData.error || `Order creation failed (${createOrderRes.status})`);
      }

      const keyId =
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
        orderData.key_id;

      if (!keyId) {
        throw new Error('Razorpay Key ID is not configured.');
      }

      // 3. Open Razorpay Checkout Modal
      const options = {
        key: keyId,
        amount: orderData.amount,
        currency: orderData.currency || currency,
        name,
        description,
        order_id: orderData.order_id,
        prefill: {
          name: prefill?.name || '',
          email: prefill?.email || '',
          contact: prefill?.contact || '',
        },
        notes: notes || {},
        theme: {
          color: themeColor,
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // 4. Send payment signatures to verify endpoint
            const verifyRes = await fetch(verifyPaymentEndpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(typeof window !== 'undefined' && localStorage.getItem('jwt_access_token')
                  ? { Authorization: `Bearer ${localStorage.getItem('jwt_access_token')}` }
                  : {}),
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
              throw new Error(verifyData.error || 'Payment signature verification failed.');
            }

            showToast('Payment verified successfully!', 'success');
            if (onSuccess) {
              onSuccess({
                ...response,
                ...verifyData,
              });
            }
          } catch (verifyErr: any) {
            const msg = verifyErr.message || 'Payment verification failed.';
            showToast(msg, 'error');
            if (onError) onError(verifyErr);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            showToast('Payment cancelled by user.', 'info');
            if (onCancel) onCancel();
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);

      // Handle payment failure event
      razorpayInstance.on('payment.failed', (response: any) => {
        const errorDesc =
          response.error?.description || response.error?.reason || 'Payment failed.';
        showToast(errorDesc, 'error');
        if (onError) onError(response.error);
        setLoading(false);
      });

      razorpayInstance.open();
    } catch (err: any) {
      setLoading(false);
      const errorMessage = err.message || 'An error occurred during checkout.';
      showToast(errorMessage, 'error');
      if (onError) onError(err);
    }
  };

  return (
    <button
      type="button"
      onClick={handlePayment}
      disabled={loading || disabled}
      className={`relative inline-flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-wider font-bold px-6 py-3 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
        className ||
        'bg-yellow-400 hover:bg-yellow-300 text-black border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none'
      }`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : children ? (
        children
      ) : (
        <>
          <CreditCard className="w-4 h-4" />
          <span>Pay ₹{(amount / 100).toFixed(2)}</span>
          <ShieldCheck className="w-4 h-4 ml-1 opacity-75" />
        </>
      )}
    </button>
  );
};

export default RazorpayCheckoutButton;
