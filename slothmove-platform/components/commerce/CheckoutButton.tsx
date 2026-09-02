'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { trackAnalyticsEvent } from '@/lib/analytics';

export function CheckoutButton({
  productId,
  className,
  children,
  analyticsEventName,
  analyticsParameters
}: {
  productId: string;
  className?: string;
  children: React.ReactNode;
  analyticsEventName?: string;
  analyticsParameters?: Record<string, string | number | boolean | null>;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function startCheckout() {
    if (analyticsEventName) {
      trackAnalyticsEvent(analyticsEventName, {
        product_id: productId,
        ...analyticsParameters
      });
    }
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      const result = await response.json() as {
        url?: string;
        error?: string;
        loginRequired?: boolean;
        analytics?: {
          currency: string;
          value: number;
          items: Array<{
            item_id: string;
            item_name: string;
            price: number;
            quantity: number;
          }>;
        };
      };

      if (response.status === 401 || result.loginRequired) {
        const returnTo = `${window.location.pathname}${window.location.search}`;
        const continuePath = `/checkout/continue?product_id=${encodeURIComponent(productId)}&return_to=${encodeURIComponent(returnTo)}`;
        trackAnalyticsEvent('checkout_login_required', {
          product_id: productId,
          return_path: returnTo
        });
        router.push(`/login?next=${encodeURIComponent(continuePath)}`);
        return;
      }
      if (!response.ok || !result.url) throw new Error(result.error || 'สร้างหน้าชำระเงินไม่สำเร็จ');
      if (result.analytics) {
        trackAnalyticsEvent('begin_checkout', {
          currency: result.analytics.currency,
          value: result.analytics.value,
          items: result.analytics.items
        });
      }
      window.location.assign(result.url);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'สร้างหน้าชำระเงินไม่สำเร็จ');
      setLoading(false);
    }
  }

  return (
    <span className={className}>
      <button type="button" onClick={startCheckout} disabled={loading}>
        {loading ? 'กำลังเปิดหน้าชำระเงิน...' : children}
      </button>
      {error ? <small role="alert">{error}</small> : null}
    </span>
  );
}
