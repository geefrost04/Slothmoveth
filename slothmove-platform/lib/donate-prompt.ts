'use client';

import { useEffect, useRef } from 'react';

export function triggerDonatePrompt() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('slothmove:donate'));
}

export function useDonatePromptOnDone(done: boolean) {
  const previousDone = useRef(done);

  useEffect(() => {
    if (done && !previousDone.current) {
      triggerDonatePrompt();
    }
    previousDone.current = done;
  }, [done]);
}
