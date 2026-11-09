'use client';

import { useEffect, useRef } from 'react';

// Opens the coffee (PromptPay) popup from anywhere. `source` is sent to GA so we can see which spot works.
export function triggerDonatePrompt(source = 'manual') {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent('slothmove:donate', { detail: { source } }));
}

const KEYS = {
  completed: 'slothmove:donate:completed-exams',
  snoozedUntil: 'slothmove:donate:snoozed-until'
};
const DAY = 24 * 60 * 60 * 1000;

function read(key: string) {
  try { return Number(window.localStorage.getItem(key) ?? 0) || 0; } catch { return 0; }
}
function write(key: string, value: number) {
  try { window.localStorage.setItem(key, String(value)); } catch { /* storage blocked: skip */ }
}

/** Call once when an exam result appears: shows the coffee popup after every finished set. */
export function recordExamCompletedAndMaybePrompt() {
  if (typeof window === 'undefined') return;
  write(KEYS.completed, read(KEYS.completed) + 1);
  window.setTimeout(() => triggerDonatePrompt('auto_after_exam'), 2500);
}

/** Remembers when the automatic prompt was last closed (kept for analysis; no longer blocks the popup). */
export function snoozeDonatePrompt() {
  if (typeof window === 'undefined') return;
  write(KEYS.snoozedUntil, Date.now() + 14 * DAY);
}

export function completedExamCount() {
  if (typeof window === 'undefined') return 0;
  return read(KEYS.completed);
}

export function useDonatePromptOnDone(done: boolean) {
  const previousDone = useRef(done);
  useEffect(() => {
    if (done && !previousDone.current) triggerDonatePrompt('game_done');
    previousDone.current = done;
  }, [done]);
}
