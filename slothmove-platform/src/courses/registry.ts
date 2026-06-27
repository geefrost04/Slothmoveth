/**
 * Course Registry
 *
 * Single source of truth for which courses exist on the platform.
 * Routes and components consume this list at build/render time.
 *
 * Adding a new course:
 *   1. Create `src/courses/<id>/config.ts` exporting a `CourseConfig`
 *   2. Add it to the COURSES array below
 *   3. That's it — the dynamic routes will pick it up automatically.
 */

import type { CourseConfig } from '@/lib/course-types';

import { pabConfig } from './pab/config';
import { opsdConfig } from './opsd/config';
import { industryConfig } from './industry/config';
import { policeAdminConfig } from './police_admin/config';
import { ocscConfig } from './ocsc/config';

export const COURSES: CourseConfig[] = [
  pabConfig,
  opsdConfig,
  industryConfig,
  policeAdminConfig,
  ocscConfig
];

/** Only show courses that aren't hidden from the platform index */
export const VISIBLE_COURSES = COURSES.filter((c) => !c.hidden);

/** Look up a course by id (used by dynamic routes) */
export function getCourse(id: string): CourseConfig | null {
  return COURSES.find((c) => c.id === id) ?? null;
}

/** Look up a subject within a course */
export function getSubject(courseId: string, subjectId: string) {
  const course = getCourse(courseId);
  if (!course) return null;
  const subject = course.subjects.find((s) => s.id === subjectId);
  return subject ? { course, subject } : null;
}

/** Look up a game within a course */
export function getGame(courseId: string, gameId: string) {
  const course = getCourse(courseId);
  if (!course) return null;
  const game = course.games.find((g) => g.id === gameId);
  return game ? { course, game } : null;
}

/** Resolve the final triple (course, subject, game) for nested routes */
export function resolveTriple(courseId: string, subjectId: string, gameId: string) {
  const course = getCourse(courseId);
  if (!course) return null;
  const subject = course.subjects.find((s) => s.id === subjectId);
  const game = course.games.find((g) => g.id === gameId);
  if (!subject || !game) return null;
  return { course, subject, game };
}
