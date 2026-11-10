// Courses shown on the Dashboard, and which course an attempt's subject id belongs to.
// Attempt subject ids are normalised in app/dashboard/page.tsx (nesdc_*, onwr_*, ONWR topic ids, else police).
export type DashCourseId = 'police_admin' | 'onwr' | 'nesdc';

export type DashCourse = {
  id: DashCourseId;
  name: string;
  short: string;
  agency: string;
  href: string;
  accent: string;
  soft: string;
  icon: string; // emoji, or an image path starting with "/"
};

export const DASH_COURSES: DashCourse[] = [
  { id: 'police_admin', name: 'นายสิบตำรวจ สายอำนวยการ', short: 'นายสิบตำรวจ', agency: 'สำนักงานตำรวจแห่งชาติ', href: '/courses/police_admin', accent: '#7a1822', soft: '#fdebed', icon: '/pic/logo_police.png' },
  { id: 'onwr', name: 'สทนช. นักวิเคราะห์นโยบายและแผน', short: 'สทนช.', agency: 'สำนักงานทรัพยากรน้ำแห่งชาติ', href: '/courses/onwr', accent: '#0b5f86', soft: '#e3f3fa', icon: '/pic/logo_onwr.png' },
  { id: 'nesdc', name: 'สศช. งานวิเคราะห์นโยบายและแผน', short: 'สศช.', agency: 'สำนักงานสภาพัฒนาการเศรษฐกิจและสังคมแห่งชาติ', href: '/courses/nesdc', accent: '#5b3fa6', soft: '#f1ecfb', icon: '/pic/logo_nesdc.png' }
];

const ONWR_TOPIC_IDS = new Set(['org', 'admin', 'rules', 'policy', 'masterplan', 'monitoring', 'project', 'meeting', 'wateract']);

export function courseOfSubject(subjectId: string): DashCourseId {
  if (subjectId.startsWith('nesdc_')) return 'nesdc';
  if (subjectId.startsWith('onwr_') || ONWR_TOPIC_IDS.has(subjectId)) return 'onwr';
  return 'police_admin';
}

export function dashCourse(id: DashCourseId) {
  return DASH_COURSES.find((course) => course.id === id) ?? DASH_COURSES[0];
}
