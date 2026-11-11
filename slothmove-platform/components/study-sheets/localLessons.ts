import type { SarabanLesson as NoteLesson } from './sarabanLessonData';
import { ONWR_LESSONS } from './onwrLessonData';
import { NESDC_LESSONS } from './nesdcLessonData';
import { PAT_LESSONS } from './patLessonData';

// Note lessons of the local-content courses (lib/localCourses.ts), by course → topic.
export const LOCAL_LESSONS: Record<string, Record<string, NoteLesson[]>> = {
  onwr: ONWR_LESSONS,
  nesdc: NESDC_LESSONS,
  pat: PAT_LESSONS
};

export function getLocalLesson(courseId: string, subjectId: string, slug: string) {
  return LOCAL_LESSONS[courseId]?.[subjectId]?.find((lesson) => lesson.slug === slug);
}
