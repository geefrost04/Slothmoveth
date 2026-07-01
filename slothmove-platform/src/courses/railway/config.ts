import type { CourseConfig } from '@/lib/course-types';
import { getSubjectItemCount } from './data-loader';

/**
 * State Railway of Thailand (SRT) — exam prep course.
 *
 * Config aligned with the official syllabus for
 * "เจ้าหน้าที่วิเคราะห์นโยบายและแผน 2 (ระดับ 6)" from thaijobjob.com
 */

const SHARED_GAMES = [
  { id: 'quiz' as const, label: 'Quiz', labelTh: 'ควิซ', icon: '✅', desc: 'คำถาม 4 ตัวเลือก', status: 'full' as const },
  { id: 'flashcard' as const, label: 'Flashcard', labelTh: 'แฟลชการ์ด', icon: '🃏', desc: 'พลิกการ์ดทบทวน', status: 'full' as const },
  { id: 'match' as const, label: 'Match', labelTh: 'จับคู่', icon: '🔗', desc: 'จับคู่คำศัพท์', status: 'full' as const },
  { id: 'cloze' as const, label: 'Cloze', labelTh: 'เติมคำ', icon: '📝', desc: 'เติมคำในช่องว่าง', status: 'full' as const },
  { id: 'sorting' as const, label: 'Sorting', labelTh: 'เรียงลำดับ', icon: '🔢', desc: 'เรียงลำดับความสำคัญ', status: 'skeleton' as const },
  { id: 'order' as const, label: 'Order', labelTh: 'เรียงขั้นตอน', icon: '📋', desc: 'เรียงลำดับขั้นตอน', status: 'skeleton' as const },
  { id: 'truefalse' as const, label: 'True/False', labelTh: 'ถูกหรือผิด', icon: '⚖️', desc: 'ตัดสินถูกผิด', status: 'skeleton' as const },
  { id: 'authority' as const, label: 'Authority', labelTh: 'หน่วยงาน', icon: '🏛️', desc: 'จับคู่หน่วยงานกับภารกิจ', status: 'skeleton' as const }
];

export const railwayConfig: CourseConfig = {
  id: 'railway',
  title: 'เจ้าหน้าที่การรถไฟแห่งประเทศไทย',
  tagline: 'การรถไฟแห่งประเทศไทย (ร.ฟ.ท.)',
  subtitle: 'หลักสูตรสอบคัดเลือก พ.ศ. 2567 · สรุปกฎหมายและความรู้ทั่วไปที่เกี่ยวข้องกับการรถไฟ',
  category: 'รัฐวิสาหกิจ · กระทรวงคมนาคม',
  type: 'พนักงานการรถไฟแห่งประเทศไทย',
  sourceFolder: 'RAILWAY',
  theme: {
    primary: '#6b1a1a',
    primaryDark: '#4a1010',
    accent: '#b48a3e',
    accentSoft: '#fdf6e3',
    surface: '#fffdf8',
    logo: '/pic/logo-railway.png',
    mascot: '/pic/course-mascot/railway-hero.png'
  },
  subjects: [
    {
      id: 'rail_transport_act',
      title: 'พ.ร.บ. การขนส่งทางราง และกฎระเบียบที่เกี่ยวข้อง',
      icon: '🛤️',
      desc: 'การกำกับดูแลการขนส่งทางราง โครงสร้างพื้นฐาน และมาตรฐานความปลอดภัยทางราง',
      count: getSubjectItemCount('rail_transport_act', 'quiz')
    },
    {
      id: 'national_plans',
      title: 'แผนยุทธศาสตร์ชาติ 20 ปี และแผนพัฒนาฯ ฉบับปัจจุบัน',
      icon: '📋',
      desc: 'ยุทธศาสตร์ชาติ แผนแม่บท แผนพัฒนาเศรษฐกิจและสังคมแห่งชาติ และแผนปฏิบัติการคมนาคม',
      count: getSubjectItemCount('national_plans', 'quiz')
    },
    {
      id: 'srt_vision_strategy',
      title: 'วิสัยทัศน์ พันธกิจ และยุทธศาสตร์ของ ร.ฟ.ท.',
      icon: '🎯',
      desc: 'ทิศทางนโยบาย วิสัยทัศน์ พันธกิจ และแผนยุทธศาสตร์ของการรถไฟแห่งประเทศไทย',
      count: getSubjectItemCount('srt_vision_strategy', 'quiz')
    },
    {
      id: 'policy_analysis',
      title: 'ความรู้เกี่ยวกับการวิเคราะห์นโยบายและแผน',
      icon: '📊',
      desc: 'การวิเคราะห์ยุทธศาสตร์ ทิศทางนโยบาย การวางแผนยุทธศาสตร์เชิงเชื่อมโยงสู่แผนปฏิบัติการ',
      count: getSubjectItemCount('policy_analysis', 'quiz')
    },
    {
      id: 'state_enterprise_eval',
      title: 'การติดตามประเมินผลและการบริหารจัดการรัฐวิสาหกิจ',
      icon: '🏢',
      desc: 'หลักเกณฑ์การประเมินผลการดำเนินงาน การควบคุมภายใน การบริหารความเสี่ยงรัฐวิสาหกิจ',
      count: getSubjectItemCount('state_enterprise_eval', 'quiz')
    },
    {
      id: 'sipoc_process',
      title: 'การวิเคราะห์กระบวนการทำงานและแผนภาพรวม (SIPOC)',
      icon: '🔄',
      desc: 'การวิเคราะห์กระบวนการทํางานแบบครบวงจรและเครื่องมือบริหารจัดการสมัยใหม่',
      count: getSubjectItemCount('sipoc_process', 'quiz')
    },
    {
      id: 'railway_general_knowledge',
      title: 'ความรู้ทั่วไปเกี่ยวกับการรถไฟแห่งประเทศไทย',
      icon: '📰',
      desc: 'ประวัติ พัฒนาการ โครงข่ายเส้นทาง และการให้บริการหลักของ ร.ฟ.ท.',
      count: getSubjectItemCount('railway_general_knowledge', 'quiz')
    },
    {
      id: 'railway_act',
      title: 'พ.ร.บ. การรถไฟแห่งประเทศไทย พ.ศ. 2494',
      icon: '🚂',
      desc: 'โครงสร้าง อำนาจหน้าที่ คณะกรรมการ ผู้ว่าการ และการกำกับดูแล ร.ฟ.ท.',
      count: getSubjectItemCount('railway_act', 'quiz')
    },
    {
      id: 'aptitude_test',
      title: 'ความถนัดทางเชาว์ปัญญา (Aptitude Test)',
      icon: '🧠',
      desc: 'การวิเคราะห์เหตุผล เชาว์ปัญญา มิติสัมพันธ์ และความสามารถในการคิดวิเคราะห์',
      count: getSubjectItemCount('aptitude_test', 'quiz')
    },
    {
      id: 'english',
      title: 'ภาษาอังกฤษ (English)',
      icon: '🌍',
      desc: 'ไวยากรณ์ การอ่าน คำศัพท์ และการสนทนาสำหรับงานรัฐวิสาหกิจ',
      count: getSubjectItemCount('english', 'quiz')
    },
    {
      id: 'labor_relations_act',
      title: 'พ.ร.บ. แรงงานรัฐวิสาหกิจสัมพันธ์ พ.ศ. 2543',
      icon: '🤝',
      desc: 'กฎหมายแรงงานรัฐวิสาหกิจสัมพันธ์ สิทธิหน้าที่สหภาพแรงงานและข้อพิพาทแรงงาน',
      count: getSubjectItemCount('labor_relations_act', 'quiz')
    }
  ],
  games: SHARED_GAMES,
  meta: {
    description: 'คอร์สเตรียมสอบเจ้าหน้าที่วิเคราะห์นโยบายและแผน 2 (ระดับ 6) การรถไฟแห่งประเทศไทย (ร.ฟ.ท.) ครอบคลุมกฎหมายเฉพาะ การบริหารยุทธศาสตร์รัฐวิสาหกิจ และวิชาความรู้ทั่วไปครบทุกวิชา',
    keywords: ['การรถไฟ', 'ร.ฟ.ท.', 'นักวิเคราะห์', 'ยุทธศาสตร์ชาติ', 'รัฐวิสาหกิจ', 'สอบวิเคราะห์', 'แรงงานรัฐวิสาหกิจ'],
    updated: '28/06/26',
    totalSubjects: 11,
    totalQuestions: 0,
    hideQuestionCounts: true,
    migrated: true,
    migrationNote: 'คอร์สนี้ปรับปรุงโครงสร้างวิชาให้ตรงตามประกาศรับสมัครสอบตำแหน่ง เจ้าหน้าที่วิเคราะห์นโยบายและแผน 2 พ.ศ. 2567 (ไฟล์ประกาศ thaijobjob.com)',
    landing: {
      heroBadge: 'คอร์สเตรียมสอบ · เจ้าหน้าที่วิเคราะห์นโยบายและแผน 2 · ร.ฟ.ท.',
      heroTitleLead: 'เตรียมสอบ',
      heroTitleLines: ['นักวิเคราะห์ 6', 'การรถไฟแห่งประเทศไทย'],
      heroTitleAccent: 'SlothMove',
      heroDescription: 'สรุปเนื้อหาเจาะลึกเฉพาะตำแหน่งและวิชาความรู้ทั่วไป รวม 200 คะแนนเต็ม ตรงตามประกาศสอบอย่างเป็นทางการ พ.ศ. 2567',
      primaryCtaLabel: 'เข้าเรียนบทเรียนสรุป',
      primaryCtaHref: '#railway-subject-1',
      secondaryCtaLabel: 'กลับไปดูคอร์สทั้งหมด',
      secondaryCtaHref: '/',
      mascotLabel: 'State Railway of Thailand',
      scrollLabel: 'เลื่อนลง',
      stats: [
        { value: '2', label: 'วิชาหลัก (200 คะแนน)' },
        { value: '11', label: 'หัวข้อวิชาสอบจริง' },
        { value: '180', label: 'เวลาสอบจริง (นาที)' }
      ],
      feature: {
        icon: '🎯',
        chip: 'จำลองสอบสนามจริง',
        title: 'โครงสร้างข้อสอบจำลอง 200 คะแนน',
        desc: 'ทดลองฝึกฝนทำข้อสอบตามข้อสอบจริงระดับ 6 แบ่งเป็นวิชาที่ 1 (วิชาเฉพาะตำแหน่ง 100 คะแนน) และวิชาที่ 2 (ความรู้ทั่วไป + กฎหมายรัฐวิสาหกิจ 100 คะแนน)',
        meta: ['📝 แบ่งเป็น 2 วิชาหลัก', '🚂 รวม 200 คะแนนเต็ม', '🎯 เฉลยละเอียดและเกร็ดจำสำหรับวิเคราะห์นโยบาย'],
        primaryCtaLabel: 'เริ่มฝึกฝนข้อสอบ',
        primaryCtaHref: '#railway-subject-1',
        secondaryCtaLabel: '',
        secondaryCtaHref: ''
      },
      sections: [
        {
          id: 'railway-subject-1',
          chip: 'วิชาที่ 1 · Part 1',
          title: 'ความรู้ความสามารถเฉพาะตำแหน่ง (100 คะแนน)',
          subtitle: 'กฎหมายยุทธศาสตร์ ยุทธศาสตร์ชาติ ยุทธศาสตร์ ร.ฟ.ท. กระบวนการประเมินผล และการวิเคราะห์กระบวนการทำงาน (SIPOC)',
          partClass: 'part1',
          partLabel: '1',
          categoryLabel: 'เฉพาะตำแหน่ง',
          subjectIds: [
            'rail_transport_act',
            'national_plans',
            'srt_vision_strategy',
            'policy_analysis',
            'state_enterprise_eval',
            'sipoc_process'
          ]
        },
        {
          id: 'railway-subject-2',
          chip: 'วิชาที่ 2 · Part 2',
          title: 'ความรู้ทั่วไป และ พ.ร.บ. แรงงานรัฐวิสาหกิจสัมพันธ์ (100 คะแนน)',
          subtitle: 'ความรู้ทั่วไปเกี่ยวกับ ร.ฟ.ท. กฎหมายการรถไฟ เชาว์ปัญญา ภาษาอังกฤษ และกฎหมายแรงงานสัมพันธ์',
          partClass: 'part2',
          partLabel: '2',
          categoryLabel: 'ความรู้ทั่วไป',
          subjectIds: [
            'railway_general_knowledge',
            'railway_act',
            'aptitude_test',
            'english',
            'labor_relations_act'
          ]
        }
      ]
    }
  }
};
