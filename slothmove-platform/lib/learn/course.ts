// Course settings for a tutor-style learn path. `CourseMeta` is plain data: the course layout passes it to
// <CourseProvider> so client components read the base path, plan, outline and sources from context.

import type { Lesson, Priority, Topic, TopicId } from './types';

export type SourceDoc = { title: string; year: string; url: string; pageless?: true };

/** One day of the study plan. `items` are lesson ids, `summary:<topic>`, `test:<topic>`, or a special step id. */
export type PathDay = { day: number; items: string[]; extra?: string };

/** A plan step that is not a lesson: an internal page (diagnostic) or a page elsewhere on the site (Mock Test). */
export type SpecialStep = {
  title: string;
  meta: string;
  href?: string;
  /** Done when the learner ticks it (pages outside the learn path cannot report back). */
  tickable?: true;
};

export type OutlineLesson = { id: string; title: string; ready: boolean; minutes?: number; priority?: Priority; kind?: 'practice' };
export type OutlineTopic = {
  id: TopicId;
  title: string;
  short: string;
  part: number;
  ready: boolean;
  hasSummary: boolean;
  hasTest: boolean;
  /** Questions in this subject on the real exam (shown on the map), if known. */
  examItems?: number;
  /** Short note under the topic name on the map. */
  note?: string;
  lessons: OutlineLesson[];
  links?: { id: string; title: string; href: string; meta: string }[];
};

export type CourseMeta = {
  id: string;
  base: string;
  storageKey: string;
  /** Short name for titles, e.g. "สศช." or "ตำรวจ อก.1". */
  shortName: string;
  pill: string;
  homeTitle: string;
  homeLead: string;
  exam: {
    /** ISO date once announced; null shows `estimate`. */
    date: string | null;
    estimate: string;
    note: string;
    passRule: string;
    /** Extra fact lines under the countdown (time, format, cut-offs). */
    facts?: string[];
  };
  testSize: number;
  testPass: number;
  topicTestSize: number;
  path: PathDay[];
  specials: Record<string, SpecialStep>;
  /** The diagnostic step id in `specials` (internal page or link). */
  diagnosticStep?: string;
  /** Labels of exam parts, by `Topic.part`. */
  parts: Record<number, string>;
  mapIntro: string;
  footer: string;
  /** Shown once on lesson pages and the map when lessons carry priority labels. */
  priorityNote?: string;
  /** Optional card under the map (e.g. a module that opens later). */
  extraCard?: { eyebrow: string; title: string; body: string };
  outline: OutlineTopic[];
  sources: Record<string, SourceDoc>;
};

export const PRIORITY_LABEL: Record<Priority, string> = {
  must: 'ออกบ่อย ต้องอ่าน',
  maybe: 'อ่านถ้ามีเวลา',
  skip: 'ข้ามได้'
};

/** Builds the topic outline (written lessons first, then planned ones shown as "เร็วๆ นี้"). */
export function buildOutline(
  topics: Topic[],
  planned: Record<string, { id: string; title: string; priority?: Priority; kind?: 'practice' }[]> = {},
  examItems: Record<string, number> = {}
): OutlineTopic[] {
  return topics.map((t) => {
    const written = t.lessons.map((l: Lesson) => ({ id: l.id, title: l.title, ready: true, minutes: l.minutes, priority: l.priority, kind: l.kind }));
    const rest = (planned[t.id] ?? []).filter((p) => !t.lessons.some((l) => l.id === p.id)).map((p) => ({ ...p, ready: false }));
    return {
      id: t.id,
      title: t.title,
      short: t.short,
      part: t.part,
      ready: t.ready,
      hasSummary: !!t.summary,
      hasTest: !!t.test?.length || t.lessons.some((l) => l.test.length),
      examItems: examItems[t.id],
      lessons: [...written, ...rest],
      links: t.links
    };
  });
}

/** Server-side course: the meta plus full content (used by route pages, never sent whole to the client). */
export type Course = {
  meta: CourseMeta;
  topics: Topic[];
  diagnostic?: (import('./types').MCQ & { topic: string })[];
  /** Title and kicker of the internal diagnostic page. */
  diagnosticPage?: { title: string; kicker: string; description: string };
};
