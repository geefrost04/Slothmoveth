// Registry of the police tutor course (/courses/police_admin/learn): topics in exam-weight order,
// their lessons, summaries and fresh topic tests. Planned lessons show on the map as "เร็วๆ นี้".
// Add a lesson: import it below and put it in its topic's `lessons`.

import type { Lesson, MCQ, Priority, Summary, Topic } from '@/lib/learn/types';

import { lesson as pc1 } from './pc/pc1';
import { lesson as pc1b } from './pc/pc1b';
import { lesson as pc2 } from './pc/pc2';
import { lesson as pc3 } from './pc/pc3';
import { lesson as pc4 } from './pc/pc4';
import { lesson as pc5 } from './pc/pc5';
import { lesson as pl1 } from './pl/pl1';
import { lesson as pl2 } from './pl/pl2';
import { lesson as pl3 } from './pl/pl3';
import { lesson as pl4 } from './pl/pl4';
import { lesson as pl5 } from './pl/pl5';
import { lesson as pl6 } from './pl/pl6';
import { lesson as pe1 } from './pe/pe1';
import { lesson as pe2 } from './pe/pe2';
import { lesson as pe3 } from './pe/pe3';
import { lesson as pt1 } from './pt/pt1';
import { lesson as pt2 } from './pt/pt2';
import { lesson as pt3 } from './pt/pt3';
import { lesson as pg1 } from './pg/pg1';
import { lesson as pg2 } from './pg/pg2';
import { lesson as pg3 } from './pg/pg3';
import { lesson as pg4 } from './pg/pg4';
import { lesson as pg5 } from './pg/pg5';
import { summary as summaryPc } from './pc/summary';
import { topicTest as testPc } from './pc/test';
import { summary as summaryPs } from './ps/summary';
import { topicTest as testPs } from './ps/test';
import { summary as summaryPl } from './pl/summary';
import { topicTest as testPl } from './pl/test';
import { summary as summaryPt } from './pt/summary';
import { topicTest as testPt } from './pt/test';
import { summary as summaryPe } from './pe/summary';
import { topicTest as testPe } from './pe/test';
import { lesson as ps1 } from './ps/ps1';
import { lesson as ps2 } from './ps/ps2';
import { lesson as ps2b } from './ps/ps2b';
import { lesson as ps3 } from './ps/ps3';
import { lesson as ps4 } from './ps/ps4';
import { lesson as ps5 } from './ps/ps5';

type Planned = { id: string; title: string; priority?: Priority; kind?: 'practice' };

export const PLANNED: Record<string, Planned[]> = {
  pc: [
    { id: 'pc1', title: 'ระบบคอมพิวเตอร์และองค์ประกอบ', priority: 'must' },
    { id: 'pc1b', title: 'ข้อมูล สารสนเทศ และหน่วยข้อมูล', priority: 'must' },
    { id: 'pc2', title: 'Word และ PowerPoint', priority: 'must' },
    { id: 'pc3', title: 'Excel: สูตรและฟังก์ชันที่ออกบ่อย', priority: 'must' },
    { id: 'pc4', title: 'เครือข่ายและอินเทอร์เน็ต', priority: 'must' },
    { id: 'pc5', title: 'ความปลอดภัย สื่อสังคมออนไลน์ และกฎหมายดิจิทัล', priority: 'must' }
  ],
  ps: [
    { id: 'ps1', title: 'ภาพรวมระเบียบงานสารบรรณ และหนังสือราชการ 6 ชนิด', priority: 'must' },
    { id: 'ps2', title: 'รูปแบบหนังสือ ชั้นความเร็ว ชั้นความลับ และการเตรียมส่ง', priority: 'must' },
    { id: 'ps2b', title: 'มาตรฐานตรา แบบพิมพ์ ซอง และเรื่องเบ็ดเตล็ด', priority: 'must' },
    { id: 'ps3', title: 'รับ ส่ง เก็บ ยืม ทำลาย และสารบรรณอิเล็กทรอนิกส์', priority: 'must' },
    { id: 'ps4', title: 'ลักษณะที่ 54 (1): สารบรรณตำรวจ บันทึกข้อความ และการจัดทำหนังสือ', priority: 'must' },
    { id: 'ps5', title: 'ลักษณะที่ 54 (2): เลขที่ประจำหน่วยงานและคำย่อในราชการตำรวจ', priority: 'must' }
  ],
  pl: [
    { id: 'pl1', title: 'หลักกฎหมายทั่วไปและรัฐธรรมนูญเบื้องต้น', priority: 'must' },
    { id: 'pl2', title: 'บุคคลและทรัพย์', priority: 'must' },
    { id: 'pl3', title: 'นิติกรรมและสัญญาใกล้ตัว', priority: 'must' },
    { id: 'pl4', title: 'ครอบครัวและมรดก', priority: 'must' },
    { id: 'pl5', title: 'กฎหมายอาญา: หลักทั่วไป โทษ และความผิดที่พบบ่อย', priority: 'must' },
    { id: 'pl6', title: 'กฎหมายแรงงานและกฎหมายในชีวิตประจำวัน', priority: 'maybe' }
  ],
  pg: [
    { id: 'pg1', title: 'อนุกรม', priority: 'must', kind: 'practice' },
    { id: 'pg2', title: 'อุปมาอุปไมย', priority: 'must', kind: 'practice' },
    { id: 'pg3', title: 'ตรรกะและเงื่อนไข', priority: 'must', kind: 'practice' },
    { id: 'pg4', title: 'มิติสัมพันธ์', priority: 'must', kind: 'practice' },
    { id: 'pg5', title: 'การอ่านตารางและกราฟ', priority: 'must', kind: 'practice' }
  ],
  pt: [
    { id: 'pt1', title: 'การอ่านวิเคราะห์ โวหาร และภาพพจน์', priority: 'must' },
    { id: 'pt2', title: 'การใช้คำ ระดับภาษา สำนวน และคำไวพจน์', priority: 'must' },
    { id: 'pt3', title: 'การเขียนให้ถูก: สะกดคำ ประโยคบกพร่อง ราชาศัพท์ และหลักภาษา', priority: 'must' }
  ],
  pe: [
    { id: 'pe1', title: 'Grammar 1: ชนิดของคำ Tense ประธานกับกริยา และ Article', priority: 'must' },
    { id: 'pe2', title: 'Grammar 2: Modal Passive Conditional Relative Clause และอื่น ๆ', priority: 'must' },
    { id: 'pe3', title: 'Conversation Vocabulary และ Reading', priority: 'must' }
  ]
};

/** Questions per subject on the real exam (ผนวก ฉ summary). */
export const EXAM_ITEMS: Record<string, number> = { pc: 40, ps: 30, pl: 25, pg: 20, pt: 20, pe: 15 };

/**
 * Topics that are live. Unlisted topics show as "เร็วๆ นี้" on the map and in the plan, and their pages are not
 * built (no route), even though their lesson files exist and are checked. One-line change to publish a topic.
 */
export const PUBLISHED_TOPICS: string[] = ['pc', 'ps', 'pl', 'pt', 'pg'];

const topic = (id: string, title: string, short: string, part: number, lessons: Lesson[], summary?: Summary, test?: MCQ[], links?: Topic['links']): Topic => {
  const live = PUBLISHED_TOPICS.includes(id);
  return {
    id,
    title,
    short,
    part: part as 1 | 2,
    lessons: live ? lessons : [],
    summary: live ? summary : undefined,
    test: live ? test : undefined,
    links: live ? links : undefined,
    ready: live && (lessons.length > 0 || !!links?.length)
  };
};

/** Existing police-math category sets (published question banks) used as general-ability practice. */
const MATH = '/courses/police_admin/math/exams/police-math-category-';
export const GENERAL_LINKS: NonNullable<Topic['links']> = [
  { id: 'gen-ratios', title: 'อัตราส่วนและร้อยละ', href: `${MATH}ratios-percent`, meta: '20 ข้อ' },
  { id: 'gen-algebra', title: 'สมการและอสมการ', href: `${MATH}algebra`, meta: '20 ข้อ' },
  { id: 'gen-stats', title: 'เซต สถิติ และความน่าจะเป็น', href: `${MATH}stats-prob`, meta: '20 ข้อ' },
  { id: 'gen-geometry', title: 'เรขาคณิตและมิติสัมพันธ์', href: `${MATH}geometry`, meta: '20 ข้อ' },
  { id: 'gen-aptitude', title: 'เชาวน์ปัญญา ตรรกะ และการใช้เหตุผล', href: `${MATH}aptitude-logic`, meta: '20 ข้อ' },
  { id: 'gen-foundations', title: 'พื้นฐานจำนวนและการคำนวณ', href: `${MATH}foundations`, meta: '40 ข้อ' }
];

export const TOPICS: Topic[] = [
  topic('pc', 'เทคโนโลยีสารสนเทศและคอมพิวเตอร์เพื่อสำนักงาน', 'คอมพิวเตอร์', 2, [pc1, pc1b, pc2, pc3, pc4, pc5], summaryPc, testPc),
  topic('ps', 'งานสารบรรณ', 'สารบรรณ', 2, [ps1, ps2, ps2b, ps3, ps4, ps5], summaryPs, testPs),
  topic('pl', 'กฎหมายที่ประชาชนควรรู้', 'กฎหมาย', 2, [pl1, pl2, pl3, pl4, pl5, pl6], summaryPl, testPl),
  topic('pg', 'ความสามารถทั่วไป: ฝึกโจทย์', 'ความสามารถทั่วไป', 1, [pg1, pg2, pg3, pg4, pg5], undefined, undefined, GENERAL_LINKS),
  topic('pt', 'ภาษาไทย', 'ภาษาไทย', 1, [pt1, pt2, pt3], summaryPt, testPt),
  topic('pe', 'ภาษาอังกฤษ', 'อังกฤษ', 2, [pe1, pe2, pe3], summaryPe, testPe)
];
