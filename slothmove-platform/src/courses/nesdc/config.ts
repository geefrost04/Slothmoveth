/**
 * NESDC (สำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ) — พนักงานราชการ ตำแหน่งพนักงานบริหารงานทั่วไป 3
 * (งานวิเคราะห์นโยบายและแผน), 10 อัตรา. Written exam scope from the announcement of 9 พ.ย. 2569, 100 คะแนน.
 * Content: note-style lessons (components/study-sheets/nesdcLessonData.ts) + exam sets in Supabase (nesdc-<topic>-set-NN).
 * Subjects = the 6 written-exam areas in announcement order (ความรู้เกี่ยวกับองค์กร split into org + national),
 * plus a notes-only pre-exam review.
 */

import type { CourseConfig } from '@/lib/course-types';

export const nesdcConfig: CourseConfig = {
  id: 'nesdc',
  title: 'สศช. งานวิเคราะห์นโยบายและแผน',
  tagline: 'พนักงานราชการ สำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ',
  subtitle: 'เตรียมสอบข้อเขียน 100 คะแนน · 6 หัวข้อตามประกาศรับสมัคร',
  category: 'สำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ',
  type: 'พนักงานราชการทั่วไป',
  theme: {
    primary: '#5b3fa6',
    primaryDark: '#3f2a7a',
    accent: '#8b6fd6',
    accentSoft: '#f1ecfb',
    surface: '#ffffff',
    logo: '/pic/slothmove_mascot.svg'
  },
  subjects: [
    {
      id: 'general',
      title: 'ความรู้ความสามารถทั่วไป',
      titleEn: 'General Aptitude',
      icon: '🧮',
      desc: 'คณิตศาสตร์ทั่วไป อนุกรม เงื่อนไขสัญลักษณ์ เงื่อนไขภาษา และภาษาไทย',
      count: 0,
      games: []
    },
    {
      id: 'saraban',
      title: 'งานสารบรรณ',
      titleEn: 'Official Correspondence',
      icon: '📨',
      desc: 'ระเบียบสำนักนายกฯ ว่าด้วยงานสารบรรณ หนังสือราชการ 6 ชนิด การรับ-ส่ง เก็บ ยืม ทำลาย และสารบรรณอิเล็กทรอนิกส์',
      count: 0,
      games: []
    },
    {
      id: 'english',
      title: 'ภาษาอังกฤษ',
      titleEn: 'English',
      icon: '🔤',
      desc: 'ไวยากรณ์ คำศัพท์งานนโยบายและเศรษฐกิจ บทสนทนา และการอ่านจับใจความ',
      count: 0,
      games: []
    },
    {
      id: 'computer',
      title: 'คอมพิวเตอร์',
      titleEn: 'Computer',
      icon: '💻',
      desc: 'พื้นฐานคอมพิวเตอร์ เครือข่าย Word Excel PowerPoint ความปลอดภัยไซเบอร์ และกฎหมายดิจิทัล',
      count: 0,
      games: []
    },
    {
      id: 'org',
      title: 'ความรู้เกี่ยวกับ สศช.',
      titleEn: 'About NESDC',
      icon: '🏛️',
      desc: 'ประวัติ พ.ร.บ.สภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ 2561 บทบาท และโครงสร้างของ สศช.',
      count: 0,
      games: []
    },
    {
      id: 'national',
      title: 'ยุทธศาสตร์ชาติและแผนพัฒนาฯ',
      titleEn: 'National Strategy & Plans',
      icon: '🗺️',
      desc: 'ยุทธศาสตร์ชาติ 20 ปี แผน 3 ระดับ แผนพัฒนาเศรษฐกิจและสังคมแห่งชาติ ฉบับที่ 13 และ SDGs',
      count: 0,
      games: []
    },
    {
      id: 'analysis',
      title: 'การสรุปและวิเคราะห์งาน',
      titleEn: 'Summarising & Analysis',
      icon: '📊',
      desc: 'อ่านตารางและกราฟ ตัวชี้วัดเศรษฐกิจสังคม สรุปความ เขียนรายงาน และวิเคราะห์นโยบาย',
      count: 0,
      games: []
    },
    {
      id: 'review',
      title: 'โน้ตทบทวนก่อนสอบ',
      titleEn: 'Pre-exam Review',
      icon: '⭐',
      desc: 'ตัวเลข สูตร และคู่ที่ชอบสลับของทุกหัวข้อ',
      count: 0,
      games: []
    }
  ],
  games: [],
  meta: {
    description: 'เตรียมสอบพนักงานราชการ สำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ (สศช.) ตำแหน่งพนักงานบริหารงานทั่วไป งานวิเคราะห์นโยบายและแผน ครบทุกหัวข้อสอบข้อเขียน พร้อมโน้ตสรุปและข้อสอบเฉลยละเอียด ฟรี',
    keywords: ['สศช.', 'สภาพัฒน์', 'สำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ', 'พนักงานราชการ', 'วิเคราะห์นโยบายและแผน', 'แผนพัฒนาฯ ฉบับที่ 13'],
    updated: '09/11/69',
    totalSubjects: 7,
    totalQuestions: 0,
    hideQuestionCounts: true,
    migrated: true,
    landing: {
      heroBadge: 'พนักงานราชการ · สศช. · ฝึกฟรีทุกชุด',
      heroTitleLead: 'เตรียมสอบ สศช.',
      heroTitleLines: ['งานวิเคราะห์', 'นโยบายและแผน'],
      heroTitleAccent: 'SlothMove',
      heroDescription: 'โน้ตสรุปและข้อสอบครบทุกหัวข้อตามประกาศรับสมัคร 9 พ.ย. 2569',
      primaryCtaLabel: 'เริ่มเรียน',
      primaryCtaHref: '#subjects',
      secondaryCtaLabel: 'ดูสนามสอบทั้งหมด',
      secondaryCtaHref: '/courses',
      mascotLabel: 'NESDC',
      scrollLabel: 'เลื่อนลง',
      stats: [],
      sections: []
    }
  }
};
