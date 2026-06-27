import type { CourseConfig } from '@/lib/course-types';
import { getSubjectItemCount } from './data-loader';

/**
 * Status legend (matches `GameMeta.status` in course-types.ts):
 *   - 'full'    → game template is fully built AND has per-subject data wired up
 *   - 'skeleton'→ either the template is incomplete OR data is still sample-based
 *
 * PAB truth today (Phase C — after curated Authority/Logic additions):
 *   - Quiz / Flashcard / Match / Cloze → 'full'
 *     Real data migrated for 18 subjects. The remaining 2 (road_safety_regulation,
 *     national_plan) return [] — UI shows "ยังไม่มีข้อมูล" placeholder.
 *   - Authority → 'full' (Phase C)
 *     Curated pairs cover 12 subjects (admin_act, ministry_act, civil_service_act,
 *     disaster_act, emergency_fund_regulation, budget_act, national_disaster_plan,
 *     warning_regulation, saraban_regulation, info_act, volunteer_regulation,
 *     disaster_department). The 8 remaining subjects fall back to [] per
 *     data-loader, showing "ยังไม่มีข้อมูล" honestly.
 *   - Logic → 'full' (Phase C)
 *     Curated for 6 subjects (admin_act, budget_act, info_act, saraban_regulation,
 *     volunteer_regulation, disaster_department). The remaining 14 subjects
 *     return [] — no fallback is used.
 *   - Sorting / Order / Spelling / TrueFalse → 'skeleton'
 *     data-loader returns UNIVERSAL samples — same items show up for
 *     every subject. Honest-but-not-real.
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
  { id: 'authority' as const, label: 'Authority', labelTh: 'หน่วยงาน', icon: '🏛️', desc: 'จับคู่หน่วยงานกับภารกิจ', status: 'full' as const },
  { id: 'logic' as const, label: 'Logic', labelTh: 'ตรรกะ', icon: '🧠', desc: 'โจทย์ตรรกะ', status: 'full' as const }
];

export const pabConfig: CourseConfig = {
  id: 'pab',
  title: 'นักวิเคราะห์นโยบายและแผน',
  tagline: 'กรมป้องกันและบรรเทาสาธารณภัย (ปภ.)',
  subtitle: 'เรียนฟรี เตรียมสอบราชการสาย ปภ. · สรุปกฎหมายที่เกี่ยวข้อง · คลังข้อสอบพร้อมเฉลย',
  category: 'กระทรวงมหาดไทย',
  type: 'ข้าราชการพลเรือนสามัญ',
  sourceFolder: 'PAB',
  theme: {
    primary: '#1a1a2e',
    primaryDark: '#101022',
    accent: '#d4c800',
    accentSoft: '#fff9bd',
    surface: '#ffffff',
    logo: '/pic/logo-pab.png',
    mascot: '/pic/course-mascot/pab-hero.png'
  },
  subjects: [
    { id: 'admin_act', title: 'พ.ร.บ. ระเบียบบริหารราชการแผ่นดิน พ.ศ. 2534', icon: '🏛️', mascot: '/pic/pab-mascot/01-hero.png', desc: 'โครงสร้างราชการส่วนกลาง ส่วนภูมิภาค และส่วนท้องถิ่น', count: getSubjectItemCount('admin_act', 'quiz') },
    { id: 'info_act', title: 'พ.ร.บ. ข้อมูลข่าวสารของราชการ พ.ศ. 2540', icon: '📋', mascot: '/pic/pab-mascot/02-documents.png', desc: 'สิทธิการรับรู้ข้อมูลข่าวสารของราชการและการเปิดเผยข้อมูล', count: getSubjectItemCount('info_act', 'quiz') },
    { id: 'civil_service_act', title: 'พ.ร.บ. ระเบียบข้าราชการพลเรือน พ.ศ. 2551', icon: '👔', mascot: '/pic/pab-mascot/02-documents.png', desc: 'การบรรจุแต่งตั้ง วินัย การออกจากราชการ และสิทธิประโยชน์', count: getSubjectItemCount('civil_service_act', 'quiz') },
    { id: 'saraban_regulation', title: 'ระเบียบงานสารบรรณ พ.ศ. 2526', icon: '📁', mascot: '/pic/pab-mascot/02-documents.png', desc: 'การจัดทำ รับ ส่ง และเก็บรักษาหนังสือราชการ', count: getSubjectItemCount('saraban_regulation', 'quiz') },
    { id: 'budget_act', title: 'พ.ร.บ. วิธีการงบประมาณ พ.ศ. 2561', icon: '📑', mascot: '/pic/pab-mascot/02-documents.png', desc: 'กระบวนการจัดทำ อนุมัติ โอน และใช้จ่ายเงินงบประมาณ', count: getSubjectItemCount('budget_act', 'quiz') },
    { id: 'emergency_fund_regulation', title: 'ระเบียบกระทรวงการคลังว่าด้วยเงินทดรองราชการฯ พ.ศ. 2568', icon: '🏦', mascot: '/pic/pab-mascot/01-hero.png', desc: 'เงินทดรองราชการเพื่อช่วยเหลือผู้ประสบภัยพิบัติกรณีฉุกเฉิน', count: getSubjectItemCount('emergency_fund_regulation', 'quiz') },
    { id: 'disaster_act', title: 'พ.ร.บ. ป้องกันและบรรเทาสาธารณภัย พ.ศ. 2550', icon: '🔥', mascot: '/pic/pab-mascot/01-hero.png', desc: 'บทบาทอำนาจหน้าที่ ปภ. ระบบบัญชาการ และการจัดการภาวะฉุกเฉิน', count: getSubjectItemCount('disaster_act', 'quiz') },
    { id: 'national_disaster_plan', title: 'แผนป้องกันและบรรเทาสาธารณภัยแห่งชาติ พ.ศ. 2564 - 2570', icon: '🛡️', mascot: '/pic/pab-mascot/04-map.png', desc: 'แนวทางการป้องกันและบรรเทาสาธารณภัยของประเทศไทยในระยะ 7 ปี', count: getSubjectItemCount('national_disaster_plan', 'quiz') },
    { id: 'national_accident_regulation', title: 'ระเบียบสำนักนายกรัฐมนตรีว่าด้วยการป้องกันอุบัติภัยแห่งชาติ พ.ศ. 2564', icon: '⚠️', mascot: '/pic/pab-mascot/01-hero.png', desc: 'การบัญชาเหตุการณ์ การประสานงาน และแผนฉุกเฉิน', count: getSubjectItemCount('national_accident_regulation', 'quiz') },
    { id: 'warning_regulation', title: 'ระเบียบสำนักนายกรัฐมนตรีว่าด้วยการบริหารระบบการเตือนภัยพิบัติแห่งชาติ พ.ศ. 2552', icon: '🚨', mascot: '/pic/pab-mascot/03-megaphone.png', desc: 'กระบวนการแจ้งเตือนและการสื่อสารด้านภัยพิบัติ', count: getSubjectItemCount('warning_regulation', 'quiz') },
    { id: 'volunteer_regulation', title: 'ระเบียบกระทรวงมหาดไทยว่าด้วยกิจการ อปพร. พ.ศ. 2553', icon: '🤝', mascot: '/pic/pab-mascot/03-megaphone.png', desc: 'โครงสร้าง อำนาจหน้าที่ และการฝึกอบรมอาสาสมัครป้องกันภัยฝ่ายพลเรือน', count: getSubjectItemCount('volunteer_regulation', 'quiz') },
    { id: 'ministry_act', title: 'พ.ร.บ. ปรับปรุงกระทรวง ทบวง กรม พ.ศ. 2545', icon: '🏢', mascot: '/pic/pab-mascot/04-map.png', desc: 'การจัดโครงสร้างกระทรวงมหาดไทยและกรมป้องกันและบรรเทาสาธารณภัย', count: getSubjectItemCount('ministry_act', 'quiz') },
    { id: 'disaster_department', title: 'ความรู้เกี่ยวกับกรมป้องกันและบรรเทาสาธารณภัย', icon: '🏢', mascot: '/pic/pab-mascot/03-megaphone.png', desc: 'ภารกิจ อำนาจหน้าที่ โครงสร้างองค์กร และการปฏิบัติงานของ ปภ.', count: getSubjectItemCount('disaster_department', 'quiz') },
    { id: 'disaster_situation', title: 'สถานการณ์สาธารณภัย การบริหารจัดการสาธารณภัยของประเทศไทยและของโลก', icon: '🌊', mascot: '/pic/pab-mascot/04-map.png', desc: 'ประเภทภัย แนวโน้ม และสถิติสำคัญของประเทศไทยและของโลก', count: getSubjectItemCount('disaster_situation', 'quiz') },
    { id: 'national_plan', title: 'แผนพัฒนาเศรษฐกิจและสังคมแห่งชาติ นโยบายรัฐบาล และยุทธศาสตร์ชาติ', icon: '📊', mascot: '/pic/pab-mascot/05-reading.png', desc: 'แผนพัฒนาฯ ฉบับที่ 13 ยุทธศาสตร์ชาติ 20 ปี หลัก BCG + SEP + SDGs', count: getSubjectItemCount('national_plan', 'quiz') },
    { id: 'policy_analysis', title: 'ความรู้เกี่ยวกับการวิเคราะห์นโยบายสาธารณะ', icon: '🎯', mascot: '/pic/pab-mascot/05-reading.png', desc: 'การวิเคราะห์นโยบาย วางแผนโครงการ ติดตามและประเมินผล สำหรับเตรียมสอบภาค ข.', count: getSubjectItemCount('policy_analysis', 'quiz') },
    { id: 'budget_knowledge', title: 'ความรู้เกี่ยวกับการงบประมาณ', icon: '💰', mascot: '/pic/pab-mascot/05-reading.png', desc: 'การบริหารงบประมาณของรัฐ กระบวนการจัดทำงบประมาณ และระบบ GFMIS', count: getSubjectItemCount('budget_knowledge', 'quiz') },
    { id: 'political_economy', title: 'ความรู้เกี่ยวกับการเมือง เศรษฐกิจและสังคม', icon: '🏛️', mascot: '/pic/pab-mascot/04-map.png', desc: 'ความรู้พื้นฐานด้านการเมือง เศรษฐกิจ และสังคมสำหรับการปฏิบัติงานราชการ', count: getSubjectItemCount('political_economy', 'quiz') },
    { id: 'english', title: 'ภาษาอังกฤษ', icon: '🌍', mascot: '/pic/pab-mascot/05-reading.png', desc: 'Conversation สำนวน Grammar Reading และ Vocabulary สำหรับสอบราชการ', count: getSubjectItemCount('english', 'quiz') },
    { id: 'road_safety_regulation', title: 'ระเบียบสำนักนายกรัฐมนตรีว่าด้วยการป้องกันและลดอุบัติเหตุทางถนน พ.ศ. 2554', icon: '🛣️', mascot: '/pic/pab-mascot/03-megaphone.png', desc: 'มาตรการลดอุบัติเหตุทางถนน และการบูรณาการระหว่างหน่วยงาน', count: getSubjectItemCount('road_safety_regulation', 'quiz') }
  ],
  games: SHARED_GAMES,
  meta: {
    description: 'คอร์สเตรียมสอบนักวิเคราะห์นโยบายและแผน กรมป้องกันและบรรเทาสาธารณภัย (ปภ.) — สรุปครบ 20 วิชา',
    keywords: ['นักวิเคราะห์นโยบาย', 'ปภ.', 'สอบราชการ', 'สาธารณภัย'],
    updated: '17/06/26',
    totalSubjects: 20,
    totalQuestions: 425,
    migrated: true,
    landing: {
      heroBadge: 'คอร์สเตรียมสอบ · กรมป้องกันและบรรเทาสาธารณภัย · ฟรีทั้งหมด',
      heroTitleLead: 'เรียนฟรี เตรียมสอบราชการสาย ปภ.',
      heroTitleLines: ['กรมป้องกันและ', 'บรรเทาสาธารณภัย'],
      heroTitleAccent: 'SlothMove',
      heroDescription: 'เนื้อหาสรุปครบ กฎหมายที่เกี่ยวข้อง และคลังข้อสอบพร้อมเฉลยในที่เดียว สำหรับคนที่กำลังเตรียมสอบสายนักวิเคราะห์นโยบายและแผน',
      primaryCtaLabel: 'เข้าเรียนเลย',
      primaryCtaHref: '#pab-content',
      secondaryCtaLabel: 'กลับไปดูคอร์สทั้งหมด',
      secondaryCtaHref: '/',
      mascotLabel: 'Department of Disaster Prevention and Mitigation',
      scrollLabel: 'เลื่อนลง',
      stats: [
        { value: '20', label: 'วิชาทั้งหมด' },
        { value: '425+', label: 'ข้อสอบพร้อมเฉลย' },
        { value: '4', label: 'เกมหลักที่เล่นได้ทันที' }
      ],
      feature: {
        icon: '🎯',
        chip: 'Simulation · จำลองสอบ',
        title: 'จำลองข้อสอบจริง ภาค ข. กรมป้องกันและบรรเทาสาธารณภัย',
        desc: 'เวอร์ชันเดิมมีโหมดข้อสอบจำลองแยกเฉพาะ ตอนนี้ในแพลตฟอร์ม Next.js ยังย้ายมาไม่ครบ แต่คลังควิซ แฟลชการ์ด จับคู่ และเติมคำของแต่ละวิชาเปิดให้ฝึกได้แล้ว',
        meta: ['⏱️ ฝึกทีละวิชา', '📝 425+ ข้อ', '🎯 เริ่มได้ทันที'],
        primaryCtaLabel: 'เริ่มจากวิชาแรก',
        primaryCtaHref: '/courses/pab/admin_act',
        secondaryCtaLabel: 'ดูหมวดวิชาทั้งหมด',
        secondaryCtaHref: '#section-p1-law'
      },
      sections: [
        {
          id: 'p1-law',
          chip: 'ส่วนที่ 1 · Part 1',
          title: 'ความรู้เกี่ยวกับระเบียบ กฎหมายทั่วไป และกฎหมายที่เกี่ยวข้องกับ ปภ.',
          subtitle: 'กฎหมายและระเบียบที่เกี่ยวข้องกับงานราชการและการบริหารจัดการสาธารณภัย',
          partClass: 'part1',
          partLabel: '1',
          categoryLabel: 'กฎหมาย',
          subjectIds: [
            'admin_act',
            'ministry_act',
            'info_act',
            'civil_service_act',
            'saraban_regulation',
            'warning_regulation',
            'road_safety_regulation',
            'national_accident_regulation',
            'volunteer_regulation',
            'national_disaster_plan'
          ]
        },
        {
          id: 'p1-general',
          chip: 'ส่วนที่ 1 · Part 2',
          title: 'ความรู้ความสามารถทั่วไป',
          subtitle: 'งบประมาณ สถานการณ์สาธารณภัย ความรู้เชิงสถาบัน และภาษาอังกฤษสำหรับสอบราชการ',
          partClass: 'part1',
          partLabel: '1',
          categoryLabel: 'ทั่วไป',
          subjectIds: [
            'budget_knowledge',
            'disaster_situation',
            'political_economy',
            'english',
            'disaster_department'
          ]
        },
        {
          id: 'p2',
          chip: 'ส่วนที่ 2',
          title: 'ความรู้เฉพาะทางและเครื่องมือในการปฏิบัติงาน',
          subtitle: 'แผนพัฒนาฯ การวิเคราะห์นโยบาย งบประมาณเฉพาะทาง และเครื่องมือประกอบการทำงาน',
          partClass: 'part2',
          partLabel: '2',
          categoryLabel: 'วิชาเฉพาะ',
          subjectIds: [
            'policy_analysis',
            'national_plan',
            'budget_act',
            'disaster_act',
            'emergency_fund_regulation'
          ]
        }
      ]
    }
  }
};
