import type { CourseConfig, GameId } from '@/lib/course-types';

/**
 * The legacy police question bank was removed before the paid exam-set
 * migration. Keep this adapter empty so existing routes can stay mounted
 * while the new Supabase-backed content contract is being designed.
 */
export function getSubjectData(
  course: CourseConfig,
  _subjectId: string,
  _game: GameId
): unknown[] {
  if (course.id !== 'police_admin') return [];
  return [];
}

export function getSubjectItemCount(
  _subjectId: string,
  _game: GameId
): number {
  return 0;
}
