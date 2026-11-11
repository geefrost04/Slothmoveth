import type { SarabanLesson as NoteLesson } from './sarabanLessonData';
import { LESSONS as NESDC_GENERAL } from './nesdc/general';
import { LESSONS as NESDC_ENGLISH } from './nesdc/english';
import { LESSONS as POLICE_THAI } from './policeThaiLessons';
import { LESSONS as PORT } from './pat/port';
import { LESSONS as PPP } from './pat/ppp';
import { LESSONS as SOE } from './pat/soe';
import { LESSONS as INVEST } from './pat/invest';
import { LESSONS as PRACTICAL } from './pat/practical';
import { LESSONS as INTERVIEW } from './pat/interview';
import TOPICS from './patTopics.json';
import { thaiWrapDeep } from '@/lib/thaiText';

// กทท. นักวิชาการ 6. Specialist chapters live in pat/<topic>.ts; the general part reuses the reviewed
// สศช. and police notes. patTopics.json says which lessons go into each topic ("*" = every lesson).
const SOURCES: Record<string, NoteLesson[]> = {
  'nesdc-general': NESDC_GENERAL,
  'nesdc-english': NESDC_ENGLISH,
  'police-thai': POLICE_THAI,
  'pat-port': PORT,
  'pat-ppp': PPP,
  'pat-soe': SOE,
  'pat-invest': INVEST,
  'pat-practical': PRACTICAL,
  'pat-interview': INTERVIEW
};

function resolve(refs: string[][]): NoteLesson[] {
  return refs.flatMap(([source, slug]) => {
    const lessons = SOURCES[source];
    if (!lessons) throw new Error(`PAT lesson source not found: ${source}`);
    if (slug === '*') return lessons;
    const lesson = lessons.find((item) => item.slug === slug);
    if (!lesson) throw new Error(`PAT lesson not found: ${source}/${slug}`);
    return [lesson];
  });
}

// Chapters are renumbered lesson-01, lesson-02 …; a quick review becomes "review" (review-1 … if several).
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

export const PAT_LESSONS_RAW: Record<string, NoteLesson[]> = Object.fromEntries(
  Object.entries(TOPICS).map(([topic, meta]) => [topic, buildTopic(meta.lessons)])
);

export const PAT_LESSONS: Record<string, NoteLesson[]> = Object.fromEntries(
  Object.entries(PAT_LESSONS_RAW).map(([topic, lessons]) => [topic, thaiWrapDeep(lessons)])
);
