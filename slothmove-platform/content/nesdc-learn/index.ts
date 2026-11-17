// Registry of the สศช. tutor course: topics in path order, their lessons and summary pages.
// Lessons not written yet are listed in PLANNED so the topic map can show them as "เร็วๆ นี้".

import type { Lesson, Summary, Topic, TopicId } from '@/lib/nesdc-learn/types';
import { lesson as n1 } from './n/n1';
import { lesson as n2 } from './n/n2';
import { lesson as n3 } from './n/n3';
import { lesson as n4 } from './n/n4';
import { summary as summaryN } from './n/summary';
import { lesson as o1 } from './o/o1';
import { lesson as o2 } from './o/o2';
import { lesson as o3 } from './o/o3';
import { summary as summaryO } from './o/summary';
import { lesson as a1 } from './a/a1';
import { lesson as a2 } from './a/a2';
import { lesson as a3 } from './a/a3';
import { lesson as a4 } from './a/a4';
import { summary as summaryA } from './a/summary';
import { lesson as s1 } from './s/s1';
import { lesson as s2 } from './s/s2';
import { lesson as s3 } from './s/s3';
import { summary as summaryS } from './s/summary';
import { lesson as c1 } from './c/c1';
import { lesson as c2 } from './c/c2';
import { lesson as c3 } from './c/c3';
import { summary as summaryC } from './c/summary';
import { lesson as e1 } from './e/e1';
import { lesson as e2 } from './e/e2';
import { lesson as e3 } from './e/e3';
import { summary as summaryE } from './e/summary';
import { lesson as g1 } from './g/g1';
import { lesson as g2 } from './g/g2';
import { lesson as g3 } from './g/g3';
import { lesson as g4 } from './g/g4';
import { summary as summaryG } from './g/summary';

type Planned = { id: string; title: string };

export const PLANNED: Record<TopicId, Planned[]> = {
  n: [],
  o: [
    { id: 'o1', title: 'สศช. คือใคร: ที่มา ชื่อ และบทบาท' },
    { id: 'o2', title: 'พ.ร.บ.สภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ พ.ศ. 2561' },
    { id: 'o3', title: 'โครงสร้าง งาน และผลงานของ สศช.' }
  ],
  a: [
    { id: 'a1', title: 'อ่านตารางและกราฟ คำนวณให้ถูก' },
    { id: 'a2', title: 'อ่านรายงานภาวะเศรษฐกิจและสังคมของ สศช.' },
    { id: 'a3', title: 'จับใจความ สรุปความ แยกข้อเท็จจริงกับความเห็น' },
    { id: 'a4', title: 'วิเคราะห์ปัญหา ตั้งตัวชี้วัด และเขียนข้อเสนอ' }
  ],
  s: [
    { id: 's1', title: 'หนังสือราชการ 6 ชนิด และเลือกให้ถูกงาน' },
    { id: 's2', title: 'ชั้นความเร็ว หนังสือเวียน และการรับ-ส่ง' },
    { id: 's3', title: 'เก็บ ยืม ทำลาย และอายุการเก็บ' }
  ],
  c: [
    { id: 'c1', title: 'คอมพิวเตอร์ เครือข่าย และอินเทอร์เน็ต' },
    { id: 'c2', title: 'Word Excel PowerPoint สำหรับงานวิเคราะห์' },
    { id: 'c3', title: 'ความปลอดภัยไซเบอร์ และกฎหมายดิจิทัล' }
  ],
  e: [
    { id: 'e1', title: 'ไวยากรณ์ที่ออกบ่อย' },
    { id: 'e2', title: 'ศัพท์นโยบายและเศรษฐกิจ' },
    { id: 'e3', title: 'อ่านจับใจความ' }
  ],
  g: [
    { id: 'g1', title: 'คณิตศาสตร์และร้อยละ' },
    { id: 'g2', title: 'อนุกรม' },
    { id: 'g3', title: 'เงื่อนไขสัญลักษณ์และเงื่อนไขภาษา' },
    { id: 'g4', title: 'ภาษาไทย' }
  ]
};

export const TOPICS: Topic[] = [
  { id: 'n', title: 'ยุทธศาสตร์ชาติและแผนพัฒนาฯ', short: 'ยุทธศาสตร์ชาติ/แผนฯ', part: 1, lessons: [n1, n2, n3, n4], summary: summaryN, ready: true },
  { id: 'o', title: 'ความรู้เกี่ยวกับ สศช.', short: 'องค์กร สศช.', part: 1, lessons: [o1, o2, o3], summary: summaryO, ready: true },
  { id: 'a', title: 'การสรุปและวิเคราะห์งาน', short: 'สรุปและวิเคราะห์', part: 2, lessons: [a1, a2, a3, a4], summary: summaryA, ready: true },
  { id: 's', title: 'งานสารบรรณ', short: 'สารบรรณ', part: 1, lessons: [s1, s2, s3], summary: summaryS, ready: true },
  { id: 'c', title: 'คอมพิวเตอร์', short: 'คอมพิวเตอร์', part: 1, lessons: [c1, c2, c3], summary: summaryC, ready: true },
  { id: 'e', title: 'ภาษาอังกฤษ', short: 'อังกฤษ', part: 1, lessons: [e1, e2, e3], summary: summaryE, ready: true },
  { id: 'g', title: 'ความรู้ความสามารถทั่วไป', short: 'ความรู้ทั่วไป', part: 1, lessons: [g1, g2, g3, g4], summary: summaryG, ready: true }
];

export function getTopic(id: string): Topic | undefined {
  return TOPICS.find((t) => t.id === id);
}

export function getLesson(topicId: string, lessonId: string): Lesson | undefined {
  return getTopic(topicId)?.lessons.find((l) => l.id === lessonId);
}

export function getSummary(topicId: string): Summary | undefined {
  return getTopic(topicId)?.summary;
}

/** Every lesson of a topic, written or planned, in order. */
export function lessonOutline(topic: Topic): { id: string; title: string; ready: boolean; minutes?: number }[] {
  const written = topic.lessons.map((l) => ({ id: l.id, title: l.title, ready: true, minutes: l.minutes }));
  const planned = PLANNED[topic.id].filter((p) => !topic.lessons.some((l) => l.id === p.id)).map((p) => ({ ...p, ready: false }));
  return [...written, ...planned];
}

/** Lesson title by id across the course (written or planned). */
export function lessonTitle(id: string): string | undefined {
  for (const topic of TOPICS) {
    const hit = lessonOutline(topic).find((l) => l.id === id);
    if (hit) return hit.title;
  }
  return undefined;
}

export function topicOfLesson(id: string): Topic | undefined {
  return TOPICS.find((t) => lessonOutline(t).some((l) => l.id === id));
}
