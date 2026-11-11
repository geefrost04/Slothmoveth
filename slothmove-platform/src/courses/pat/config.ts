/**
 * PAT (การท่าเรือแห่งประเทศไทย) — นักวิชาการ 6 สังกัดกองแผนวิสาหกิจ ฝ่ายกลยุทธ์องค์กร, 2 อัตรา (ประกาศ 25 ก.ย. 2569).
 * Exam: ภาคความรู้ความสามารถทั่วไป 200 (general/thai/english), ภาควิชาการ 200, ภาคปฏิบัติการ 100, สัมภาษณ์ 100.
 * ภาควิชาการ topics are not announced yet: port/ppp/soe/invest follow PAT's 2568 นักวิชาการ 6 (PPP) round and the unit's duties.
 * Content: note lessons (components/study-sheets/patLessonData.ts) + exam sets in Supabase (pat-<topic>-set-NN).
 */

import type { CourseConfig } from '@/lib/course-types';

export const patConfig: CourseConfig = {
  id: 'pat',
  title: 'กทท. นักวิชาการ 6 กองแผนวิสาหกิจ',
  tagline: 'พนักงานการท่าเรือแห่งประเทศไทย ฝ่ายกลยุทธ์องค์กร',
  subtitle: 'เตรียมสอบ 600 คะแนน · ภาคทั่วไป ภาควิชาการ ภาคปฏิบัติการ และสัมภาษณ์',
  category: 'การท่าเรือแห่งประเทศไทย',
  type: 'รัฐวิสาหกิจ',
  theme: {
    primary: '#163e7a',
    primaryDark: '#0e2a55',
    accent: '#3d6fc4',
    accentSoft: '#e8eef8',
    surface: '#ffffff',
    logo: '/pic/logo_pat.png'
  },
  subjects: [
    { id: 'general', title: 'ความสามารถทั่วไป', titleEn: 'General Aptitude', icon: '🧮', desc: '100 คะแนน: คณิตศาสตร์ อนุกรม วิเคราะห์ข้อมูล เงื่อนไขสัญลักษณ์และภาษา แนว ก.พ.', count: 0, games: [] },
    { id: 'thai', title: 'ภาษาไทย', titleEn: 'Thai', icon: '📝', desc: '50 คะแนน: อ่านจับใจความ เรียงประโยค การใช้คำ ประโยคบกพร่อง และการสะกดคำ', count: 0, games: [] },
    { id: 'english', title: 'ภาษาอังกฤษ', titleEn: 'English', icon: '🔤', desc: '50 คะแนน: ไวยากรณ์ คำศัพท์งานท่าเรือและแผนงาน บทสนทนา และการอ่าน', count: 0, games: [] },
    { id: 'port', title: 'ความรู้เกี่ยวกับ กทท.', titleEn: 'About PAT', icon: '⚓', desc: 'พ.ร.บ.การท่าเรือแห่งประเทศไทย 2494 ท่าเรือในความดูแล โครงการสำคัญ และทิศทางองค์กร', count: 0, games: [] },
    { id: 'ppp', title: 'การร่วมลงทุนรัฐและเอกชน (PPP) และ EEC', titleEn: 'PPP & EEC', icon: '🤝', desc: 'พ.ร.บ.ร่วมลงทุนฯ 2562 ขั้นตอนอนุมัติโครงการ พ.ร.บ.เขตพัฒนาพิเศษภาคตะวันออก 2561 และประกาศ กพอ.', count: 0, games: [] },
    { id: 'soe', title: 'รัฐวิสาหกิจและแผนวิสาหกิจ', titleEn: 'SOE & Enterprise Plan', icon: '🧭', desc: 'พ.ร.บ.การพัฒนาการกำกับดูแลและบริหารรัฐวิสาหกิจ 2562 ระบบประเมิน SE-AM และเครื่องมือวางแผนกลยุทธ์', count: 0, games: [] },
    { id: 'invest', title: 'การวิเคราะห์โครงการลงทุน', titleEn: 'Investment Appraisal', icon: '📈', desc: 'การศึกษาความเป็นไปได้ NPV IRR B/C ระยะคืนทุน และการวิเคราะห์ความอ่อนไหว', count: 0, games: [] },
    { id: 'practical', title: 'ภาคปฏิบัติการ', titleEn: 'Practical Test', icon: '✍️', desc: '100 คะแนน: วิธีเขียนตอบ โจทย์ฝึก และแนวคำตอบงานในหน้าที่', count: 0, games: [] },
    { id: 'interview', title: 'เตรียมสอบสัมภาษณ์', titleEn: 'Interview Prep', icon: '🎤', desc: '100 คะแนน: เกณฑ์ที่กรรมการดู คำถามที่ถามบ่อย และตัวอย่างคำตอบ', count: 0, games: [] }
  ],
  games: [],
  meta: {
    description: 'เตรียมสอบการท่าเรือแห่งประเทศไทย (กทท.) ตำแหน่งนักวิชาการ 6 กองแผนวิสาหกิจ ฝ่ายกลยุทธ์องค์กร ครบภาคความรู้ทั่วไป ภาควิชาการ ภาคปฏิบัติการ และสัมภาษณ์ พร้อมโน้ตสรุปและข้อสอบเฉลยละเอียด ฟรี',
    keywords: ['การท่าเรือแห่งประเทศไทย', 'กทท.', 'นักวิชาการ 6', 'แผนวิสาหกิจ', 'สอบรัฐวิสาหกิจ', 'พ.ร.บ.ร่วมลงทุน 2562', 'พ.ร.บ.การท่าเรือ 2494'],
    updated: '11/11/69',
    totalSubjects: 7,
    totalQuestions: 0,
    hideQuestionCounts: true,
    migrated: true,
    landing: {
      heroBadge: 'รัฐวิสาหกิจ · กทท. · ฝึกฟรีทุกชุด',
      heroTitleLead: 'เตรียมสอบ กทท.',
      heroTitleLines: ['นักวิชาการ 6', 'กองแผนวิสาหกิจ'],
      heroTitleAccent: 'SlothMove',
      heroDescription: 'โน้ตสรุปและข้อสอบครบทุกภาค ตามประกาศรับสมัคร 25 ก.ย. 2569',
      primaryCtaLabel: 'เริ่มเรียน',
      primaryCtaHref: '#subjects',
      secondaryCtaLabel: 'ดูสนามสอบทั้งหมด',
      secondaryCtaHref: '/courses',
      mascotLabel: 'PAT',
      scrollLabel: 'เลื่อนลง',
      stats: [],
      sections: []
    }
  }
};
