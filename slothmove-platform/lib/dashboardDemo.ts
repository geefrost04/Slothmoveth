// Sample attempts for previewing the Dashboard locally (/dashboard?demo=1, development only).
// Covers the three open courses so the multi-course layout can be checked without signing in.
type DemoCategory = { category: string; total: number; answered: number; correct: number };

const HOUR = 3600 * 1000;

function attempt(id: number, hoursAgo: number, subject: string, quiz: string, score: number, total: number, categories: DemoCategory[], examSetId: string | null = quiz) {
  return {
    id: `demo-${id}`,
    subject_id: subject,
    quiz_id: quiz,
    score,
    total_questions: total,
    exam_set_id: examSetId,
    answers: [],
    category_results: categories,
    duration_seconds: total * 55,
    completion_reason: 'submitted',
    created_at: new Date(Date.now() - hoursAgo * HOUR).toISOString()
  };
}

const cat = (category: string, total: number, correct: number): DemoCategory => ({ category, total, answered: total, correct });

export const DEMO_ATTEMPTS = [
  attempt(1, 2, 'org', 'nesdc-org-set-01', 14, 21, [cat('ประวัติ', 6, 5), cat('พ.ร.บ. 2561', 9, 5), cat('โครงสร้าง', 6, 4)]),
  attempt(2, 5, 'mini_mock', 'nesdc-mini_mock-set-01', 18, 30, [cat('ความรู้ความสามารถทั่วไป', 5, 3), cat('งานสารบรรณ', 4, 3), cat('ภาษาอังกฤษ', 5, 4), cat('ยุทธศาสตร์ชาติ', 4, 2)]),
  attempt(3, 26, 'english', 'nesdc-english-set-01', 15, 21, [cat('Grammar', 10, 7), cat('Vocabulary', 6, 5), cat('Reading', 5, 3)]),
  attempt(4, 50, 'wateract', 'onwr-wateract-set-01', 12, 24, [cat('ใบอนุญาตใช้น้ำ', 8, 3), cat('องค์กรบริหารจัดการน้ำ', 8, 5), cat('บทกำหนดโทษ', 8, 4)]),
  attempt(5, 74, 'mini_mock', 'onwr-mini_mock-set-01', 19, 30, [cat('สทนช.', 6, 4), cat('แผนแม่บทน้ำ', 6, 3), cat('นโยบายและแผน', 9, 6)]),
  attempt(6, 98, 'saraban', 'police-saraban-set-01', 16, 20, [cat('หนังสือราชการ', 10, 9), cat('การเก็บรักษา', 10, 7)]),
  attempt(7, 122, 'mock_test', 'police-mock_test-set-01', 98, 150, [cat('ความรู้ทั่วไป', 40, 22), cat('ภาษาไทย', 25, 18), cat('คอมพิวเตอร์', 25, 17), cat('งานสารบรรณ', 20, 15), cat('กฎหมาย', 20, 13), cat('ภาษาอังกฤษ', 20, 13)]),
  attempt(8, 170, 'computer', 'police-computer-set-02', 13, 20, [cat('Excel', 10, 6), cat('เครือข่าย', 10, 7)])
];
