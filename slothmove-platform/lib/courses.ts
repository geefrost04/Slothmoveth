export interface Course {
  id: string;
  category: string;
  /** ISO date (YYYY-MM-DD). Used for automatic newest-first sorting. */
  updatedAt: string;
  /** Optional manual pin. Higher values appear first; defaults to 0. */
  priority?: number;
  title: string;
  subtitle: string;
  type: string;
  desc: string;
  image: string;
  /** Relative URL to the course landing page on slothmove-platform. */
  fullLink: string;
  tags: string[];
  moreTags?: string;
  subjects?: number;
  questions?: number;
  updatedBy?: string;
  /** Course availability on the platform.
   *  - ready: fully open on platform
   *  - partial: platform is live, but only some subjects are migrated
   *  - coming-soon: not open yet, keep the card disabled
   */
  status?: 'ready' | 'partial' | 'coming-soon';
  hidden?: boolean;
}

/**
 * Build a relative link to a course on the SlothMove platform.
 */
function platformCourseUrl(courseId: string): string {
  return `/courses/${courseId}`;
}

/** Relative URL to the platform home (course index). */
export const PLATFORM_HOME_URL = '/';

export const COURSES: Course[] = [
  {
    id: 'pab',
    category: 'กระทรวงมหาดไทย',
    updatedAt: '2026-06-17',
    priority: 90,
    title: 'นักวิเคราะห์นโยบายและแผน',
    subtitle: 'กรมป้องกันและบรรเทาสาธารณภัย (ปภ.)',
    type: 'ข้าราชการพลเรือนสามัญ',
    desc: 'เนื้อหาสรุปครบ 20 วิชา · กฎหมายที่เกี่ยวข้อง · ความรู้เฉพาะตำแหน่ง · คลังข้อสอบพร้อมเฉลย',
    image: '/pic/logo-ปภ.png',
    fullLink: platformCourseUrl('pab'),
    tags: ['พ.ร.บ. ป้องกันภัย', 'สาธารณภัย', 'งบประมาณ'],
    moreTags: '+17 วิชา',
    subjects: 20,
    questions: 425,
    status: 'coming-soon'
  },
  {
    id: 'industry',
    category: 'กระทรวงอุตสาหกรรม',
    updatedAt: '2026-06-18',
    title: 'นักวิเคราะห์นโยบายและแผน',
    subtitle: 'สำนักงานปลัดกระทรวงอุตสาหกรรม',
    type: 'พนักงานราชการทั่วไป',
    desc: 'ย้ายขึ้นแพลตฟอร์มแล้วบางส่วน · เปิดแล้ว 5 จาก 9 วิชา · คลังข้อสอบพร้อมเฉลยละเอียด',
    image: '/pic/logo_industry.png',
    fullLink: platformCourseUrl('industry'),
    tags: ['วางแผนกลยุทธ์', 'ข้อมูลข่าวสาร', 'บ้านเมืองที่ดี', 'พ.ร.บ. โรงงาน'],
    moreTags: '+5 วิชา',
    subjects: 9,
    questions: 500,
    status: 'coming-soon'
  },
  {
    id: 'opsd',
    category: 'กระทรวงกลาโหม',
    updatedAt: '2026-06-18',
    title: 'นักวิเคราะห์นโยบายและแผน',
    subtitle: 'สำนักงานปลัดกระทรวงกลาโหม',
    type: 'ข้าราชการสามัญกลาโหม',
    desc: 'ย้ายขึ้นแพลตฟอร์มแล้วบางส่วน · เปิดแล้ว 4 จาก 7 วิชา · คลังข้อสอบพร้อมเฉลยละเอียด',
    image: '/pic/logo_OPSDD.png',
    fullLink: platformCourseUrl('opsd'),
    tags: ['สารบรรณ', 'ข้อมูลข่าวสาร', 'ความรู้ทั่วไป', 'ภาษาอังกฤษ'],
    moreTags: '+3 วิชา',
    subjects: 7,
    questions: 821,
    status: 'coming-soon'
  },
  {
    id: 'police_admin',
    category: 'สำนักงานตำรวจแห่งชาติ',
    updatedAt: '2026-06-26',
    priority: 100,
    title: 'ตำรวจสายอำนวยการและสนับสนุน',
    subtitle: 'สำนักงานตำรวจแห่งชาติ',
    type: 'ข้าราชการตำรวจชั้นประทวน',
    desc: 'สรุปครบ 6 วิชา · ภาค ก. และภาค ข. · คลังข้อสอบพร้อมเฉลยและเกมฝึกทำข้อสอบ',
    image: '/pic/logo_police.png',
    fullLink: platformCourseUrl('police_admin'),
    tags: ['คอมพิวเตอร์', 'งานสารบรรณ', 'ภาษาอังกฤษ', 'กฎหมายประชาชน'],
    moreTags: '+2 วิชา',
    subjects: 6,
    questions: 1400,
    status: 'ready'
  },
  {
    id: 'ocsc',
    category: 'ภาค ก. ก.พ.',
    updatedAt: '2026-06-26',
    priority: 95,
    title: 'สอบ ก.พ. ภาค ก.',
    subtitle: 'สำนักงานคณะกรรมการข้าราชการพลเรือน',
    type: 'ข้าราชการพลเรือน · ทุกสายงาน',
    desc: 'สรุปครบ 3 วิชาหลัก · ความสามารถในการคิดวิเคราะห์ ภาษาอังกฤษ และความรู้การเป็นข้าราชการที่ดี',
    image: '/pic/logo_ocsc.png',
    fullLink: platformCourseUrl('ocsc'),
    tags: ['คิดวิเคราะห์', 'ภาษาอังกฤษ', 'ข้าราชการที่ดี'],
    moreTags: '+เกมฝึกวิเคราะห์',
    subjects: 3,
    questions: 835,
    status: 'ready'
  },
  {
    id: 'kpi',
    category: 'ภาค ก. ก.พ.',
    updatedAt: '2026-06-08',
    title: 'ติวสอบ ก.พ. ภาค ก. ระดับ ป.ตรี',
    subtitle: 'ความรู้ความสามารถทั่วไป',
    type: 'ข้าราชการพลเรือน · ทุกสายงาน',
    desc: 'พ.ร.บ. ระเบียบบริหารราชการแผ่นดิน · พ.ร.บ. ข้อมูลข่าวสารฯ · พ.ร.บ. ระเบียบข้าราชการพลเรือน · ระเบียบสำนักนายกฯ ว่าด้วยงานสารบรรณ',
    image: '/pic/logo_kpi.svg',
    fullLink: '#',
    tags: ['พ.ร.บ. บริหารราชการ', 'พ.ร.บ. ข้อมูลข่าวสาร', 'พ.ร.บ. ข้าราชการพลเรือน', 'ระเบียบสารบรรณ'],
    moreTags: '+500 ข้อสอบ',
    status: 'coming-soon',
    hidden: true
  }
];

/**
 * Homepage order:
 * 1. Pinned courses (`priority`, highest first)
 * 2. Most recently updated course
 *
 * Adding a course only requires one object above. Leave `priority` empty
 * for automatic date ordering, or set it when a course must stay on top.
 */
export const VISIBLE_COURSES = COURSES
  .filter((course) => !course.hidden)
  .sort((a, b) => {
    const priorityDifference = (b.priority ?? 0) - (a.priority ?? 0);
    if (priorityDifference !== 0) return priorityDifference;
    return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
  });
