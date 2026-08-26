type AnalyticsValue = string | number | boolean;

export function trackAnalyticsEvent(
  eventName: string,
  parameters: Record<string, AnalyticsValue> = {}
) {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;

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
