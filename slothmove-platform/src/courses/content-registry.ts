import type { CourseKnowledgeData } from '@/lib/knowledge-types';
import type { GameId } from '@/lib/course-types';
import { getSubjectData as getPabSubjectData } from './pab/data-loader';
import { getPabKnowledgeData } from './pab/knowledge-loader';
import { pabConfig } from './pab/config';
import { getSubjectData as getOpsdSubjectData } from './opsd/data-loader';
import { opsdConfig } from './opsd/config';
import { getSubjectData as getIndustrySubjectData } from './industry/data-loader';
import { industryConfig } from './industry/config';
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
  pab: {
    getGameData: (subjectId, gameId) => getPabSubjectData(pabConfig, subjectId, gameId),
    getKnowledgeData: getPabKnowledgeData
  },
  opsd: {
    getGameData: (subjectId, gameId) => getOpsdSubjectData(opsdConfig, subjectId, gameId)
  },
  industry: {
    getGameData: (subjectId, gameId) => getIndustrySubjectData(industryConfig, subjectId, gameId)
  },
  // Police Admin: 1,380 quiz items + knowledge content across 6 subjects
  // (Phase A2 + A3). Knowledge content is read from the source
  // `<subject>/<subject>.json.js` files via vm parser.
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
