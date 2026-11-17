'use client';

// Learner progress, kept in this browser only (no account sync yet), one store per course
// (localStorage key from the course meta). Every storage access is wrapped: private windows and
// blocked storage simply start from an empty state.

import { useSyncExternalStore } from 'react';
import type { TopicId } from './types';

export type Rating = 0 | 1 | 2; // ยังงง / พอเข้าใจ / อธิบายได้

export type Progress = {
  v: 1;
  startedAt?: string; // ISO date of day 1
  diagnostic?: { at: string; byTopic: Partial<Record<TopicId, { right: number; total: number }>> };
  lessons: Record<string, { opened?: string; best?: number; passedAt?: string }>;
  ratings: Partial<Record<TopicId, Rating>>;
  /** Wrong answers to bring back later, newest last. */
  mistakes: { qid: string; lesson: string; at: string }[];
  /** Plan steps the learner ticked off by hand (links to pages outside the learn path). */
  ticked?: Record<string, string>;
};

const EMPTY: Progress = { v: 1, lessons: {}, ratings: {}, mistakes: [] };
const today = () => new Date().toISOString().slice(0, 10);

type Store = {
  read: () => Progress;
  update: (fn: (p: Progress) => Progress) => void;
  subscribe: (fn: () => void) => () => void;
};

const stores = new Map<string, Store>();

function storeFor(key: string): Store {
  const existing = stores.get(key);
  if (existing) return existing;
  let cache: Progress | null = null;
  const listeners = new Set<() => void>();

  const read = (): Progress => {
    if (cache) return cache;
    try {
      const raw = window.localStorage.getItem(key);
      const parsed = raw ? (JSON.parse(raw) as Progress) : null;
      cache = parsed && parsed.v === 1 ? { ...EMPTY, ...parsed } : EMPTY;
    } catch {
      cache = EMPTY;
    }
    return cache;
  };

  const write = (next: Progress) => {
    cache = next;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Storage unavailable: progress lasts for this visit only.
    }
    listeners.forEach((fn) => fn());
  };

  const subscribe = (fn: () => void) => {
    listeners.add(fn);
    const onStorage = (event: StorageEvent) => {
      if (event.key === key) {
        cache = null;
        fn();
      }
    };
    window.addEventListener('storage', onStorage);
    return () => {
      listeners.delete(fn);
      window.removeEventListener('storage', onStorage);
    };
  };

  const store: Store = { read, update: (fn) => write(fn(read())), subscribe };
  stores.set(key, store);
  return store;
}

/** Current progress; EMPTY during server render and the first client render. */
export function useProgressFor(key: string): Progress {
  const s = storeFor(key);
  return useSyncExternalStore(s.subscribe, s.read, () => EMPTY);
}

/** True once the client has read storage (avoids flashing "not started" states). */
export function useHydratedFor(key: string): boolean {
  const s = storeFor(key);
  return useSyncExternalStore(s.subscribe, () => true, () => false);
}

/** Actions on one course's progress. */
export function actionsFor(key: string) {
  const { update } = storeFor(key);
  return {
    markOpened(lessonId: string) {
      update((p) => {
        const cur = p.lessons[lessonId] ?? {};
        if (cur.opened) return p;
        return { ...p, startedAt: p.startedAt ?? today(), lessons: { ...p.lessons, [lessonId]: { ...cur, opened: today() } } };
      });
    },
    /** `asked` = every question in this attempt: right answers leave the review list, wrong ones (re)enter it. */
    recordTest(lessonId: string, score: number, pass: number, wrong: string[], asked: string[]) {
      update((p) => {
        const cur = p.lessons[lessonId] ?? {};
        const best = Math.max(cur.best ?? 0, score);
        const passedAt = cur.passedAt ?? (score >= pass ? today() : undefined);
        const fresh = wrong.map((qid) => ({ qid, lesson: lessonId, at: today() }));
        const kept = p.mistakes.filter((m) => !asked.includes(m.qid));
        return { ...p, startedAt: p.startedAt ?? today(), lessons: { ...p.lessons, [lessonId]: { ...cur, best, passedAt } }, mistakes: [...kept, ...fresh].slice(-200) };
      });
    },
    /** After a review: right answers leave the list; wrong ones restart their 2-day wait. */
    clearMistakes(qids: string[], stillWrong: string[] = []) {
      update((p) => ({
        ...p,
        mistakes: p.mistakes
          .filter((m) => !qids.includes(m.qid))
          .map((m) => (stillWrong.includes(m.qid) ? { ...m, at: today() } : m))
      }));
    },
    recordDiagnostic(byTopic: NonNullable<Progress['diagnostic']>['byTopic']) {
      update((p) => ({ ...p, startedAt: p.startedAt ?? today(), diagnostic: { at: today(), byTopic } }));
    },
    rate(topic: TopicId, rating: Rating) {
      update((p) => ({ ...p, ratings: { ...p.ratings, [topic]: rating } }));
    },
    /** Tick (or untick) a plan step that lives outside the learn path, e.g. a Mock Test. */
    tick(stepKey: string, on: boolean) {
      update((p) => {
        const ticked = { ...(p.ticked ?? {}) };
        if (on) ticked[stepKey] = today();
        else delete ticked[stepKey];
        return { ...p, startedAt: p.startedAt ?? today(), ticked };
      });
    },
    start() {
      update((p) => (p.startedAt ? p : { ...p, startedAt: today() }));
    }
  };
}

/** Day number in the study plan (1-based), counted from startedAt. */
export function dayNumber(p: Progress): number {
  if (!p.startedAt) return 1;
  const start = new Date(p.startedAt + 'T00:00:00');
  const now = new Date(today() + 'T00:00:00');
  return Math.max(1, Math.floor((now.getTime() - start.getTime()) / 86400000) + 1);
}
