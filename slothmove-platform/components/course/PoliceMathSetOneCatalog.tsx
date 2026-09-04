import Link from 'next/link';
import type { CatalogExamSet } from '@/lib/exam-data';

const SET_ONE_TOPICS: Record<string, string[]> = {
  'police-math-category-foundations': [
    'การคำนวณ & PEMDAS',
    'ห.ร.ม. / ค.ร.น.',
    'เลขฐาน (2, 8, 10)',
    'เลขยกกำลัง & พหุนาม'
  ],
  'police-math-category-algebra': [
    'โจทย์อายุ / ขาสัตว์',
    'ท่อน้ำ / แรงงาน',
    'ความเร็ว (s = vt)',
    'อสมการ & ช่วงคำตอบ'
  ],
  'police-math-category-ratios-percent': [
    'อัตราส่วนต่อเนื่อง',
    'ของผสม & สารละลาย',
    'ร้อยละ / เปอร์เซ็นต์',
    'กำไร-ขาดทุน & ส่วนลด'
  ],
  'police-math-category-geometry': [
    'พีทาโกรัส & สามเหลี่ยมคล้าย',
    'เส้นขนาน & มุม',
    'พื้นที่ & ส่วนแรเงา (2D)',
    'ปริมาตรทรงตัน (3D)'
  ],
  'police-math-category-stats-prob': [
    'เซต & แผนภาพเวนน์',
    'กฎการนับ & ความน่าจะเป็น',
    'การจัดหมู่ & สับเปลี่ยน',
    'สถิติ (ค่าเฉลี่ย/มัธยฐาน)'
  ],
  'police-math-category-aptitude-logic': [
    'อนุกรมตัวเลข',
    'อุปมาอุปไมย',
    'ตรรกศาสตร์ (ถ้า...แล้ว)',
    'มิติสัมพันธ์ (คลี่ลูกบาศก์)',
    'เงื่อนไขเชาวน์ปัญญา'
  ]
};

export function PoliceMathSetOneCatalog({ examSets }: { examSets: CatalogExamSet[] }) {
  const categorySets = examSets.filter((examSet) => examSet.id.startsWith('police-math-category-'));
  const totalQuestions = categorySets.reduce((total, examSet) => total + examSet.total_questions, 0);

  return (
    <main className="police-math-set-one-page">
      <div className="container">
        <nav className="police-subject-breadcrumb" aria-label="breadcrumb">
          <Link href="/">หน้าแรก</Link>
          <span className="police-subject-breadcrumb-separator">&gt;</span>
          <Link href="/courses/police_admin">นายสิบตำรวจ</Link>
          <span className="police-subject-breadcrumb-separator">&gt;</span>
          <Link href="/courses/police_admin/math">ความรู้ความสามารถทั่วไป</Link>
          <span className="police-subject-breadcrumb-separator">&gt;</span>
          <span className="police-subject-breadcrumb-current">Set 1</span>
        </nav>

        <section className="police-math-set-one-hero">
          <p>FREE PRACTICE SET</p>
          <h1>Set 1: ข้อสอบแยกหมวด</h1>
          <span>{categorySets.length} หมวด · {totalQuestions} ข้อ · ฟรีทั้งหมดพร้อมเฉลย</span>
        </section>

        <section aria-labelledby="set-one-grid-title">
          <div className="police-math-set-one-heading">
            <div>
              <h2 id="set-one-grid-title">เลือกหมวดที่อยากฝึก</h2>
              <p>เลือกทำหมวดไหนก่อนก็ได้ ไม่จำเป็นต้องเรียงลำดับ</p>
            </div>
            <Link href="/courses/police_admin/math" className="police-math-set-one-back">กลับหน้าวิชา</Link>
          </div>

          <div className="police-math-set-one-grid">
            {categorySets.map((examSet) => (
              <Link
                key={examSet.id}
                href={`/courses/police_admin/math/exams/${examSet.id}`}
                className="police-math-set-one-card"
              >
                <span className="police-math-set-one-card-top">
                  <span>SET 1</span>
                  <b>ฟรี</b>
                </span>
                <strong>{examSet.title}</strong>
                <p>{examSet.description}</p>
                {SET_ONE_TOPICS[examSet.id] && (
                  <div className="police-math-set-one-topics" aria-label="หัวข้อในชุดนี้">
                    {SET_ONE_TOPICS[examSet.id].map((topic) => (
                      <span key={topic} className="police-math-set-one-topic-chip">
                        {topic}
                      </span>
                    ))}
                  </div>
                )}
                <span className="police-math-set-one-card-meta">
                  {examSet.total_questions} ข้อ · {examSet.duration_minutes ?? Math.ceil(examSet.total_questions * 1.5)} นาที
                </span>
                <span className="police-math-set-one-card-action">เริ่มฝึก <b aria-hidden="true">›</b></span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
