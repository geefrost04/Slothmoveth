/**
 * Police Admin course — config.ts
 *
 * Source of truth: ~/Documents/SlothMove/Page/source/police_admin/
 *   6 subjects (math, thai, computer, saraban, law, english)
 *   21 game IDs (10 shared with PAB + 11 custom)
 *
 * Migration status:
 *   - all 6 subjects are wired into Next.js
 *   - quiz / flashcard / match / cloze work across all subjects
 *   - math custom games already work for analogy / series /
 *     compare-values / word-problem / speed-percent
 *   - remaining custom games stay honest as skeleton placeholders
 *
 * Adding a new game: register it in SHARED_GAMES (and any subject-
 * specific overrides in meta.gameOverrides) then handle the new game
 * in data-loader.ts.
 */

import type { CourseConfig } from '@/lib/course-types';
import { getSubjectItemCount } from './data-loader';

const SHARED_GAMES = [
  // ───── 10 games that Next.js already supports ─────
  { id: 'quiz' as const,           label: 'Quiz',         labelTh: 'ควิซ',         icon: '✅', desc: 'คำถาม 4 ตัวเลือก',              status: 'full' as const },
  { id: 'flashcard' as const,     label: 'Flashcard',    labelTh: 'แฟลชการ์ด',   icon: '🃏', desc: 'พลิกการ์ดทบทวน',                 status: 'full' as const },
  { id: 'match' as const,         label: 'Match',        labelTh: 'จับคู่',       icon: '🔗', desc: 'จับคู่คำศัพท์',                   status: 'full' as const },
  { id: 'cloze' as const,         label: 'Cloze',        labelTh: 'เติมคำ',       icon: '📝', desc: 'เติมคำในช่องว่าง',                status: 'full' as const },
  { id: 'sorting' as const,       label: 'Sorting',      labelTh: 'เรียงลำดับ',   icon: '🔢', desc: 'เรียงลำดับตามหมวด',                status: 'full' as const },
  { id: 'order' as const,         label: 'Order',        labelTh: 'เรียงขั้นตอน', icon: '📋', desc: 'เรียงลำดับขั้นตอนการทำงาน',     status: 'full' as const },
  { id: 'spelling' as const,      label: 'Spelling',     labelTh: 'สะกดคำ',       icon: '✍️', desc: 'ฝึกสะกดคำศัพท์',                 status: 'full' as const },
  { id: 'truefalse' as const,     label: 'True/False',   labelTh: 'ถูกหรือผิด',   icon: '⚖️', desc: 'ตัดสินถูกผิด',                     status: 'full' as const },
  { id: 'authority' as const,     label: 'Authority',    labelTh: 'หน่วยงาน',     icon: '🏛️', desc: 'จับคู่หน่วยงานกับภารกิจ',         status: 'full' as const },
  { id: 'logic' as const,         label: 'Logic',        labelTh: 'ตรรกะและการสรุปผล', icon: '🧠', desc: 'วิเคราะห์เงื่อนไขและสรุปเหตุผล',    status: 'full' as const },
  { id: 'survival' as const,      label: 'Survival',     labelTh: 'ตอบผิดจบเกม',   icon: '🔥', desc: 'ตอบถูกไปต่อ ตอบผิดจบทันที',          status: 'full' as const },
  { id: 'speed' as const,         label: 'Speed Quiz',   labelTh: 'แข่งตอบกับเวลา', icon: '⚡', desc: 'แข่งเวลา เก็บแต้มจากวินาทีที่เหลือ',   status: 'full' as const },
  { id: 'matrix' as const,        label: 'Matrix',       labelTh: 'ตารางตัวเลข',   icon: '🧩', desc: 'เติมช่องที่หายไปในตารางเมทริกซ์',      status: 'full' as const },

  // ───── 9 new games — Phase B/C will build components ─────
  // Listed as skeleton until their data-loader entries and components exist.
  { id: 'series' as const,         label: 'Series',         labelTh: 'อนุกรม',         icon: '🔢', desc: 'เติมตัวเลขในอนุกรม',                status: 'full' as const },
  { id: 'analogy' as const,         label: 'Analogy',        labelTh: 'อุปมาอุปไมย',   icon: '🔗', desc: 'จับคู่ความสัมพันธ์ของคู่คำ',     status: 'full' as const },
  { id: 'compare-values' as const,  label: 'Compare Values', labelTh: 'เปรียบเทียบ',     icon: '⚖️', desc: 'เปรียบเทียบค่าตัวเลข',              status: 'full' as const },
  { id: 'word-problem' as const,    label: 'Word Problem',   labelTh: 'โจทย์ปัญหา',     icon: '🧮', desc: 'โจทย์ปัญหาหลายขั้นตอน',           status: 'full' as const },
  { id: 'speed-percent' as const,   label: 'Speed Percent',  labelTh: 'ความเร็ว %',     icon: '⏱️', desc: 'ฝึกความเร็วในการคิดเปอร์เซ็นต์', status: 'full' as const },
  { id: 'number-match' as const,    label: 'Number Match',   labelTh: 'จับคู่ตัวเลข',   icon: '🔢', desc: 'เกมจับคู่ตัวเลขแบบตารางความจำ',  status: 'skeleton' as const },
  { id: 'process-sort' as const,    label: 'Process Sort',   labelTh: 'เรียงขั้นตอน',   icon: '🛠️', desc: 'เรียงลำดับขั้นตอนการทำงานราชการ',  status: 'skeleton' as const },
  { id: 'computer-logic' as const,  label: 'Computer Logic', labelTh: 'ตรรกะคอมฯ',     icon: '💻', desc: 'โจทย์สถานการณ์ด้านคอมพิวเตอร์',   status: 'skeleton' as const },
  { id: 'dialogue' as const,        label: 'Dialogue',       labelTh: 'สนทนา',         icon: '💬', desc: 'เติมคำในบทสนทนาภาษาอังกฤษ',       status: 'full' as const },
  { id: 'error-detector' as const,  label: 'Error Detector', labelTh: 'หาข้อผิด',       icon: '🔍', desc: 'หาข้อผิดทางไวยากรณ์ภาษาอังกฤษ',  status: 'full' as const },
  { id: 'flashcard-review' as const, label: 'Flash Review',   labelTh: 'ทบทวนการ์ด',   icon: '🎴', desc: 'ทบทวนแฟลชการ์ดแบบเน้นจุดจำ',   status: 'skeleton' as const }
];

export const policeAdminConfig: CourseConfig = {
  id: 'police_admin',
  useDrillNav: true,
  title: 'ตำรวจสายอำนวยการ',
  tagline: 'นายสิบตำรวจ สายอำนวยการ',
  subtitle: 'เตรียมสอบนายสิบตำรวจ · สรุปครบ 6 วิชา · คลังข้อสอบและเกมฝึกฝน',
  category: 'สำนักงานตำรวจแห่งชาติ',
  type: 'ข้าราชการตำรวจชั้นประทวน',
  sourceFolder: 'police_admin',
  theme: {
    primary: '#7a1822',
    primaryDark: '#560f17',
    accent: '#c84f60',
    accentSoft: '#fde7ea',
    surface: '#ffffff',
    logo: '/pic/logo_police.png',
    mascot: '/pic/course-mascot/police-hero.png'
  },
  subjects: [
    // ───── ภาค ก. ความรู้ความสามารถทั่วไป (40 คะแนน) ─────
    {
      id: 'math',
      title: 'ความสามารถทั่วไป',
      titleEn: 'General Ability',
      icon: '🔢',
      mascot: '/pic/police-mascot/math.png',
      desc: 'ความสามารถทั่วไป (20 ข้อ) · คิดวิเคราะห์ · คิดเชิงเหตุผล · คณิตศาสตร์พื้นฐาน · อนุกรม · สถิติพื้นฐาน · การตีความข้อมูล',
      count: getSubjectItemCount('math', 'quiz'),
      games: ['quiz', 'survival', 'speed', 'series', 'matrix', 'logic', 'analogy']
    },
    {
      id: 'thai',
      title: 'ภาษาไทย',
      titleEn: 'Thai Language',
      icon: '📚',
      mascot: '/pic/police-mascot/thai.png',
      desc: 'ภาษาไทย (20 ข้อ) · การอ่านจับใจความ · การใช้ภาษา · หลักภาษา · การเขียน · การสรุปความ · วิเคราะห์บทความ',
      count: getSubjectItemCount('thai', 'quiz'),
      games: ['quiz', 'flashcard', 'match', 'order', 'spelling']
    },
    // ───── ภาค ข. ความรู้ความสามารถเฉพาะตำแหน่ง (110 คะแนน) ─────
    {
      id: 'computer',
      title: 'คอมพิวเตอร์และเทคโนโลยีสารสนเทศ',
      titleEn: 'Computer & IT',
      icon: '💻',
      mascot: '/pic/police-mascot/computer.png',
      desc: 'คอมพิวเตอร์ (40 ข้อ) · พื้นฐานคอมฯ · ระบบคอมฯ · เครือข่าย · อินเทอร์เน็ต · Social Media · MS Word · MS Excel · MS PowerPoint',
      count: getSubjectItemCount('computer', 'quiz'),
      games: ['quiz', 'flashcard', 'match', 'truefalse']
    },
    {
      id: 'saraban',
      title: 'ระเบียบงานสารบรรณ',
      titleEn: 'Saraban Regulation',
      icon: '📁',
      mascot: '/pic/police-mascot/saraban.png',
      desc: 'งานสารบรรณและลักษณะที่ 54 (30 ข้อ) · ระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ · หลักเกณฑ์งานสารบรรณตำรวจและแนวปฏิบัติภายใน ตร.',
      count: getSubjectItemCount('saraban', 'quiz'),
      games: ['quiz', 'flashcard', 'match', 'cloze', 'order', 'sorting', 'number-match', 'process-sort', 'authority', 'truefalse']
    },
    {
      id: 'law',
      title: 'กฎหมายที่ประชาชนควรรู้',
      titleEn: 'Law for Citizens',
      icon: '⚖️',
      mascot: '/pic/police-mascot/law.png',
      desc: 'กฎหมาย (25 ข้อ) · แพ่งและพาณิชย์ · อาญา · ที่ดิน · วิธีพิจารณาความอาญา · บริหารกิจการบ้านเมืองที่ดี · กฎหมายตำรวจและวินัย',
      count: getSubjectItemCount('law', 'quiz'),
      games: ['quiz', 'flashcard', 'cloze', 'authority', 'truefalse']
    },
    {
      id: 'english',
      title: 'ภาษาอังกฤษ',
      titleEn: 'English',
      icon: '🇬🇧',
      mascot: '/pic/police-mascot/english.png',
      desc: 'ภาษาอังกฤษ (15 ข้อ) · Reading Comprehension · Vocabulary · Grammar / Structure · Conversation · ใช้ในชีวิตประจำวันและการทำงาน',
      count: getSubjectItemCount('english', 'quiz'),
      games: ['quiz', 'cloze', 'dialogue']
    }
  ],
  games: SHARED_GAMES,
  meta: {
    description: 'คอร์สเตรียมสอบนายสิบตำรวจ สายอำนวยการ — 6 วิชา พร้อมเกมฝึกทำข้อสอบและทบทวน',
    keywords: ['นายสิบตำรวจ', 'สายอำนวยการ', 'สอบตำรวจ', 'คณิตศาสตร์', 'ภาษาไทย', 'คอมพิวเตอร์', 'งานสารบรรณ', 'กฎหมาย', 'ภาษาอังกฤษ'],
    updated: '23/06/26',
    totalSubjects: 6,
    totalQuestions: 1400,
    migrated: true,
    migrationNote: 'ย้ายข้อมูลแล้วครบ 6 วิชา · Quiz/Flashcard/Match/Cloze ใช้งานได้ · เพิ่มชุดกฎหมายอ่านสอบและข้อสอบเสริมสำหรับสนามตำรวจสายอำนวยการ · เกมอื่นที่ยังไม่พร้อมจะแสดงเป็นกำลังพัฒนาตามจริง',
    landing: {
      heroBadge: 'คอร์สเตรียมสอบ · นายสิบตำรวจ สายอำนวยการ · ฟรีทั้งหมด',
      heroTitleLead: 'เตรียมสอบนายสิบตำรวจ',
      heroTitleLines: ['นายสิบตำรวจ', 'สายอำนวยการ'],
      heroTitleAccent: 'SlothMove',
      heroDescription: 'เนื้อหาสรุปครบ 6 วิชา · ภาค ก. 40 คะแนน + ภาค ข. 110 คะแนน · คลังข้อสอบ 1,400 ข้อ และเกมฝึกทำข้อสอบหลากหลายรูปแบบ',
      primaryCtaLabel: 'เข้าเรียนเลย',
      primaryCtaHref: '#police-part1',
      secondaryCtaLabel: 'กลับไปดูคอร์สทั้งหมด',
      secondaryCtaHref: '/',
      mascotLabel: 'Royal Thai Police',
      scrollLabel: 'เลื่อนลง',
      stats: [
        { value: '6', label: 'วิชาทั้งหมด' },
        { value: '1,400+', label: 'ข้อสอบพร้อมเฉลย' },
        { value: '150', label: 'คะแนนเต็ม (ภาค ก + ภาค ข)' }
      ],
      sections: [
        // ───── ภาค ก. (40 คะแนน) ─────
        {
          id: 'police-part1',
          chip: 'ภาค ก · 40 คะแนน',
          title: 'ความรู้ความสามารถทั่วไป',
          subtitle: '1. ความรู้ทั่วไป (20 ข้อ) · 2. ภาษาไทย (20 ข้อ)',
          partClass: 'part1',
          partLabel: 'ก',
          categoryLabel: 'ความรู้ความสามารถทั่วไป',
          subjectIds: ['math', 'thai']
        },
        // ───── ภาค ข. (110 คะแนน) ─────
        {
          id: 'police-part2',
          chip: 'ภาค ข · 110 คะแนน',
          title: 'ความรู้ความสามารถเฉพาะตำแหน่ง',
          subtitle: '3. คอมพิวเตอร์ฯ (40 ข้อ) · 4. ระเบียบงานสารบรรณ (30 ข้อ) · 5. กฎหมาย (25 ข้อ) · 6. ภาษาอังกฤษ (15 ข้อ)',
          partClass: 'part2',
          partLabel: 'ข',
          categoryLabel: 'ความรู้เฉพาะตำแหน่ง',
          subjectIds: ['computer', 'saraban', 'law', 'english']
        }
      ]
    }
  }
};
