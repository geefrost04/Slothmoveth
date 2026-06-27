import type { CourseConfig } from '@/lib/course-types';
import { getSubjectItemCount } from './data-loader';

/**
 * Status legend (matches `GameMeta.status` in course-types.ts):
 *   - 'full'    → game template is fully built AND has per-subject data wired up
 *   - 'skeleton'→ either the template is incomplete OR data is sample/curated-fallback
 *
 * Industry truth today (Phase B migration):
 *   - Quiz / Flashcard / Match / Cloze → 'full'
 *     Real data migrated for 5 subjects (admin_act, factory_act, info_act,
 *     governance, industrial_strategy). For the other 4 subjects
 *     (economic_analysis, english, computer, general_knowledge) the loader
 *     returns [] — UI shows "ยังไม่มีข้อมูล" placeholder.
 *   - Sorting / Order / Spelling / TrueFalse → 'skeleton'
 *     data-loader returns UNIVERSAL samples — same items show up for
 *     every subject. Honest-but-not-real.
 *   - Authority / Logic → 'skeleton' (empty in Industry loader — Phase B+)
 */
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
  { id: 'logic' as const, label: 'Logic', labelTh: 'ตรรกะ', icon: '🧠', desc: 'โจทย์ตรรกะ', status: 'skeleton' as const }
];

export const industryConfig: CourseConfig = {
  id: 'industry',
  title: 'นักวิเคราะห์นโยบายและแผน',
  tagline: 'สำนักงานปลัดกระทรวงอุตสาหกรรม',
  subtitle: 'พนักงานราชการทั่วไป · สรุปครบ 9 วิชา',
  category: 'กระทรวงอุตสาหกรรม',
  type: 'พนักงานราชการทั่วไป',
  sourceFolder: 'Industry',
  theme: {
    primary: '#5c3d1e',
    primaryDark: '#3d2812',
    accent: '#a0522d',
    accentSoft: '#faf0e8',
    surface: '#ffffff',
    logo: '/pic/slothmove_mascot.png',
    mascot: '/pic/course-mascot/industry-hero.png'
  },
  subjects: [
    // ✅ Migrated subjects (real data) — counts come from data-loader
    { id: 'admin_act', title: 'พ.ร.บ. ระเบียบบริหารราชการแผ่นดิน', icon: '📜', desc: 'หลักการบริหารราชการแผ่นดิน', count: getSubjectItemCount('admin_act', 'quiz') },
    { id: 'factory_act', title: 'พ.ร.บ. โรงงาน', icon: '🏭', desc: 'กฎหมายโรงงาน', count: getSubjectItemCount('factory_act', 'quiz') },
    { id: 'industrial_strategy', title: 'ยุทธศาสตร์อุตสาหกรรม', icon: '🎯', desc: 'แผนยุทธศาสตร์กระทรวง', count: getSubjectItemCount('industrial_strategy', 'quiz') },
    { id: 'info_act', title: 'พ.ร.บ. ข้อมูลข่าวสารของราชการ', icon: '📰', desc: 'สิทธิในการเข้าถึงข้อมูลข่าวสาร', count: getSubjectItemCount('info_act', 'quiz') },
    { id: 'governance', title: 'ธรรมาภิบาล', icon: '⚖️', desc: 'บ้านเมืองที่ดี', count: getSubjectItemCount('governance', 'quiz') },

    // ⚠ Subjects registered in config but NOT yet in source — counts stay 0
    // The UI shows "ยังไม่มีข้อมูล" when user opens the quiz page for these.
    { id: 'economic_analysis', title: 'การวิเคราะห์เศรษฐกิจ', icon: '📈', desc: 'เศรษฐศาสตร์เบื้องต้น', count: getSubjectItemCount('economic_analysis', 'quiz') },
    { id: 'english', title: 'ภาษาอังกฤษ', icon: '🇬🇧', desc: 'Reading + vocabulary', count: getSubjectItemCount('english', 'quiz') },
    { id: 'computer', title: 'คอมพิวเตอร์', icon: '💻', desc: 'ความรู้พื้นฐาน IT', count: getSubjectItemCount('computer', 'quiz') },
    { id: 'general_knowledge', title: 'ความรู้ทั่วไป', icon: '🌍', desc: 'ความรู้รอบตัว', count: getSubjectItemCount('general_knowledge', 'quiz') }
  ],
  games: SHARED_GAMES,
  meta: {
    description: 'คอร์สเตรียมสอบนักวิเคราะห์นโยบายและแผน สำนักงานปลัดกระทรวงอุตสาหกรรม',
    keywords: ['กระทรวงอุตสาหกรรม', 'สอบราชการ', 'พนักงานราชการ'],
    updated: '18/06/26',
    totalSubjects: 9,
    // Real counts from migrated data (Phase B):
    //   admin_act=100 + factory_act=100 + industrial_strategy=100
    //   + info_act=100 + governance=100 = 500
    // Plus 4 subjects still at 0 (economic_analysis, english, computer, general_knowledge)
    totalQuestions: 500,
    migrated: true,
    migrationNote: 'ย้ายข้อมูลแล้ว 5/9 วิชา (admin_act, factory_act, info_act, governance, industrial_strategy) — วิชา economic_analysis / english / computer / general_knowledge ยังไม่มีข้อมูลใน source เดิม ระบบจะแสดง "ยังไม่มีข้อมูล" ตามจริง'
  }
};
