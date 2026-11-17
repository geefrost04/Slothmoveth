// The สศช. course as a learn-engine course: meta for the client, full content for route pages.

import { TOPICS, PLANNED } from '@/content/nesdc-learn';
import { DIAGNOSTIC } from '@/content/nesdc-learn/diagnostic';
import { buildOutline, type Course, type CourseMeta } from '@/lib/learn/course';
import { BASE, EXAM_DATE, EXAM_DATE_ESTIMATE, EXAM_DATE_NOTE, PASS_RULE, PATH, TEST_PASS, TEST_SIZE } from './config';
import { SOURCES } from './sources';

export const NESDC_META: CourseMeta = {
  id: 'nesdc',
  base: BASE,
  storageKey: 'nesdc-learn-v1',
  shortName: 'สศช.',
  pill: 'สศช. · พนักงานราชการ งานวิเคราะห์นโยบายและแผน',
  homeTitle: `แผนเตรียมสอบ ${PATH.length} วัน`,
  homeLead: 'เรียนทีละบทตามลำดับ แต่ละบทอธิบายว่าเรื่องนั้นทำงานอย่างไร แล้วฝึกคิดแบบที่ข้อสอบถาม ข้อมูลทุกข้ออ้างอิงเอกสารทางการพร้อมเลขหน้า',
  exam: { date: EXAM_DATE, estimate: EXAM_DATE_ESTIMATE, note: EXAM_DATE_NOTE, passRule: PASS_RULE },
  testSize: TEST_SIZE,
  testPass: TEST_PASS,
  topicTestSize: 20,
  path: PATH,
  specials: {
    diagnostic: { title: 'แบบวัดพื้นฐาน 30 ข้อ', meta: 'ใช้เวลาราว 25 นาที ครอบคลุมทุกหัวข้อที่สอบ ผลจะบอกว่าหัวข้อไหนควรใช้เวลามากเป็นพิเศษ ไม่มีผลต่อการเรียนบทแรก' },
    'mock-1': { title: 'สอบเสมือนจริง ชุดที่ 1', meta: 'เร็วๆ นี้' },
    'weak-review': { title: 'วันทบทวนหัวข้อที่อ่อน', meta: 'เร็วๆ นี้' },
    'final-review': { title: 'ทบทวนรอบสุดท้าย', meta: 'เร็วๆ นี้' }
  },
  diagnosticStep: 'diagnostic',
  parts: { 1: 'ภาค 1', 2: 'ภาค 2' },
  mapIntro: 'เรียงหัวข้อเฉพาะของ สศช. ก่อน แล้วจึงเป็นวิชาพื้นฐาน เปิดอ่านบทไหนก่อนก็ได้',
  footer: 'เนื้อหาอ้างอิงเอกสารทางการของ สศช. ราชกิจจานุเบกษา และหน่วยงานรัฐ พร้อมเลขหน้าในทุกบท',
  extraCard: {
    eyebrow: 'หลังประกาศผลข้อเขียน',
    title: 'เตรียมสอบสัมภาษณ์ (100 คะแนน)',
    body: 'ครึ่งหนึ่งของคะแนนทั้งหมดอยู่ที่การสัมภาษณ์ โมดูลนี้จะเปิดเมื่อใกล้ประกาศผลข้อเขียน โดยอิงเกณฑ์ที่ประกาศรับสมัครระบุไว้'
  },
  outline: buildOutline(TOPICS, PLANNED),
  sources: SOURCES
};

export const NESDC_COURSE: Course = {
  meta: NESDC_META,
  topics: TOPICS,
  diagnostic: DIAGNOSTIC,
  diagnosticPage: { title: 'แบบวัดพื้นฐาน 30 ข้อ', kicker: `ก่อนเริ่มแผน ${PATH.length} วัน`, description: 'แบบวัดพื้นฐานก่อนเริ่มแผนเตรียมสอบ สศช.' }
};
