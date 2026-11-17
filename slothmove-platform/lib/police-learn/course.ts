// The police course (ตำรวจชั้นประทวน สายอำนวยการและสนับสนุน อก.1) as a learn-engine course.

import { EXAM_ITEMS, GENERAL_LINKS, PLANNED, PUBLISHED_TOPICS, TOPICS } from '@/content/police-learn';
import { buildOutline, type Course, type CourseMeta, type PathDay } from '@/lib/learn/course';
import { SOURCES } from './sources';

export const POLICE_BASE = '/courses/police_admin/learn';

/** 12-day plan: Mini Mock first, lessons by exam weight, then full Mock Tests, then summaries. */
export const POLICE_PATH: PathDay[] = [
  { day: 1, items: ['mini-mock', 'pc1'], extra: 'ทำ Mini Mock ก่อน เพื่อดูว่าวิชาไหนยังอ่อน แล้วเริ่มคอมพิวเตอร์ซึ่งมี 40 ข้อ มากที่สุดในข้อสอบ (ตามสรุปขอบเขตจากประกาศ)' },
  { day: 2, items: ['pc1b', 'pc2', 'pc3', 'gen-ratios'], extra: 'ทุกวันมีโจทย์ความสามารถทั่วไป 1 ชุด ใช้เวลาราว 20–30 นาที อ่านวิธีคิดในเฉลยทุกข้อ' },
  { day: 3, items: ['pc4', 'pc5', 'ps1', 'pg1'], extra: 'ทวนข้อที่ผิด' },
  { day: 4, items: ['ps2', 'ps2b', 'ps3', 'ps4', 'gen-algebra'], extra: 'บทมาตรฐานตราและแบบพิมพ์สั้น ใช้เวลาราว 18 นาที' },
  { day: 5, items: ['ps5', 'pl1', 'pl2', 'summary:pc', 'pg2'], extra: 'ทวนข้อที่ผิด' },
  { day: 6, items: ['pl3', 'pl4', 'pl5', 'summary:ps', 'gen-stats'] },
  { day: 7, items: ['pl6', 'pt1', 'pt2', 'pg3'], extra: 'ทวนข้อที่ผิด' },
  { day: 8, items: ['pt3', 'pe1', 'pe2', 'pe3', 'pg4'], extra: 'บทภาษาอังกฤษสั้นกว่าบทอื่น ถ้าไม่ทัน ให้ทำ pe3 ก่อน Mock Test วันที่ 9' },
  { day: 9, items: ['mock-1', 'test:pc', 'test:ps', 'pg5'], extra: 'Mock Test จับเวลา 3 ชั่วโมงเหมือนสนามจริง แล้วทวนข้อที่ผิด' },
  { day: 10, items: ['mock-2', 'test:pl', 'test:pe', 'gen-geometry'], extra: 'ดูคะแนนแยกรายวิชาจาก Mock Test แล้วกลับไปอ่านส่วน “ออกบ่อย ต้องอ่าน” ของวิชาที่ต่ำสุด' },
  { day: 11, items: ['mock-3', 'test:pt', 'gen-aptitude'], extra: 'ทวนข้อที่ผิดทั้งหมดที่ค้างอยู่' },
  { day: 12, items: ['summary:pc', 'summary:ps', 'summary:pl', 'summary:pt', 'summary:pe'], extra: 'วันสุดท้ายอ่านเฉพาะหน้าสรุป พักผ่อนให้พอ เตรียมบัตรประจำตัวสอบ บัตรประชาชน ดินสอ 2B ขึ้นไป และปากกาน้ำเงิน' }
];

const MOCK = { href: '/courses/police_admin/mock-test', meta: '150 ข้อ จับเวลา 3 ชั่วโมง เลือกชุดที่ยังไม่ได้ทำ ทำเสร็จแล้วกลับมากด “ทำเสร็จ”', tickable: true as const };

export const POLICE_META: CourseMeta = {
  id: 'police',
  base: POLICE_BASE,
  storageKey: 'police-learn-v1',
  shortName: 'ตำรวจ อก.1',
  pill: 'ตำรวจชั้นประทวน · สายอำนวยการและสนับสนุน (อก.1)',
  homeTitle: 'แผนเตรียมสอบ 12 วัน',
  homeLead: 'เรียนเฉพาะเรื่องที่ออกสอบ เรียงตามน้ำหนักคะแนน ทุกบทบอกว่าส่วนไหนออกบ่อย ส่วนไหนข้ามได้ แล้วฝึกทำข้อสอบย่อยที่ไม่ซ้ำกับคลังข้อสอบ',
  exam: {
    date: '2026-11-29',
    estimate: '29 พ.ย. 2569',
    note: '',
    passRule: 'ต้องได้ไม่ต่ำกว่าร้อยละ 60 ในแต่ละภาค: ภาคความรู้ความสามารถทั่วไป 24 จาก 40 และภาคความรู้ความสามารถที่ใช้เฉพาะตำแหน่ง 66 จาก 110',
    facts: [
      'อาทิตย์ 29 พ.ย. 2569 เวลา 13.30–16.30 น. ศูนย์สอบธรรมศาสตร์ รังสิต (เข้าห้องสอบ 11.30–13.15 น.)',
      '150 ข้อ ปรนัย 4 ตัวเลือก 3 ชั่วโมง เฉลี่ยข้อละ 1 นาที 12 วินาที',
      'คะแนนต่ำสุดของผู้สอบได้รอบก่อน 107/150 (ปี 2562) และ 117/150 (ปี 2565) ตามข้อมูลที่รวบรวมไว้ ไม่ใช่ประกาศทางการ'
    ]
  },
  testSize: 10,
  testPass: 8,
  topicTestSize: 20,
  path: POLICE_PATH,
  specials: {
    'mini-mock': {
      title: 'Mini Mock 30 ข้อ (วัดระดับ)',
      href: '/courses/police_admin/mini-mock/police-mini_mock-set-03',
      meta: 'ครบ 6 วิชา ใช้เวลาราว 35 นาที ผลจะบอกว่าวิชาไหนควรใช้เวลามากเป็นพิเศษ ทำเสร็จแล้วกลับมากด “ทำเสร็จ”',
      tickable: true
    },
    'mock-1': { title: 'Mock Test 150 ข้อ (ชุดที่ 1 ของแผน)', ...MOCK },
    'mock-2': { title: 'Mock Test 150 ข้อ (ชุดที่ 2 ของแผน)', ...MOCK },
    'mock-3': { title: 'Mock Test 150 ข้อ (ชุดที่ 3 ของแผน)', ...MOCK },
    ...Object.fromEntries(
      GENERAL_LINKS.map((l) =>
        PUBLISHED_TOPICS.includes('pg')
          ? [l.id, { title: `ความสามารถทั่วไป: ${l.title}`, href: l.href, meta: `${l.meta} ฝึกในคลังข้อสอบ อ่านวิธีคิดในเฉลย ทำเสร็จแล้วกลับมากด “ทำเสร็จ”`, tickable: true as const }]
          : [l.id, { title: `ความสามารถทั่วไป: ${l.title}`, meta: 'เร็วๆ นี้' }]
      )
    )
  },
  diagnosticStep: 'mini-mock',
  parts: { 1: 'ภาคความรู้ความสามารถทั่วไป', 2: 'ภาคเฉพาะตำแหน่ง' },
  mapIntro: 'เรียงตามจำนวนข้อในข้อสอบ วิชาที่มีข้อมากอยู่ก่อน ถ้าเวลาน้อย ให้อ่านส่วนที่ติดป้าย “ออกบ่อย ต้องอ่าน” ก่อน',
  priorityNote: 'ป้ายระดับความสำคัญเป็นการประเมินของเรา จากขอบเขตวิชาตามประกาศและสัดส่วนหัวข้อในชุดข้อสอบเสมือนจริง ไม่ใช่ข้อมูลจากผู้ออกข้อสอบ',
  footer: 'เนื้อหาอ้างอิงระเบียบงานสารบรรณ ระเบียบสำนักงานตำรวจแห่งชาติ ประมวลกฎหมาย และประกาศกองบัญชาการศึกษา พร้อมเลขหน้าหรือมาตรา ส่วนความรู้ทั่วไปด้านคอมพิวเตอร์ ภาษา และการคิดคำนวณระบุไว้ว่าเป็นความรู้ทั่วไป',
  outline: buildOutline(TOPICS, PLANNED, EXAM_ITEMS),
  sources: SOURCES
};

export const POLICE_COURSE: Course = { meta: POLICE_META, topics: TOPICS };
