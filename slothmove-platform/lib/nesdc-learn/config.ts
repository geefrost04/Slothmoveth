// Course settings for /courses/nesdc/learn.

/**
 * Written-exam date. Set it (ISO yyyy-mm-dd) once สศช. announces it on 27 พ.ย. 2569;
 * until then the home page shows the estimate below. One-line change.
 */
export const EXAM_DATE: string | null = null;
export const EXAM_DATE_ESTIMATE = 'คาดว่าต้น ธ.ค. 2569';
export const EXAM_DATE_NOTE = 'ประมาณจากรอบที่ผ่านมา สศช. จะประกาศวันสอบจริงพร้อมรายชื่อผู้มีสิทธิสอบภายใน 27 พ.ย. 2569';

export const PASS_RULE = 'ต้องได้คะแนนข้อเขียนไม่ต่ำกว่าร้อยละ 60 จึงมีสิทธิสัมภาษณ์ และต้องผ่านร้อยละ 60 ทั้งสองรอบ จากนั้นจ้างตามลำดับคะแนน';

export const BASE = '/courses/nesdc/learn';

/** Lesson test: questions and the score that unlocks the next lesson. */
export const TEST_SIZE = 10;
export const TEST_PASS = 8;

/** One day of the 21-day path. `items` are lesson ids, `summary:<topic>`, `test:<topic>`, or a special step. */
export type PathDay = { day: number; items: string[]; extra?: string };

export const PATH: PathDay[] = [
  { day: 1, items: ['diagnostic', 'n1'], extra: 'ผลแบบวัดพื้นฐานจะบอกหัวข้อที่ควรเน้น' },
  { day: 2, items: ['n2'] },
  { day: 3, items: ['n3'], extra: 'ทวนข้อที่ผิดจากวันที่ 1' },
  { day: 4, items: ['n4', 'summary:n'] },
  { day: 5, items: ['o1', 'o2'], extra: 'ทวนข้อที่ผิด' },
  { day: 6, items: ['o3', 'summary:o'] },
  { day: 7, items: ['a1'] },
  { day: 8, items: ['a2'], extra: 'ทวนข้อที่ผิด' },
  { day: 9, items: ['a3'] },
  { day: 10, items: ['a4', 'summary:a'], extra: 'ทวนข้อที่ผิด' },
  { day: 11, items: ['s1', 's2'] },
  { day: 12, items: ['s3', 'summary:s'] },
  { day: 13, items: ['c1', 'c2'], extra: 'ทวนข้อที่ผิด' },
  { day: 14, items: ['c3', 'summary:c'] },
  { day: 15, items: ['e1', 'e2'] },
  { day: 16, items: ['e3', 'summary:e'] },
  { day: 17, items: ['g1', 'g2'], extra: 'ทวนข้อที่ผิด' },
  { day: 18, items: ['g3', 'g4', 'summary:g'] },
  { day: 19, items: ['mock-1'], extra: 'สอบเสมือนจริง จับเวลา' },
  { day: 20, items: ['weak-review'], extra: 'ทบทวน 2 หัวข้อที่คะแนนต่ำสุด' },
  { day: 21, items: ['final-review'], extra: 'ทบทวนตัวเลขและคู่ที่ชอบสลับ · เช็กลิสต์วันสอบ' }
];
