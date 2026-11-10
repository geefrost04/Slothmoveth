import { SARABAN_LESSONS, type SarabanLesson as NoteLesson } from './sarabanLessonData';
import { COMPUTER_LESSONS } from './computerLessonData';
import { ONWR_GENERAL_LESSONS } from './onwrGeneralLessons';
import { ONWR_PLANNING_LESSONS } from './onwrPlanningLessons';
import { LESSONS as GENERAL } from './nesdc/general';
import { LESSONS as ENGLISH } from './nesdc/english';
import { LESSONS as ORG } from './nesdc/org';
import { LESSONS as NATIONAL } from './nesdc/national';
import { LESSONS as ANALYSIS } from './nesdc/analysis';
import { LESSONS as REVIEW } from './nesdc/review';
import { LESSONS as WRITING } from './nesdc/writing';
import { LESSONS as INTERVIEW } from './nesdc/interview';
import TOPICS from './nesdcTopics.json';
import { thaiWrapDeep } from '@/lib/thaiText';

// สศช. งานวิเคราะห์นโยบายและแผน. New chapters live in nesdc/<topic>.ts; saraban, computer and a few
// policy chapters are reused from the police and ONWR notes. nesdcTopics.json says which lessons go
// into each topic, in order ("*" = every lesson of that source).
const SOURCES: Record<string, NoteLesson[]> = {
  saraban: SARABAN_LESSONS,
  computer: COMPUTER_LESSONS,
  'onwr-general': ONWR_GENERAL_LESSONS,
  'onwr-planning': ONWR_PLANNING_LESSONS,
  'nesdc-general': GENERAL,
  'nesdc-english': ENGLISH,
  'nesdc-org': ORG,
  'nesdc-national': NATIONAL,
  'nesdc-analysis': ANALYSIS,
  'nesdc-review': REVIEW,
  'nesdc-writing': WRITING,
  'nesdc-interview': INTERVIEW
};

function resolve(refs: string[][]): NoteLesson[] {
  return refs.flatMap(([source, slug]) => {
    const lessons = SOURCES[source];
    if (!lessons) throw new Error(`NESDC lesson source not found: ${source}`);
    if (slug === '*') return lessons;
    const lesson = lessons.find((item) => item.slug === slug);
    if (!lesson) throw new Error(`NESDC lesson not found: ${source}/${slug}`);
    return [lesson];
  });
}

// Chapters are renumbered lesson-01, lesson-02 …; a quick review becomes "review" (review-1, review-2 … if several).
function buildTopic(refs: string[][]): NoteLesson[] {
  const lessons = resolve(refs);
  const reviews = lessons.filter((lesson) => lesson.sectionType === 'quick_review').length;
  let chapter = 0;
  let review = 0;
  return lessons.map((lesson, index) => {
    if (lesson.sectionType === 'quick_review') {
      review += 1;
      return { ...lesson, slug: reviews > 1 ? `review-${review}` : 'review', chapterNo: index + 1 };
    }
    chapter += 1;
    return {
      ...lesson,
      slug: `lesson-${String(chapter).padStart(2, '0')}`,
      chapterNo: chapter,
      kicker: lesson.kicker?.replace(/^บทที่ \d+/, `บทที่ ${chapter}`) ?? lesson.kicker
    };
  });
}

export const NESDC_LESSONS_RAW: Record<string, NoteLesson[]> = Object.fromEntries(
  Object.entries(TOPICS).map(([topic, meta]) => [topic, buildTopic(meta.lessons)])
);

export const NESDC_LESSONS: Record<string, NoteLesson[]> = Object.fromEntries(
  Object.entries(NESDC_LESSONS_RAW).map(([topic, lessons]) => [topic, thaiWrapDeep(lessons)])
);

export function getNesdcLesson(subjectId: string, slug: string) {
  return NESDC_LESSONS[subjectId]?.find((lesson) => lesson.slug === slug);
}
