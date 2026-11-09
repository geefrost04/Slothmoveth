import type { SarabanLesson as NoteLesson } from './sarabanLessonData';
import { ONWR_GENERAL_LESSONS } from './onwrGeneralLessons';
import { ONWR_WATER_LESSONS } from './onwrWaterLessons';
import { ONWR_PLANNING_LESSONS } from './onwrPlanningLessons';
import { LESSON as EXTRA_ORG } from './onwrExtra/org';
import { LESSON as EXTRA_MASTERPLAN } from './onwrExtra/masterplan';
import { LESSON as EXTRA_MONITORING } from './onwrExtra/monitoring';
import { LESSON as EXTRA_PROJECT } from './onwrExtra/project';
import { LESSON as EXTRA_MEETING } from './onwrExtra/meeting';
import { LESSON as EXTRA_RULES } from './onwrExtra/rules';
import TOPICS from './onwrTopics.json';
import { thaiWrapDeep } from '@/lib/thaiText';

// สทนช. นักวิเคราะห์นโยบายและแผน. Lessons are written in three source files (general / water / planning)
// and regrouped into the 9 announcement topics (plus a pre-exam review sheet) by onwrTopics.json.
const SOURCES: Record<string, NoteLesson[]> = {
  general: ONWR_GENERAL_LESSONS,
  water: ONWR_WATER_LESSONS,
  planning: ONWR_PLANNING_LESSONS,
  // Extra chapters for thin topics (components/study-sheets/onwrExtra/<topic>.ts).
  extra: [EXTRA_ORG, EXTRA_MASTERPLAN, EXTRA_MONITORING, EXTRA_PROJECT, EXTRA_MEETING, EXTRA_RULES]
};

const REVIEW_TITLES: Record<string, string> = {
  general: 'ทบทวนความรู้ทั่วไป',
  water: 'ทบทวน พ.ร.บ.น้ำและแผนแม่บทน้ำ',
  planning: 'ทบทวนนโยบาย แผน และการประเมินผล'
};

function buildTopic(refs: string[][]): NoteLesson[] {
  let chapter = 0;
  return refs.map(([source, slug], index) => {
    const lesson = SOURCES[source]?.find((item) => item.slug === slug);
    if (!lesson) throw new Error(`ONWR lesson not found: ${source}/${slug}`);
    if (lesson.sectionType === 'quick_review') {
      return { ...lesson, slug: `review-${source}`, chapterNo: index + 1, title: REVIEW_TITLES[source] ?? lesson.title };
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

export const ONWR_LESSONS: Record<string, NoteLesson[]> = Object.fromEntries(
  Object.entries(TOPICS).map(([topic, meta]) => [topic, thaiWrapDeep(buildTopic(meta.lessons))])
);

export function getOnwrLesson(subjectId: string, slug: string) {
  return ONWR_LESSONS[subjectId]?.find((lesson) => lesson.slug === slug);
}
