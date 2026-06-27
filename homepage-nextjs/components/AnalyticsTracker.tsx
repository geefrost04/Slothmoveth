'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getCurrentPagePath, trackEvent, trackPageView } from '@/lib/gtag';

export function AnalyticsTracker() {
  const pathname = usePathname();
  const trackedSectionsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    trackPageView(getCurrentPagePath(), document.title);
  }, [pathname]);

  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const node = target.closest<HTMLElement>('[data-analytics-event]');
      if (!node) return;

      const name = node.dataset.analyticsEvent;
      if (!name) return;

      trackEvent(name, {
        page_path: getCurrentPagePath(),
        section: node.dataset.analyticsSectionName,
        label: node.dataset.analyticsLabel,
        destination: node.dataset.analyticsDestination
      });
    };

    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-analytics-section]'));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const sectionName = (entry.target as HTMLElement).dataset.analyticsSection;
          if (!sectionName || trackedSectionsRef.current.has(sectionName)) return;

          trackedSectionsRef.current.add(sectionName);
          trackEvent('view_section', {
            page_path: getCurrentPagePath(),
            section: sectionName
          });
        });
      },
      { threshold: 0.45 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const faqItems = Array.from(document.querySelectorAll<HTMLDetailsElement>('details[data-analytics-faq]'));
    if (faqItems.length === 0) return;

    const toggleHandlers = faqItems.map((item) => {
      const handler = () => {
        if (!item.open) return;
        trackEvent('faq_open', {
          page_path: getCurrentPagePath(),
          question: item.dataset.analyticsFaq
        });
      };

      item.addEventListener('toggle', handler);
      return { item, handler };
    });

    return () => {
      toggleHandlers.forEach(({ item, handler }) => item.removeEventListener('toggle', handler));
    };
  }, [pathname]);

  useEffect(() => {
    let visibleSince = document.visibilityState === 'visible' ? Date.now() : null;
    let totalVisibleMs = 0;

    const flushVisibleTime = (reason: 'hidden' | 'pagehide') => {
      if (visibleSince !== null) {
        totalVisibleMs += Date.now() - visibleSince;
        visibleSince = null;
      }

      if (totalVisibleMs < 5000) return;

      trackEvent('active_time', {
        page_path: getCurrentPagePath(),
        active_time_seconds: Math.round(totalVisibleMs / 1000),
        reason
      });

      totalVisibleMs = 0;
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        visibleSince = Date.now();
        return;
      }

      flushVisibleTime('hidden');
    };

    const onPageHide = () => {
      flushVisibleTime('pagehide');
    };

    document.addEventListener('visibilitychange', onVisibilityChange);
    window.addEventListener('pagehide', onPageHide);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', onPageHide);
      flushVisibleTime('pagehide');
    };
  }, [pathname]);

  return null;
}
