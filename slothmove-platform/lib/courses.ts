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
    id: 'police_admin',
    category: 'สำนักงานตำรวจแห่งชาติ',
    updatedAt: '2026-06-26',
    priority: 100,
    title: 'ตำรวจสายอำนวยการและสนับสนุน',
    subtitle: 'สำนักงานตำรวจแห่งชาติ',
    type: 'ข้าราชการตำรวจชั้นประทวน',
    desc: 'สรุปแบบ Visual แยกรายวิชา · ชุดข้อสอบใหม่กำลังจัดทำ',
    image: '/pic/logo_police.png',
    fullLink: platformCourseUrl('police_admin'),
    tags: ['คอมพิวเตอร์', 'งานสารบรรณ', 'ภาษาอังกฤษ', 'กฎหมายประชาชน'],
    moreTags: '+2 วิชา',
    subjects: 6,
    questions: 0,
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
    questions: 635,
    status: 'coming-soon'
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
