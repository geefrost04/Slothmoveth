'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import styles from './NavigationProgress.module.css';

// Thin bar at the top of the screen that starts the moment an internal link is clicked,
// so a slow page never feels like the click did nothing. It finishes when the URL changes.
export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');
  const doneTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.('a');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      if (doneTimer.current) clearTimeout(doneTimer.current);
      setState('loading');
    }
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  useEffect(() => {
    setState((current) => {
      if (current !== 'loading') return current;
      doneTimer.current = setTimeout(() => setState('idle'), 350);
      return 'done';
    });
  }, [pathname, searchParams]);

  if (state === 'idle') return null;
  return <div className={`${styles.bar} ${state === 'done' ? styles.done : ''}`} role="progressbar" aria-label="กำลังเปิดหน้า" />;
}
