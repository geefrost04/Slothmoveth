import type { CourseConfig } from '@/lib/course-types';
import { getSubjectItemCount } from './data-loader';

const SHARED_GAMES = [
  { id: 'quiz' as const, label: 'Quiz', labelTh: 'ควิซ', icon: '✅', desc: 'คำถาม 4 ตัวเลือก', status: 'full' as const },
  { id: 'flashcard' as const, label: 'Flashcard', labelTh: 'แฟลชการ์ด', icon: '🃏', desc: 'พลิกการ์ดทบทวน', status: 'full' as const },
  { id: 'match' as const, label: 'Match', labelTh: 'จับคู่', icon: '🔗', desc: 'จับคู่คำศัพท์', status: 'full' as const },
  { id: 'cloze' as const, label: 'Cloze', labelTh: 'เติมคำ', icon: '📝', desc: 'เติมคำในช่องว่าง', status: 'full' as const },
  { id: 'sorting' as const, label: 'Sorting', labelTh: 'เรียงลำดับ', icon: '🔢', desc: 'เรียงลำดับความสำคัญ', status: 'skeleton' as const },
  { id: 'order' as const, label: 'Order', labelTh: 'เรียงขั้นตอน', icon: '📋', desc: 'เรียงลำดับขั้นตอน', status: 'skeleton' as const },
  { id: 'spelling' as const, label: 'Spelling', labelTh: 'สะกดคำ', icon: '✍️', desc: 'ฝึกสะกดคำศัพท์', status: 'skeleton' as const },
  { id: 'truefalse' as const, label: 'True/False', labelTh: 'ถูกหรือผิด', icon: '⚖️', desc: 'ตัดสินถูกผิด', status: 'skeleton' as const },
  { id: 'authority' as const, label: 'Authority', labelTh: 'หน่วยงาน', icon: '🏛️', desc: 'จับคู่หน่วยงานกับภารกิจ', status: 'skeleton' as const },
  { id: 'logic' as const, label: 'Logic', labelTh: 'เงื่อนไขสัญลักษณ์', icon: '⚡', desc: 'ตอบ จริง / เท็จ / ไม่แน่ชัด ของข้อสรุปเงื่อนไขสัญลักษณ์', status: 'full' as const },
  { id: 'analogy' as const, label: 'Analogy', labelTh: 'อุปมาอุปไมย', icon: '🤝', desc: 'จับคู่ความสัมพันธ์ของคู่คำศัพท์', status: 'full' as const },
  { id: 'logic-grid' as const, label: 'Logic Grid', labelTh: 'ตารางตรรกะ', icon: '🧩', desc: 'ใช้ตารางกริดและเครื่องหมาย ✓/✗ แก้เงื่อนไขภาษา', status: 'full' as const },
  { id: 'symbol-chain' as const, label: 'Symbol Chain', labelTh: 'โซ่สัญลักษณ์', icon: '🔗', desc: 'ต่อสายความสัมพันธ์ของตัวแปรเพื่อหาข้อสรุปสัญลักษณ์', status: 'full' as const },
  // Rank A games
  { id: 'series' as const, label: 'Series', labelTh: 'อนุกรม', icon: '🔢', desc: 'เติมตัวเลข/ตัวอักษรในลำดับ — หา pattern บวก/ลบ/คูณ', status: 'full' as const },
  { id: 'reading-detective' as const, label: 'Reading Detective', labelTh: 'นักสืบบทความ', icon: '🔍', desc: 'อ่านบทความแล้วหาใจความสำคัญและตีความ', status: 'full' as const },
  { id: 'dialogue' as const, label: 'Dialogue', labelTh: 'สนทนา', icon: '💬', desc: 'เติมคำในบทสนทนาภาษาอังกฤษ', status: 'full' as const }
];

export const ocscConfig: CourseConfig = {
  id: 'ocsc',
  title: 'สอบ ก.พ. ภาค ก.',
  tagline: 'สำนักงานคณะกรรมการข้าราชการพลเรือน',
  subtitle: 'ภาค ก อย่างเดียว · ครบ 3 วิชาหลัก · เน้นฝึกทำข้อสอบและอ่านเนื้อหาให้จบในหน้าเดียว',
  category: 'ก.พ. (ภาค ก.)',
  type: 'สอบภาค ก. (ก.พ.)',
  sourceFolder: 'OCSC',
  theme: {
    primary: '#7a5a00',
    primaryDark: '#553e00',
    accent: '#d4a72c',
    accentSoft: '#fff0bf',
    surface: '#fffdf5',
    logo: '/pic/logo_ocsc.png',
    mascot: '/pic/course-mascot/ocsc-hero.png'
  },
  subjects: [
    {
      id: 'analytical_thinking',
      title: 'ความสามารถในการคิดวิเคราะห์',
      icon: '🧠',
      desc: 'การคิดวิเคราะห์เชิงนามธรรม ปริมาณ และภาษา',
      count: getSubjectItemCount('analytical_thinking', 'quiz'),
      mascot: '/pic/ocsc-mascot/analytical_thinking.png',
      games: ['quiz', 'logic', 'analogy', 'logic-grid', 'symbol-chain', 'series', 'reading-detective']
    },
    {
      id: 'english',
      title: 'ภาษาอังกฤษ',
      icon: '🇬🇧',
      desc: 'Reading · Vocabulary · Grammar · Conversation ระดับ A2-B1 สำหรับงานราชการและชีวิตประจำวัน',
      count: getSubjectItemCount('english', 'quiz'),
      mascot: '/pic/ocsc-mascot/english.png',
      games: ['quiz', 'cloze', 'dialogue']
    },
    {
      id: 'civil_servant_rules',
      title: 'ความรู้และลักษณะการเป็นข้าราชการที่ดี',
      icon: '📜',
      desc: 'ระเบียบบริหารแผ่นดิน วิธีปฏิบัติราชการปกครอง และจริยธรรมข้าราชการ',
      count: getSubjectItemCount('civil_servant_rules', 'quiz'),
      mascot: '/pic/ocsc-mascot/civil_servant_rules.png',
      games: ['quiz', 'flashcard', 'match', 'cloze']
    }
  ],
  games: SHARED_GAMES,
  meta: {
    description: 'คอร์สเตรียมสอบ ก.พ. 69 (ภาค ก.) ครอบคลุมทั้งความสามารถการวิเคราะห์ ภาษาอังกฤษ และความรู้ลักษณะข้าราชการที่ดี',
    keywords: ['ก.พ.', 'สอบ ก.พ.', 'ภาค ก.', 'ข้าราชการพลเรือน', 'เตรียมสอบ'],
    updated: '26/06/26',
    totalSubjects: 3,
    totalQuestions: 835,
    hideQuestionCounts: true,
    migrated: true,
    migrationNote: 'ย้ายข้อมูลวิชาการคิดวิเคราะห์แล้ว 331 ข้อ วิชาลักษณะข้าราชการที่ดี 304 ข้อ + สรุปเนื้อหา 9 บท และเพิ่มวิชาภาษาอังกฤษ 200 ข้อจากชุดปรับปรุงใหม่ ครอบคลุม Reading, Vocabulary, Grammar และ Conversation',
    landing: {
      heroBadge: 'คอร์สเตรียมสอบภาค ก. · ฟรีทั้งหมด · โทนเหลืองราชการ',
      heroTitleLead: 'เตรียมสอบ ก.พ.',
      heroTitleLines: ['สอบ ก.พ. ภาค ก.', 'สายข้าราชการพลเรือน'],
      heroTitleAccent: 'SlothMove',
      heroDescription: 'รวม 3 วิชาหลักของภาค ก. ไว้ในโครงสร้างเดียว อ่านง่าย เข้าลานฝึกไว และคุมทิศทางให้ชัดว่าเป็นคอร์สภาค ก. อย่างเดียว',
      primaryCtaLabel: 'เริ่มเรียนเลย',
      primaryCtaHref: '#course-content',
      secondaryCtaLabel: 'ดูคอร์สทั้งหมด',
      secondaryCtaHref: '/courses',
      mascotLabel: 'Office of the Civil Service Commission',
      scrollLabel: 'เลื่อนลง',
      stats: [
        { value: '3', label: 'วิชาหลัก' },
        { value: '835+', label: 'ข้อฝึกพร้อมเฉลย' },
        { value: 'ภาค ก', label: 'อย่างเดียว' }
      ],
      feature: {
        icon: '📝',
        chip: 'จำลองสอบเสมือนจริง',
        title: 'จำลองสอบภาค ก. 100 ข้อ',
        desc: 'สุ่มข้อสอบตามโครงสร้างจริงของภาค ก. ครบ 3 หมวดหลัก พร้อมสรุปคะแนนและเฉลยหลังส่งคำตอบ เหมาะกับการซ้อมก่อนลงสนามจริง',
        meta: ['100 ข้อ', '200 คะแนนเต็ม', 'ผ่านขั้นต่ำ 60% หรือ 120 คะแนน'],
        primaryCtaLabel: 'เริ่มทำข้อสอบจำลอง',
        primaryCtaHref: '/courses/ocsc/mock-test',
        secondaryCtaLabel: '',
        secondaryCtaHref: ''
      },
      sections: [
        {
          id: 'ocsc-core',
          chip: 'ภาค ก · 3 วิชาหลัก',
          title: 'วิชาที่ต้องอ่านให้ครบก่อนสอบ',
          subtitle: 'คิดวิเคราะห์ · ภาษาอังกฤษ · ความรู้และลักษณะการเป็นข้าราชการที่ดี',
          partClass: 'part1',
          partLabel: 'ก',
          categoryLabel: 'ภาค ก',
          subjectIds: ['analytical_thinking', 'english', 'civil_servant_rules']
        }
      ]
    }
  }
};
