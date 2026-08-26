import type { CourseKnowledgeData } from '@/lib/knowledge-types';
import type { GameId } from '@/lib/course-types';
import { getSubjectData as getPoliceAdminSubjectData } from './police_admin/data-loader';
import { getPoliceAdminKnowledgeData } from './police_admin/knowledge-loader';
import { policeAdminConfig } from './police_admin/config';
import { getSubjectData as getOcscSubjectData } from './ocsc/data-loader';
import { getOcscKnowledgeData } from './ocsc/knowledge-loader';
import { ocscConfig } from './ocsc/config';

type CourseContentSource = {
  getGameData: (subjectId: string, gameId: GameId) => unknown[];
  getKnowledgeData?: (subjectId: string) => CourseKnowledgeData | null;
};

/**
 * Single registration point for course content.
 * Shared pages never import a course-specific loader directly.
 */
const CONTENT_SOURCES: Record<string, CourseContentSource> = {
  // Police Admin keeps the legacy summary loader while the new paid
  // exam-set data source is being designed.
  police_admin: {
    getGameData: (subjectId, gameId) => getPoliceAdminSubjectData(policeAdminConfig, subjectId, gameId),
    getKnowledgeData: getPoliceAdminKnowledgeData
  },
  ocsc: {
    getGameData: (subjectId, gameId) => getOcscSubjectData(ocscConfig, subjectId, gameId),
    getKnowledgeData: getOcscKnowledgeData
  }
};

export function hasCourseContentSource(courseId: string): boolean {
  return courseId in CONTENT_SOURCES;
}

export function getCourseGameData(
  courseId: string,
  subjectId: string,
  gameId: GameId
): unknown[] {
  return CONTENT_SOURCES[courseId]?.getGameData(subjectId, gameId) ?? [];
}

export function getCourseKnowledgeData(
  courseId: string,
  subjectId: string
): CourseKnowledgeData | null {
  return CONTENT_SOURCES[courseId]?.getKnowledgeData?.(subjectId) ?? null;
}
