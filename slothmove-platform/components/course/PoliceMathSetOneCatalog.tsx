import Link from 'next/link';
import type { CatalogExamSet } from '@/lib/exam-data';

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
