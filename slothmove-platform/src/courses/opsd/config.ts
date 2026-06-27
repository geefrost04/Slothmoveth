import type { CourseConfig } from '@/lib/course-types';
import { getSubjectItemCount } from './data-loader';

/**
 * Status legend (matches `GameMeta.status` in course-types.ts):
 *   - 'full'    → game template is fully built AND has per-subject data wired up
 *   - 'skeleton'→ either the template is incomplete OR data is sample/curated-fallback
 *
 * OPSD truth today (Phase A migration):
 *   - Quiz / Flashcard / Match / Cloze → 'full'
 *     Real data migrated for 4 subjects (info_act, saraban, english,
 *     general_knowledge). For the other 3 subjects (admin_act,
 *     defense_policy, computer) the loader returns [] — UI shows
 *     "ยังไม่มีข้อมูล" placeholder.
 *   - Sorting / Order / Spelling / TrueFalse → 'skeleton'
 *     data-loader returns UNIVERSAL samples — same items show up for
 *     every subject. Honest-but-not-real.
 *   - Authority / Logic → 'skeleton' (empty in OPSD loader — Phase B+)
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

export const opsdConfig: CourseConfig = {
  id: 'opsd',
  title: 'นักวิเคราะห์นโยบายและแผน',
  tagline: 'สำนักงานปลัดกระทรวงกลาโหม',
  subtitle: 'ข้าราชการสามัญกลาโหม · สรุปครบ 7 วิชา',
  category: 'กระทรวงกลาโหม',
  type: 'ข้าราชการสามัญกลาโหม',
  sourceFolder: 'OPSD',
  theme: {
    primary: '#1a1a2e',
    primaryDark: '#0f0f1e',
    accent: '#4a90d9',
    accentSoft: '#e8f1fa',
    surface: '#ffffff',
    logo: '/pic/slothmove_mascot.png',
    mascot: '/pic/course-mascot/opsd-hero.png'
  },
  subjects: [
    // ✅ Migrated subjects (real data) — counts come from data-loader
    { id: 'info_act', title: 'พ.ร.บ. ข้อมูลข่าวสารของราชการ', icon: '📰', desc: 'สิทธิในการเข้าถึงข้อมูลข่าวสาร', count: getSubjectItemCount('info_act', 'quiz') },
    { id: 'saraban', title: 'ระเบียบงานสารบรรณ', icon: '📂', desc: 'การรับ-ส่งหนังสือราชการ', count: getSubjectItemCount('saraban', 'quiz') },
    { id: 'english', title: 'ภาษาอังกฤษ', icon: '🇬🇧', desc: 'Reading comprehension + vocabulary', count: getSubjectItemCount('english', 'quiz') },
    { id: 'general_knowledge', title: 'ความรู้ทั่วไป', icon: '🌍', desc: 'ความรู้รอบตัวและเหตุการณ์ปัจจุบัน', count: getSubjectItemCount('general_knowledge', 'quiz') },

    // ⚠ Subjects registered in config but NOT yet in source — counts stay 0
    // The UI shows "ยังไม่มีข้อมูล" when user opens the quiz page for these.
    { id: 'admin_act', title: 'พ.ร.บ. ระเบียบบริหารราชการแผ่นดิน', icon: '📜', desc: 'หลักการบริหารราชการแผ่นดิน', count: getSubjectItemCount('admin_act', 'quiz') },
    { id: 'defense_policy', title: 'นโยบายกลาโหม', icon: '🛡️', desc: 'นโยบายและยุทธศาสตร์กลาโหม', count: getSubjectItemCount('defense_policy', 'quiz') },
    { id: 'computer', title: 'คอมพิวเตอร์', icon: '💻', desc: 'ความรู้พื้นฐาน IT', count: getSubjectItemCount('computer', 'quiz') }
  ],
  games: SHARED_GAMES,
  meta: {
    description: 'คอร์สเตรียมสอบนักวิเคราะห์นโยบายและแผน สำนักงานปลัดกระทรวงกลาโหม',
    keywords: ['OPSD', 'กลาโหม', 'สอบราชการ', 'นักวิเคราะห์นโยบาย'],
    updated: '18/06/26',
    totalSubjects: 7,
    // Real counts from migrated data (Phase A):
    //   info_act=100 + saraban=150 + english=315 + general_knowledge=256 = 821
    // Plus 3 subjects still at 0 (admin_act, defense_policy, computer)
    totalQuestions: 821,
    migrated: true,
    migrationNote: 'ย้ายข้อมูลแล้ว 4/7 วิชา (info_act, saraban, english, general_knowledge) — วิชา admin_act / defense_policy / computer ยังไม่มีข้อมูลใน source เดิม ระบบจะแสดง "ยังไม่มีข้อมูล" ตามจริง'
  }
};
