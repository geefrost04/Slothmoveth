import type { CourseConfig } from '@/lib/course-types';
import { getSubjectItemCount } from './data-loader';

/**
 * State Railway of Thailand (SRT) — exam prep course.
 *
 * Skeleton config — real data not yet migrated. Following the `ocsc` model:
 *   - `migrated: false` → drives "คอร์สนี้ยังไม่พร้อมให้บริการ" banner
 *   - `hideQuestionCounts: true` → suppress aspirational counts
 *   - subjects list = planned syllabus (verified from
 *     https://file.thaijobjob.com/prakad/railway202607/railway202607_1)
 *
 * Color story (SRT brand):
 *   primary  = deep wine/maroon (replaces navy as SRT identity)
 *   accent   = brass gold (railway heraldry)
 *   accentSoft = pale cream-gold wash
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
      id: 'railway_act',
      title: 'พ.ร.บ. การรถไฟแห่งประเทศไทย พ.ศ. 2494',
      icon: '🚂',
      desc: 'โครงสร้าง อำนาจหน้าที่ และการบริหารงานของการรถไฟแห่งประเทศไทย',
      count: getSubjectItemCount('railway_act', 'quiz')
    },
    {
      id: 'rail_transport_act',
      title: 'พ.ร.บ. การขนส่งทางราง พ.ศ. 2549',
      icon: '🛤️',
      desc: 'การกำกับดูแลการขนส่งทางรางและโครงสร้างพื้นฐานรถไฟ',
      count: getSubjectItemCount('rail_transport_act', 'quiz')
    },
    {
      id: 'labor_relations_act',
      title: 'พ.ร.บ. แรงงานรัฐวิสาหกิจสัมพันธ์ พ.ศ. 2543',
      icon: '🤝',
      desc: 'สิทธิและหน้าที่ของลูกจ้าง สหภาพแรงงาน และนายจ้างในรัฐวิสาหกิจ',
      count: getSubjectItemCount('labor_relations_act', 'quiz')
    },
    {
      id: 'railway_general_knowledge',
      title: 'ความรู้ทั่วไปเกี่ยวกับการรถไฟแห่งประเทศไทย',
      icon: '📰',
      desc: 'ประวัติ พัฒนาการ โครงข่ายเส้นทาง และบริการหลักของ ร.ฟ.ท.',
      count: getSubjectItemCount('railway_general_knowledge', 'quiz')
    },
    {
      id: 'state_enterprise_management',
      title: 'ความรู้เกี่ยวกับการบริหารจัดการรัฐวิสาหกิจ',
      icon: '🏢',
      desc: 'หลักการบริหารรัฐวิสาหกิจ การกำกับดูแล และแผนฟื้นฟูกิจการ',
      count: getSubjectItemCount('state_enterprise_management', 'quiz')
    },
    {
      id: 'public_policy_analysis',
      title: 'ความรู้เกี่ยวกับการวิเคราะห์นโยบายสาธารณะและแผนงาน',
      icon: '🎯',
      desc: 'กระบวนการนโยบาย การวิเคราะห์ การวางแผน และการประเมินผล',
      count: getSubjectItemCount('public_policy_analysis', 'quiz')
    },
    {
      id: 'labor_law',
      title: 'กฎหมายแรงงานและการคุ้มครองแรงงาน',
      icon: '⚖️',
      desc: 'ความคุ้มครองแรงงาน สวัสดิการ ค่าตอบแทน และสิทธิประโยชน์ลูกจ้าง',
      count: getSubjectItemCount('labor_law', 'quiz')
    },
    {
      id: 'business_ethics',
      title: 'จริยธรรมและธรรมาภิบาลขององค์กร',
      icon: '🪞',
      desc: 'จรรยาบรรณ การกำกับดูแลกิจการที่ดี และการต่อต้านทุจริต',
      count: getSubjectItemCount('business_ethics', 'quiz')
    },
    {
      id: 'data_analysis',
      title: 'ความรู้เกี่ยวกับการวิเคราะห์ข้อมูลและสถิติเบื้องต้น',
      icon: '📊',
      desc: 'การวิเคราะห์ข้อมูล การอ่านกราฟ และสถิติสำหรับงานราชการ',
      count: getSubjectItemCount('data_analysis', 'quiz')
    },
    {
      id: 'aptitude_test',
      title: 'ความถนัดทางเชาว์ปัญญา (Aptitude Test)',
      icon: '🧠',
      desc: 'ความสามารถในการคิดวิเคราะห์ เหตุผล และมิติสัมพันธ์',
      count: getSubjectItemCount('aptitude_test', 'quiz')
    },
    {
      id: 'english',
      title: 'ภาษาอังกฤษ',
      icon: '🌍',
      desc: 'Reading · Vocabulary · Grammar · Conversation สำหรับงานรัฐวิสาหกิจ',
      count: getSubjectItemCount('english', 'quiz')
    },
    {
      id: 'railway_safety',
      title: 'ความปลอดภัยในการเดินรถและการป้องกันอุบัติเหตุ',
      icon: '🚨',
      desc: 'ระเบียบความปลอดภัย การป้องกันอุบัติเหตุ และการบริหารความเสี่ยง',
      count: getSubjectItemCount('railway_safety', 'quiz')
    }
  ],
  games: SHARED_GAMES,
  meta: {
    description: 'คอร์สเตรียมสอบเจ้าหน้าที่การรถไฟแห่งประเทศไทย (ร.ฟ.ท.) ครอบคลุมกฎหมายเฉพาะ การบริหารรัฐวิสาหกิจ และความรู้ทั่วไปตามหลักสูตร พ.ศ. 2567',
    keywords: ['การรถไฟ', 'ร.ฟ.ท.', 'รัฐวิสาหกิจ', 'สอบราชการ', 'คมนาคม', 'ขนส่งทางราง'],
    updated: '27/06/26',
    totalSubjects: 12,
    totalQuestions: 0,
    hideQuestionCounts: true,
    migrated: false,
    migrationNote: 'คอร์สนี้อยู่ระหว่างเตรียมเนื้อหาและคลังข้อสอบ — โครงสร้างวิชาอ้างอิงจากประกาศรับสมัครของ ร.ฟ.ท. ปี 2567 (ไฟล์ประกาศต้นฉบับ: thaijobjob.com)',
    landing: {
      heroBadge: 'คอร์สเตรียมสอบ · การรถไฟแห่งประเทศไทย · ฟรีทั้งหมด',
      heroTitleLead: 'เตรียมสอบ',
      heroTitleLines: ['เจ้าหน้าที่', 'การรถไฟแห่งประเทศไทย'],
      heroTitleAccent: 'SlothMove',
      heroDescription: 'เนื้อหาสรุปครบทั้ง 2 วิชา วิชาละ 100 คะแนน · ครอบคลุมกฎหมายเฉพาะ การบริหารรัฐวิสาหกิจ และความถนัดทางเชาว์ปัญญา พร้อมคลังข้อสอบและเกมฝึกทบทวน',
      primaryCtaLabel: 'เข้าเรียนเลย',
      primaryCtaHref: '#railway-subject-1',
      secondaryCtaLabel: 'กลับไปดูคอร์สทั้งหมด',
      secondaryCtaHref: '/',
      mascotLabel: 'State Railway of Thailand',
      scrollLabel: 'เลื่อนลง',
      stats: [
        { value: '2', label: 'วิชาหลัก' },
        { value: '12', label: 'หัวข้อที่จะครอบคลุม' },
        { value: '200', label: 'คะแนนเต็ม (ข้อเขียน)' }
      ],
      feature: {
        icon: '🎯',
        chip: 'จำลองสอบสนามจริง',
        title: 'จำลองสอบสนามจริง 200 คะแนน',
        desc: 'ทดลองทำข้อสอบจริงตามโครงสร้างการสอบของ ร.ฟ.ท. ปี 2567 แบ่งเป็น 2 วิชา วิชาละ 100 คะแนน — วิชาที่ 1 เฉพาะตำแหน่ง และวิชาที่ 2 ความรู้ทั่วไป + พ.ร.บ. แรงงานรัฐวิสาหกิจสัมพันธ์',
        meta: ['📝 เวลาสอบ 180 นาที', '🚂 รวม 200 คะแนน', '🎯 วิชาที่ 1 (100 ข้อ) + วิชาที่ 2 (100 ข้อ)'],
        primaryCtaLabel: 'เริ่มทำข้อสอบจำลอง →',
        primaryCtaHref: '#railway-subject-1',
        secondaryCtaLabel: '',
        secondaryCtaHref: ''
      },
      sections: [
        {
          id: 'railway-subject-1',
          chip: 'วิชาที่ 1 · Part 1',
          title: 'ความรู้ความสามารถเฉพาะตำแหน่ง',
          subtitle: 'กฎหมาย กฎระเบียบ และการบริหารจัดการที่เกี่ยวข้องกับการดำเนินงานของ ร.ฟ.ท.',
          partClass: 'part1',
          partLabel: '1',
          categoryLabel: 'เฉพาะตำแหน่ง',
          subjectIds: [
            'railway_act',
            'rail_transport_act',
            'labor_law',
            'state_enterprise_management',
            'public_policy_analysis',
            'data_analysis',
            'railway_safety',
            'business_ethics'
          ]
        },
        {
          id: 'railway-subject-2',
          chip: 'วิชาที่ 2 · Part 2',
          title: 'ความรู้ทั่วไป และ พ.ร.บ. แรงงานรัฐวิสาหกิจสัมพันธ์',
          subtitle: 'ความรู้ทั่วไปเกี่ยวกับ ร.ฟ.ท. กฎหมายแรงงาน ความถนัดทางเชาว์ปัญญา และภาษาอังกฤษ',
          partClass: 'part2',
          partLabel: '2',
          categoryLabel: 'ทั่วไป',
          subjectIds: [
            'railway_general_knowledge',
            'labor_relations_act',
            'aptitude_test',
            'english'
          ]
        }
      ]
    }
  }
};
