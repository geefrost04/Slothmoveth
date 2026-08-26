import Link from 'next/link';
import type { CourseConfig, SubjectMeta } from '@/lib/course-types';
import type { CourseKnowledgeData } from '@/lib/knowledge-types';
import type { CatalogExamSet } from '@/lib/exam-data';
import { CourseKnowledgeContent } from './CourseKnowledgeContent';
import { PoliceExamCatalogClient } from './PoliceExamCatalogClient';
import { CoffeePdfButton } from '@/components/commerce/CoffeePdfButton';

export function CourseSubjectPage({
  course,
  subject,
  knowledge,
  examSets = [],
  ownedProductIds = []
}: {
  course: CourseConfig;
  subject: SubjectMeta;
  knowledge: CourseKnowledgeData | null;
  examSets?: CatalogExamSet[];
  ownedProductIds?: string[];
}) {
  const courseHasData = course.meta.migrated === true;
  const subjectHasData = subject.count > 0;
  const hasRichLanding = Boolean(course.meta.landing);
  const hasKnowledgeContent = Boolean(
    knowledge?.knowledgeSections?.length ||
    knowledge?.vocabularyGroups?.length ||
    knowledge?.tips?.length
  );
  const showSubjectContent = courseHasData && (subjectHasData || hasKnowledgeContent);
  const isDropdown = course.id === 'police_admin' || course.id === 'ocsc';
  const practiceHref = isDropdown
    ? `/courses/${course.id}/${subject.id}/practices`
    : `/courses/${course.id}/${subject.id}/quiz`;
  const hasStudySheet = course.id === 'police_admin' && subject.id === 'computer';
  const studySheetHref = `/courses/${course.id}/${subject.id}/summary`;
  const hasPoliceSubjectExamCatalog = course.id === 'police_admin' && subject.id !== 'math' && examSets.length > 0;

  const isPoliceMath = course.id === 'police_admin' && subject.id === 'math';
  if (isPoliceMath) {
    return (
      <PoliceMathSubjectPage
        course={course}
        subject={subject}
        practiceHref={practiceHref}
        examSets={examSets}
        ownedProductIds={ownedProductIds}
      />
    );
  }

  return (
    <div className="course-subject-page">
      <div className="course-subject-breadcrumb-wrap">
        <nav className="container course-breadcrumb">
          <Link href={`/courses/${course.id}`}>← กลับไปหน้าคอร์ส</Link>
          <span>/</span>
          <span>{subject.title}</span>
        </nav>
      </div>

      <header className="course-subject-header">
        <div className="course-subject-header-deco" aria-hidden="true">
          <span className="course-subject-deco-symbol">π</span>
          <span className="course-subject-deco-symbol">∑</span>
          <span className="course-subject-deco-symbol">√</span>
          <span className="course-subject-deco-symbol">×</span>
        </div>
        <div className="container course-subject-header-inner">
          <div className="course-subject-icon">{subject.icon ?? '📘'}</div>
          <div className="course-subject-heading">
            {hasRichLanding ? <div className="course-subject-chip">บทเรียน {course.id.toUpperCase()}</div> : null}
            <h1>{subject.title}</h1>
            <p>{subject.desc}</p>
          </div>
          <div className="course-subject-mascot" aria-hidden="true">
            <div className="course-subject-mascot-glow" />
            <img src={subject.mascot || '/pic/slothmove_mascot.png'} alt="" />
          </div>
        </div>
      </header>

      <div className="container course-subject-body">
        {hasStudySheet ? (
          <section style={{ marginBottom: 28 }}>
            <h2>ชีทสรุปสำหรับอ่านสอบ</h2>
            <p>
              รวมเนื้อหาวิชาคอมพิวเตอร์จาก NotebookLM เรียงเป็น 5 Part พร้อมภาพประกอบช่วยจำ
              สำหรับอ่านทบทวนก่อนทำข้อสอบ
            </p>
            <div className="course-message-actions">
              <Link href={studySheetHref} className="course-action-primary">
                อ่านชีทสรุปคอมพิวเตอร์
              </Link>
              <Link href={practiceHref} className="course-action-secondary">
                ไปหน้า Practices
              </Link>
            </div>
          </section>
        ) : null}

        {hasPoliceSubjectExamCatalog ? (
          <section style={{ marginBottom: 28 }}>
            <h2>ชุดข้อสอบ{subject.title}</h2>
            <p>
              ชุดข้อสอบสร้างโดย NotebookLM จากไฟล์ต้นฉบับของวิชานี้ แล้วผ่าน Quality Pass ก่อนนำเข้าเว็บ
              เหมาะสำหรับซ้อมจับเวลาและดูเฉลยหลังทำ
            </p>
            <PoliceExamCatalogClient
              courseId={course.id}
              subjectId={subject.id}
              examSets={examSets}
              ownedProductIds={ownedProductIds}
            />
          </section>
        ) : null}

        {showSubjectContent ? (
          <>
            {hasKnowledgeContent && knowledge ? (
              <CourseKnowledgeContent
                knowledge={knowledge}
                quizHref={practiceHref}
              />
            ) : null}
            {!hasKnowledgeContent ? (
              <section style={{ marginTop: hasKnowledgeContent ? 40 : 0 }}>
                <h2>{isDropdown ? `ลานฝึก ${subject.title}` : `ทำข้อสอบ ${subject.title}`}</h2>
                <p>
                  {isDropdown
                    ? 'รวมเกมฝึกของวิชานี้ไว้ในหน้า Practices แยกต่างหาก เพื่อเลือกซ้อมตามรูปแบบเกมได้ง่ายขึ้น'
                    : 'เริ่มฝึกทำข้อสอบของวิชานี้ เพื่อวัดความรู้ความเข้าใจจากแนวข้อสอบจริงพร้อมเฉลยละเอียด'}
                </p>
                <div className="course-message-actions">
                  <Link href={practiceHref} className="course-action-primary">
                    {isDropdown ? 'เปิดหน้า Practices' : 'เริ่มทำข้อสอบ'}
                  </Link>
                </div>
              </section>
            ) : null}

            {!hasKnowledgeContent ? (
              <section style={{ marginTop: 28 }}>
                <h2>วิชานี้ยังไม่มีสรุปบทเรียน</h2>
                <p>
                  {isDropdown
                    ? 'ตอนนี้หน้าวิชานี้ยังไม่มีเนื้อหาสรุปในรูปแบบเดียวกับ PAB แตัยังสามารถเริ่มฝึกผ่านหน้า Practices ได้'
                    : 'ตอนนี้ยังไม่มีเนื้อหาสรุปวิชานี้ในระบบ แต่คุณยังสามารถเริ่มฝึกทำข้อสอบได้ทันที'}
                </p>
              </section>
            ) : null}
          </>
        ) : hasStudySheet || hasPoliceSubjectExamCatalog ? null : (
          <SubjectNotReady course={course} subject={subject} />
        )}
      </div>
    </div>
  );
}

function SubjectNotReady({ course, subject }: { course: CourseConfig; subject: SubjectMeta }) {
  const courseHasData = course.meta.migrated === true;

  return (
    <section className="is-warning">
      <div className="course-message-icon">🚧</div>
      <h2>
        วิชา {subject.title} {courseHasData ? '— ยังไม่มีข้อมูล' : '— ยังไม่พร้อมให้บริการ'}
      </h2>
      <p>
        {courseHasData
          ? `คอร์ส ${course.title} เปิดแล้ว แต่วิชานี้ยังไม่มีข้อมูลในระบบ`
          : `คอร์ส ${course.title} ยังอยู่ระหว่างย้ายข้อมูลเข้าสู่แพลตฟอร์ม`}
      </p>
      {course.meta.migrationNote ? <p className="course-message-note">{course.meta.migrationNote}</p> : null}
      <div className="course-message-actions">
        <Link href="/courses/pab" className="course-action-primary">เปิดคอร์ส PAB</Link>
        <Link href={`/courses/${course.id}`} className="course-action-secondary">กลับไปหน้าคอร์ส</Link>
      </div>
    </section>
  );
}

/* ============================================================
   POLICE MATH SUBJECT PAGE COMPONENTS
   ============================================================ */
const CalculatorIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="16" y1="10" x2="16" y2="18" />
    <line x1="8" y1="10" x2="8" y2="18" />
    <line x1="12" y1="10" x2="12" y2="18" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const SheetIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const BookOpenIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="m9 11 2 2 4-4" />
  </svg>
);

const LightbulbIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A5 5 0 0 0 8 8c0 1 .3 2.5 1.5 3.5.7.8 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);

function PoliceMathSubjectPage({
  course,
  subject,
  practiceHref,
  examSets,
  ownedProductIds
}: {
  course: CourseConfig;
  subject: SubjectMeta;
  practiceHref: string;
  examSets: CatalogExamSet[];
  ownedProductIds: string[];
}) {
  const sheetHref = `/courses/${course.id}/${subject.id}/summary/chapter-01`;
  const ownedProducts = new Set(ownedProductIds);

  return (
    <div className="police-subject-page">
      <div className="container">
        <nav className="police-subject-breadcrumb" aria-label="breadcrumb">
          <Link href="/">หน้าแรก</Link>
          <span className="police-subject-breadcrumb-separator">&gt;</span>
          <Link href={`/courses/${course.id}`}>สนามสอบ</Link>
          <span className="police-subject-breadcrumb-separator">&gt;</span>
          <Link href={`/courses/${course.id}`}>นายสิบตำรวจ</Link>
          <span className="police-subject-breadcrumb-separator">&gt;</span>
          <span className="police-subject-breadcrumb-current">{subject.title}</span>
        </nav>

        <section className="police-subject-hero">
          <div className="police-subject-hero-left">
            <div className="police-subject-hero-title-row">
              <span className="police-subject-hero-icon">
                <CalculatorIcon />
              </span>
              <h1 className="police-subject-hero-title">{subject.title}</h1>
            </div>
            <p className="police-subject-hero-subtitle">
              เลือกอ่านชีทสรุปความรู้ทั่วไป หรือทำชุดข้อสอบสำหรับนายสิบตำรวจ
            </p>
            <div className="police-subject-hero-stats">
              <div className="police-subject-hero-stat-card">
                <span className="police-subject-hero-stat-icon"><SheetIcon /></span>
                <div className="police-subject-hero-stat-info">
                  <strong>ชีทสรุป</strong>
                  <span>20 บท · Quick Review</span>
                </div>
              </div>
              <div className="police-subject-hero-stat-card">
                <span className="police-subject-hero-stat-icon"><SheetIcon /></span>
                <div className="police-subject-hero-stat-info">
                  <strong>ชุดข้อสอบ</strong>
                  <span>{examSets.length} ชุด · ชุดแรกฟรี · ชุดถัดไป 19 บาท</span>
                </div>
              </div>
              <div className="police-subject-hero-stat-card">
                <span className="police-subject-hero-stat-icon"><CalendarIcon /></span>
                <div className="police-subject-hero-stat-info">
                  <strong>อัปเดตล่าสุด</strong>
                  <span>24 เม.ย. 2568</span>
                </div>
              </div>
            </div>
          </div>
          <div className="police-subject-hero-right">
            <div className="police-subject-hero-badge-wrap">
              <img src="/pic/logo_police.png" alt="Official Police Logo" />
              <div className="police-subject-hero-badge-cap">
                <img src="/pic/course-mascot/police-hero.png" alt="Police Cap" style={{ filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.15))' }} />
              </div>
            </div>
          </div>
        </section>

        <h2 className="police-subject-section-title">
          <span>📄</span> 1. ชีทสรุปความรู้ทั่วไป
        </h2>

        <div
          className="police-sheet-download-scroll-box"
          style={{
            border: '1.5px solid #e2e8f0',
            borderRadius: '14px',
            padding: '16px',
            background: '#f8fafc',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            marginBottom: '32px'
          }}
        >
          {[
            {
              title: 'เรื่อง เซต : สรุปสูตรลัด & เทคนิคทำโจทย์',
              desc: 'สรุปนิยามเซต, สับเซต, พาวเวอร์เซต, การดำเนินการของเซต และโจทย์แผนภาพเวนน์-ออยเลอร์',
              meta: '9.5 MB · PDF · ดาวน์โหลดฟรี',
              file: '/files/สรุปเรื่องเซต.pdf'
            },
            {
              title: 'เร็ว ๆ นี้',
              desc: 'เตรียมพบกับชีทสรุปสูตรลัดและแนวข้อสอบหัวข้อถัดไปเร็ว ๆ นี้',
              meta: 'PDF · เร็ว ๆ นี้',
              file: null
            },
            {
              title: 'เร็ว ๆ นี้',
              desc: 'เตรียมพบกับชีทสรุปสูตรลัดและแนวข้อสอบหัวข้อถัดไปเร็ว ๆ นี้',
              meta: 'PDF · เร็ว ๆ นี้',
              file: null
            }
          ].map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 18px',
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                gap: '16px',
                flexWrap: 'wrap'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 350px' }}>
                <span style={{ fontSize: '28px', color: '#7a1822', display: 'flex', alignItems: 'center' }}>
                  <SheetIcon />
                </span>
                <div>
                  <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{item.title}</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#64748b', lineHeight: 1.4 }}>{item.desc}</p>
                  <span style={{ display: 'inline-block', marginTop: '6px', fontSize: '11px', fontWeight: 700, color: item.file ? '#7a1822' : '#64748b', background: item.file ? '#fff5f5' : '#f1f5f9', padding: '2px 8px', borderRadius: '6px' }}>
                    {item.meta}
                  </span>
                </div>
              </div>
              {item.file ? (
                <CoffeePdfButton
                  pdfPath={item.file}
                  className="police-sheet-btn-primary"
                  style={{
                    padding: '8px 16px',
                    fontSize: '12px',
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <DownloadIcon /> ดาวน์โหลดไฟล์
                </CoffeePdfButton>
              ) : (
                <button
                  disabled
                  className="police-sheet-btn-secondary"
                  style={{
                    padding: '8px 16px',
                    fontSize: '12px',
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    cursor: 'not-allowed',
                    opacity: 0.7,
                    background: '#f1f5f9',
                    borderColor: '#e2e8f0',
                    color: '#94a3b8',
                    whiteSpace: 'nowrap',
                    border: '1px solid #cbd5e1'
                  }}
                >
                  เร็ว ๆ นี้
                </button>
              )}
            </div>
          ))}
        </div>

        <h2 className="police-subject-section-title">
          <span>📝</span> 2. ชุดข้อสอบ
        </h2>

        <div className="police-exam-grid">
          {examSets.map((examSet) => {
            const publicExamSetId = examSet.id === 'police-math-set-04' ? 'police-math-set-01' : examSet.id;
            const isUnlocked = examSet.access_type === 'free' || Boolean(
              examSet.product_id && ownedProducts.has(examSet.product_id)
            );
            return (
              <div className="police-exam-card" key={examSet.id}>
                <div className="police-exam-card-left">
                  <span className="police-exam-card-icon"><SheetIcon /></span>
                  <div className="police-exam-card-info">
                    <div className="police-exam-card-title-row">
                      <h4>{examSet.title}</h4>
                      <span className={`police-exam-card-price ${examSet.access_type === 'free' ? 'is-free' : ''}`}>
                        {examSet.access_type === 'free' ? 'ฟรี' : isUnlocked ? '🔓' : '🔒'}
                      </span>
                    </div>
                    <p className="police-exam-card-desc">
                      {examSet.total_questions} ข้อ · {examSet.duration_minutes ?? Math.ceil(examSet.total_questions * 1.5)} นาที · {examSet.description}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/courses/police_admin/math/exams/${publicExamSetId}`}
                  className={`police-exam-card-btn ${isUnlocked ? 'is-unlocked' : 'is-locked'}`}
                >
                  {isUnlocked
                    ? 'เริ่มทำข้อสอบ'
                    : `ปลดล็อก ${new Intl.NumberFormat('th-TH', {
                        style: 'currency', currency: 'THB', maximumFractionDigits: 0
                      }).format(examSet.price / 100)}`}
                </Link>
              </div>
            );
          })}
        </div>

        <section className="police-subject-footer-banner">
          <span className="police-subject-footer-banner-icon">
            <LightbulbIcon />
          </span>
          <div className="police-subject-footer-banner-text">
            <h3>พร้อมลองวัดพื้นฐานแล้วหรือยัง?</h3>
            <p>เลือกชุดที่ต้องการ ระบบจะบันทึกคำตอบและเวลาที่เหลือให้อัตโนมัติ</p>
          </div>
        </section>
      </div>
    </div>
  );
}
