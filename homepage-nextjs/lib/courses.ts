import { PLATFORM_BASE_URL } from '@/lib/site';

export interface Course {
  id: string;
  category: string;
  updated: string;
  title: string;
  subtitle: string;
  type: string;
  desc: string;
  image: string;
  /** Absolute URL to the course landing page on slothmove-platform.
   *  Set via NEXT_PUBLIC_PLATFORM_URL env var (default http://localhost:3040).
   *  Use this rather than a relative path because the homepage and the
   *  platform run on separate origins in dev (3030 vs 3040) and likely
   *  separate domains in prod. */
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
 * Build an absolute link to a course on the SlothMove platform.
 *
 * Reads `NEXT_PUBLIC_PLATFORM_URL` so the same code works in:
 *   - local dev (http://localhost:3040)
 *   - production (https://learn.slothmoveth.com or similar)
 *
 * Trims trailing slashes so `${base}/courses/<id>` is always well-formed.
 */
function platformCourseUrl(courseId: string): string {
  return `${PLATFORM_BASE_URL}/courses/${courseId}`;
}

/** Absolute URL to the platform home (course index). */
export const PLATFORM_HOME_URL = `${PLATFORM_BASE_URL}/`;

export const COURSES: Course[] = [
  {
    id: 'pab',
    category: 'กระทรวงมหาดไทย',
    updated: '17/06/26',
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
    status: 'ready'
  },
  {
    id: 'industry',
    category: 'กระทรวงอุตสาหกรรม',
    updated: '18/06/26',
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
    status: 'partial'
  },
  {
    id: 'opsd',
    category: 'กระทรวงกลาโหม',
    updated: '18/06/26',
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
    status: 'partial'
  },
  {
    id: 'police_admin',
    category: 'สำนักงานตำรวจแห่งชาติ',
    updated: '01/06/26',
    title: 'ตำรวจสายอำนวยการและสนับสนุน',
    subtitle: 'สำนักงานตำรวจแห่งชาติ',
    type: 'ข้าราชการตำรวจชั้นประทวน',
    desc: 'เนื้อหาสรุปครบทั้ง ภาคความรู้ความสามารถทั่วไป และ ภาคความรู้ความสามารถเฉพาะตำแหน่ง',
    image: '/pic/logo_police.svg',
    /** Police admin is intentionally NOT migrated to Next.js yet (per
     *  user decision — phase 2.5). The legacy HTML at
     *  `~/Documents/SlothMove/Page/source/police_admin/index.html` lives
     *  on the ORIGINAL static site, which is NOT co-deployed with this
     *  homepage-nextjs project. So a relative path here would 404.
     *
     *  Setting `fullLink: '#'` + `status: 'coming-soon'` makes the
     *  CourseGrid render this card as a disabled div (no click, no 404).
     *  When migration starts, swap fullLink back to the platform URL. */
    fullLink: '#',
    tags: ['คอมพิวเตอร์', 'งานสารบรรณ', 'ภาษาอังกฤษ', 'กฎหมายประชาชน'],
    moreTags: '+2 วิชา',
    subjects: 6,
    questions: 145,
    status: 'coming-soon'
  },
  {
    id: 'kpi',
    category: 'ภาค ก. ก.พ.',
    updated: '08/06/26',
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

export const VISIBLE_COURSES = COURSES.filter((course) => !course.hidden);
