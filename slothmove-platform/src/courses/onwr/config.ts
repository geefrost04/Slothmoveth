/**
 * ONWR (สำนักงานทรัพยากรน้ำแห่งชาติ) — พนักงานราชการ ตำแหน่งเจ้าหน้าที่วิเคราะห์นโยบายและแผน
 * Written exam scope from the announcement of 22 ต.ค. 2569 (ผนวก ตำแหน่งที่ 3), 200 คะแนน.
 * Content: note-style lessons (components/study-sheets/onwr*LessonData.ts) + exam sets in Supabase (onwr-<topic>-set-NN).
 * Subjects = the 9 written-exam topics in announcement order, plus a notes-only pre-exam review.
 */

import type { CourseConfig } from '@/lib/course-types';

export const onwrConfig: CourseConfig = {
  id: 'onwr',
  title: 'สทนช. นักวิเคราะห์นโยบายและแผน',
  tagline: 'พนักงานราชการ สำนักงานทรัพยากรน้ำแห่งชาติ',
  subtitle: 'เตรียมสอบข้อเขียน 200 คะแนน · ความรู้ทั่วไป 3 หัวข้อ · ความรู้เฉพาะตำแหน่ง 6 หัวข้อ',
  category: 'สำนักงานทรัพยากรน้ำแห่งชาติ',
  type: 'พนักงานราชการทั่วไป',
  theme: {
    primary: '#0b5f86',
    primaryDark: '#07425e',
    accent: '#2a9bc9',
    accentSoft: '#e3f3fa',
    surface: '#ffffff',
    logo: '/pic/logo_onwr.png'
  },
  subjects: [
    {
      id: 'org',
      title: 'ความรู้เกี่ยวกับ สทนช.',
      titleEn: 'About ONWR',
      icon: '🏛️',
      desc: 'ประวัติ สถานะ วิสัยทัศน์ พันธกิจ ค่านิยม ยุทธศาสตร์ โครงสร้างและหน่วยงาน ระบบงานของสำนักงานทรัพยากรน้ำแห่งชาติ',
      count: 0,
      games: []
    },
    {
      id: 'admin',
      title: 'การบริหารจัดการองค์กรภาครัฐ',
      titleEn: 'Public Administration',
      icon: '🏢',
      desc: 'ระเบียบบริหารราชการแผ่นดิน แผน 3 ระดับ ยุทธศาสตร์ชาติ พ.ร.ฎ.บริหารกิจการบ้านเมืองที่ดี ธรรมาภิบาล PMQA ITA',
      count: 0,
      games: []
    },
    {
      id: 'rules',
      title: 'ระเบียบพนักงานราชการและการปฏิบัติราชการ',
      titleEn: 'Government Employee Rules',
      icon: '📜',
      desc: 'ระเบียบสำนักนายกฯ ว่าด้วยพนักงานราชการ คพร. สิทธิการลา วินัย และกฎหมายปกครองที่ใช้ในงานราชการ',
      count: 0,
      games: []
    },
    {
      id: 'policy',
      title: 'การจัดทำนโยบายและแผน',
      titleEn: 'Policy & Planning',
      icon: '🧭',
      desc: 'นโยบายสาธารณะ วงจรนโยบาย ตัวแบบนโยบาย การวางแผน SWOT/TOWS ตัวชี้วัด และเครื่องมือวางแผน',
      count: 0,
      games: []
    },
    {
      id: 'masterplan',
      title: 'นโยบายและแผนแม่บทน้ำ',
      titleEn: 'Water Master Plan',
      icon: '🗺️',
      desc: 'แผนแม่บทการบริหารจัดการทรัพยากรน้ำ 20 ปี ฉบับแรกและฉบับปรับปรุง การขับเคลื่อน และมาตรการรับมือฤดูฝน/ฤดูแล้ง',
      count: 0,
      games: []
    },
    {
      id: 'monitoring',
      title: 'การติดตามและประเมินผลโครงการ',
      titleEn: 'Monitoring & Evaluation',
      icon: '📊',
      desc: 'ประเภทการประเมิน CIPP Kirkpatrick เกณฑ์ OECD DAC ตัวชี้วัด และระบบติดตามผล',
      count: 0,
      games: []
    },
    {
      id: 'project',
      title: 'การวิเคราะห์แผนงานโครงการ',
      titleEn: 'Project Analysis',
      icon: '📐',
      desc: 'วงจรโครงการ การศึกษาความเป็นไปได้ Logframe NPV/IRR/B-C และเครื่องมือบริหารโครงการ',
      count: 0,
      games: []
    },
    {
      id: 'meeting',
      title: 'การบริหารจัดการประชุมและการมีส่วนร่วม',
      titleEn: 'Meetings & Participation',
      icon: '🤝',
      desc: 'การจัดประชุม องค์ประชุม รายงานการประชุม เทคนิคการประชุม และระดับการมีส่วนร่วม IAP2',
      count: 0,
      games: []
    },
    {
      id: 'wateract',
      title: 'พ.ร.บ.ทรัพยากรน้ำ พ.ศ. 2561',
      titleEn: 'Water Resources Act',
      icon: '💧',
      desc: 'องค์กรบริหารจัดการน้ำ การใช้น้ำ 3 ประเภทและใบอนุญาต ภาวะน้ำแล้ง/น้ำท่วม การอนุรักษ์ และบทกำหนดโทษ',
      count: 0,
      games: []
    },
    {
      id: 'review',
      title: 'โน้ตทบทวนก่อนสอบ',
      titleEn: 'Pre-exam Review',
      icon: '⭐',
      desc: 'สรุปคู่ที่ชอบสลับและตัวเลขที่ต้องจำของทุกหัวข้อ',
      count: 0,
      games: []
    }
  ],
  games: [],
  meta: {
    description: 'เตรียมสอบพนักงานราชการ สำนักงานทรัพยากรน้ำแห่งชาติ (สทนช.) ตำแหน่งเจ้าหน้าที่วิเคราะห์นโยบายและแผน ครบทุกหัวข้อสอบข้อเขียน พร้อมโน้ตสรุปและข้อสอบเฉลยละเอียด ฟรี',
    keywords: ['สทนช.', 'สำนักงานทรัพยากรน้ำแห่งชาติ', 'พนักงานราชการ', 'นักวิเคราะห์นโยบายและแผน', 'พ.ร.บ.ทรัพยากรน้ำ 2561', 'แผนแม่บทน้ำ'],
    updated: '09/11/69',
    totalSubjects: 9,
    totalQuestions: 0,
    hideQuestionCounts: true,
    migrated: true,
    landing: {
      heroBadge: 'พนักงานราชการ · สทนช. · ฝึกฟรีทุกชุด',
      heroTitleLead: 'เตรียมสอบ สทนช.',
      heroTitleLines: ['นักวิเคราะห์', 'นโยบายและแผน'],
      heroTitleAccent: 'SlothMove',
      heroDescription: 'โน้ตสรุปและข้อสอบครบทุกหัวข้อตามประกาศรับสมัคร 22 ต.ค. 2569',
      primaryCtaLabel: 'เริ่มเรียน',
      primaryCtaHref: '#subjects',
      secondaryCtaLabel: 'ดูสนามสอบทั้งหมด',
      secondaryCtaHref: '/courses',
      mascotLabel: 'ONWR',
      scrollLabel: 'เลื่อนลง',
      stats: [],
      sections: []
    }
  }
};
