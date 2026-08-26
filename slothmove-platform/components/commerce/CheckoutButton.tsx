'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CheckoutButton({
  productId,
  className,
  children
}: {
  productId: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  async function startCheckout() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId })
      });
      const result = await response.json() as { url?: string; error?: string; loginRequired?: boolean };

      if (response.status === 401 || result.loginRequired) {
        router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      if (!response.ok || !result.url) throw new Error(result.error || 'สร้างหน้าชำระเงินไม่สำเร็จ');
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
