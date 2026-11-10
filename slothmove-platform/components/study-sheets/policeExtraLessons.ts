import type { SarabanLesson as NoteLesson } from './sarabanLessonData';
import { LESSONS as THAI } from './policeThaiLessons';
import { LESSONS as ENGLISH } from './policeEnglishLessons';
import { thaiWrapDeep } from '@/lib/thaiText';

// Police Thai and English notes (added Nov 2569). Sheets: content/study-sheets/police-<subject>-summary.json,
// built by scripts/police/build-extra-sheets.mjs so the reader's chapter list matches these lessons.
export const POLICE_EXTRA_LESSONS: Record<string, NoteLesson[]> = {
  thai: thaiWrapDeep(THAI),
  english: thaiWrapDeep(ENGLISH)
};

export const POLICE_EXTRA_SUBJECTS = new Set(Object.keys(POLICE_EXTRA_LESSONS));

export function getPoliceExtraLesson(subjectId: string, slug: string) {
  return POLICE_EXTRA_LESSONS[subjectId]?.find((lesson) => lesson.slug === slug);
}
