// Courses whose notes and exam files live in this repo (content/study-sheets/<course>-<topic>-summary.json,
// content/exams/<course>-<topic>-set-NN.json) and share the police page template in their own colour.
export type LocalCourseMeta = {
  id: string;
  short: string; // e.g. 'สทนช.' (breadcrumbs, chips)
  readerLabel: string; // breadcrumb label in the notes reader
  accent: string;
  accentDark: string;
  accentLight: string;
  soft: string;
  line: string;
  ink: string;
  accentRgb: string; // "r, g, b" of accent, for translucent fills
};

export const LOCAL_COURSES: Record<string, LocalCourseMeta> = {
  onwr: {
    id: 'onwr',
    short: 'สทนช.',
    readerLabel: 'สทนช. นักวิเคราะห์นโยบายฯ',
    accent: '#0b5f86',
    accentDark: '#07425e',
    accentLight: '#2a9bc9',
    soft: '#e3f3fa',
    line: '#cfe5ef',
    ink: '#0f2733',
    accentRgb: '11, 95, 134'
  },
  nesdc: {
    id: 'nesdc',
    short: 'สศช.',
    readerLabel: 'สศช. งานวิเคราะห์นโยบายและแผน',
    accent: '#5b3fa6',
    accentDark: '#3f2a7a',
    accentLight: '#8b6fd6',
    soft: '#f1ecfb',
    line: '#dcd0f3',
    ink: '#221a33',
    accentRgb: '91, 63, 166'
  },
  pat: {
    id: 'pat',
    short: 'กทท.',
    readerLabel: 'กทท. นักวิชาการ 6',
    accent: '#163e7a',
    accentDark: '#0e2a55',
    accentLight: '#3d6fc4',
    soft: '#e8eef8',
    line: '#d2dcec',
    ink: '#15202f',
    accentRgb: '22, 62, 122'
  }
};

export function localCourse(courseId?: string | null): LocalCourseMeta | null {
  return (courseId && LOCAL_COURSES[courseId]) || null;
}
