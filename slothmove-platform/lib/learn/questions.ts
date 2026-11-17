import type { Block, Lesson, MCQ, Topic } from './types';

/** Topic test: `size` questions drawn evenly from the lessons' end tests, spread across each test. */
export function topicTestQuestions(topic: Topic, size = 20): MCQ[] {
  const lessons = topic.lessons.filter((l) => l.test.length);
  if (!lessons.length) return [];
  const perLesson = Math.ceil(size / lessons.length);
  const picked = lessons.flatMap((l) => {
    const n = Math.min(perLesson, l.test.length);
    const idx = new Set<number>();
    for (let i = 0; i < n; i++) idx.add(Math.floor((i * l.test.length) / n));
    return [...idx].map((i) => l.test[i]);
  });
  return picked.slice(0, size);
}

/** Every question in the given topics (lesson checks and tests), by id. */
export function questionIndex(topics: Topic[]): Map<string, MCQ> {
  const map = new Map<string, MCQ>();
  for (const topic of topics) {
    for (const lesson of topic.lessons) {
      for (const q of lesson.test) map.set(q.id, q);
      for (const block of lesson.blocks) if (block.type === 'check') for (const q of block.questions) map.set(q.id, q);
    }
  }
  return map;
}

/** Distinct "ข้อมูล ณ …" stamps used in a lesson (document order), shown on its test page. */
export function lessonAsOf(lesson: Lesson): string[] {
  const out: string[] = [];
  const walk = (b: Block) => {
    if (b.type === 'asOf' && !out.includes(b.date)) out.push(b.date);
    if (b.type === 'section') b.blocks?.forEach(walk);
  };
  lesson.blocks.forEach(walk);
  return dropPrefixes(out);
}

/** Distinct stamps across a topic's lessons, for the topic test page. */
export function topicAsOf(topic: Topic): string[] {
  return dropPrefixes([...new Set(topic.lessons.flatMap(lessonAsOf))]);
}

/** "ข้อมูล ณ 16 พ.ย. 2569" is dropped when "ข้อมูล ณ 16 พ.ย. 2569 (ไตรมาสที่ 3/2569)" is also listed. */
function dropPrefixes(stamps: string[]): string[] {
  return stamps.filter((s) => !stamps.some((o) => o !== s && o.startsWith(s)));
}
