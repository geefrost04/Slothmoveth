// Police admin exam structure and score levels used by the score planner (/courses/police_admin/score-plan).
// Structure matches the Mock Test (150 questions, 180 minutes). Past-round cutoffs come from
// lib/police-exam-benchmark.ts and are estimates collected for the site, not an official announcement.
export type PlanSubject = {
  id: 'math' | 'thai' | 'computer' | 'saraban' | 'law' | 'english';
  title: string;
  part: 'a' | 'b';
  max: number;
  category: string; // category name used in Mock Test results
  drillHref: string;
};

export const PLAN_SUBJECTS: PlanSubject[] = [
  { id: 'math', title: 'ความสามารถทั่วไป', part: 'a', max: 20, category: 'ความรู้ทั่วไป', drillHref: '/courses/police_admin/mini-mock/police-mini_mock-set-03' },
  { id: 'thai', title: 'ภาษาไทย', part: 'a', max: 20, category: 'ภาษาไทย', drillHref: '/courses/police_admin/mini-mock/police-mini_mock-set-04' },
  { id: 'computer', title: 'คอมพิวเตอร์', part: 'b', max: 40, category: 'คอมพิวเตอร์', drillHref: '/courses/police_admin/mini-mock/police-mini_mock-set-05' },
  { id: 'saraban', title: 'งานสารบรรณ', part: 'b', max: 30, category: 'งานสารบรรณ', drillHref: '/courses/police_admin/mini-mock/police-mini_mock-set-06' },
  { id: 'law', title: 'กฎหมายน่ารู้', part: 'b', max: 25, category: 'กฎหมาย', drillHref: '/courses/police_admin/mini-mock/police-mini_mock-set-07' },
  { id: 'english', title: 'ภาษาอังกฤษ', part: 'b', max: 15, category: 'ภาษาอังกฤษ', drillHref: '/courses/police_admin/mini-mock/police-mini_mock-set-08' }
];

export const EXAM_TOTAL = 150;
export const PART_A_MAX = 40;
export const PART_B_MAX = 110;
export const PART_A_PASS = 24; // 60%
export const PART_B_PASS = 66; // 60%

export type ScoreLevel = { score: number; label: string; short: string; note: string; tone: 'pass' | 'reserve' | 'rank' | 'safe' };

export const SCORE_LEVELS: ScoreLevel[] = [
  { score: 90, label: 'ผ่านเกณฑ์ขั้นต่ำ 60%', short: 'ผ่านเกณฑ์', note: 'ผ่านเกณฑ์ แต่ยังไม่พอติด', tone: 'pass' },
  { score: 107, label: 'คะแนนต่ำสุดที่ติด ปี 62', short: 'ติด ปี 62', note: 'สถิติรอบก่อน (ประมาณ)', tone: 'reserve' },
  { score: 117, label: 'คะแนนต่ำสุดที่ติด ปี 65', short: 'ติด ปี 65', note: 'สถิติรอบล่าสุด (ประมาณ)', tone: 'rank' },
  { score: 125, label: 'โซนปลอดภัย', short: 'ปลอดภัย', note: 'เผื่อปีนี้คะแนนตัดสูงขึ้น', tone: 'safe' }
];

// Split a target total across subjects in proportion to their weight, keeping both parts at 60% or more.
export function autoSplit(target: number): Record<PlanSubject['id'], number> {
  const clamp = Math.max(0, Math.min(EXAM_TOTAL, Math.round(target)));
  const raw = PLAN_SUBJECTS.map((subject) => ({ subject, exact: (clamp * subject.max) / EXAM_TOTAL }));
  const plan = Object.fromEntries(raw.map(({ subject, exact }) => [subject.id, Math.floor(exact)])) as Record<PlanSubject['id'], number>;
  let left = clamp - Object.values(plan).reduce((sum, value) => sum + value, 0);
  // Hand out the rounding remainder to the largest fractions first.
  for (const { subject } of [...raw].sort((a, b) => (b.exact % 1) - (a.exact % 1))) {
    if (left <= 0) break;
    if (plan[subject.id] < subject.max) { plan[subject.id] += 1; left -= 1; }
  }
  return plan;
}
