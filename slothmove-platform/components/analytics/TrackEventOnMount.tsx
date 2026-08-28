'use client';

import { useEffect } from 'react';
import { trackAnalyticsEvent } from '@/lib/analytics';

export function TrackEventOnMount({
  eventName,
  eventKey,
  parameters
}: {
  eventName: string;
  eventKey: string;
  parameters: Parameters<typeof trackAnalyticsEvent>[1];
}) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storageKey = `slothmove:analytics:${eventKey}`;
    if (window.sessionStorage.getItem(storageKey) === 'sent') return;

    trackAnalyticsEvent(eventName, parameters);
    window.sessionStorage.setItem(storageKey, 'sent');
  }, [eventKey, eventName, parameters]);

  return null;
}
