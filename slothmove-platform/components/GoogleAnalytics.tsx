'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-W60TF5WHSB';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function AnalyticsPageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (!measurementId || !window.gtag) return;

    window.gtag('event', 'page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: `${pathname}${window.location.search}`,
      send_to: measurementId
    });
  }, [pathname]);

  return null;
}

export function GoogleAnalytics() {
  if (!measurementId) return null;

  return (
    <>
      <Script
        id="google-analytics"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <AnalyticsPageView />
    </>
  );
}
