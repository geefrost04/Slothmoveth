'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import type { CourseMeta } from '@/lib/learn/course';
import { actionsFor, useHydratedFor, useProgressFor } from '@/lib/learn/progress';

const CourseContext = createContext<CourseMeta | null>(null);

export function CourseProvider({ meta, children }: { meta: CourseMeta; children: ReactNode }) {
  return <CourseContext.Provider value={meta}>{children}</CourseContext.Provider>;
}

export function useCourse(): CourseMeta {
  const meta = useContext(CourseContext);
  if (!meta) throw new Error('useCourse() outside <CourseProvider>');
  return meta;
}

/** This course's progress, hydration flag and actions. */
export function useLearn() {
  const course = useCourse();
  const progress = useProgressFor(course.storageKey);
  const hydrated = useHydratedFor(course.storageKey);
  const actions = useMemo(() => actionsFor(course.storageKey), [course.storageKey]);
  return { course, progress, hydrated, actions };
}

/** Plan day of a step id, if it is in the path. */
export function usePathDay(id: string): number | undefined {
  return useCourse().path.find((d) => d.items.includes(id))?.day;
}
