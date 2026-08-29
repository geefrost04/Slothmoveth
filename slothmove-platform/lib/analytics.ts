type AnalyticsPrimitive = string | number | boolean | null;
type AnalyticsValue = AnalyticsPrimitive | AnalyticsValue[] | { [key: string]: AnalyticsValue };

const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-W60TF5WHSB';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    __slothmoveAnalyticsInitialized?: boolean;
  }
}

function ensureAnalytics() {
  if (typeof window === 'undefined' || !measurementId) return false;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || ((...args: unknown[]) => {
    window.dataLayer?.push(args);
  });
  if (!window.__slothmoveAnalyticsInitialized) {
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { send_page_view: false });
    window.__slothmoveAnalyticsInitialized = true;
  }
  return true;
}

export function trackAnalyticsEvent(
  eventName: string,
  parameters: Record<string, AnalyticsValue> = {}
) {
  if (!ensureAnalytics() || typeof window.gtag !== 'function') return;

  window.gtag('event', eventName, parameters);
}

export function getDownloadAnalyticsData(filePath: string) {
  const decodedPath = decodeURIComponent(filePath);
  const fileName = decodedPath.split('/').pop() || decodedPath;
  const extension = fileName.includes('.') ? fileName.split('.').pop()?.toLowerCase() || '' : '';
  const linkUrl = new URL(filePath, window.location.origin).href;

  return {
    file_name: fileName,
    file_extension: extension,
    link_url: linkUrl,
    page_path: `${window.location.pathname}${window.location.search}`
  };
}
