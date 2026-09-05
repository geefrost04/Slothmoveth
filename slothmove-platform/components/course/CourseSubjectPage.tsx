import Link from 'next/link';
import type { CourseConfig, SubjectMeta } from '@/lib/course-types';
import type { CourseKnowledgeData } from '@/lib/knowledge-types';
import type { CatalogExamSet } from '@/lib/exam-data';
import { CourseKnowledgeContent } from './CourseKnowledgeContent';
import { PoliceExamCatalogClient } from './PoliceExamCatalogClient';
import { CoffeePdfButton } from '@/components/commerce/CoffeePdfButton';
import { SubjectIcon } from '@/components/icons/SubjectIcons';

export function CourseSubjectPage({
  course,
  subject,
  knowledge,
  examSets = [],
  ownedExamSetIds = []
}: {
  course: CourseConfig;
  subject: SubjectMeta;
  knowledge: CourseKnowledgeData | null;
  examSets?: CatalogExamSet[];
  ownedExamSetIds?: string[];
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
      />
    );
  }

  if (course.id === 'police_admin') {
    return (
      <PoliceSubjectLandingPage
        course={course}
        subject={subject}
        practiceHref={practiceHref}
        examSets={examSets}
        ownedExamSetIds={ownedExamSetIds}
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
          <div className="course-subject-icon"><SubjectIcon subjectId={subject.id} size={28} /></div>
          <div className="course-subject-heading">
            <div className="course-subject-chip">นายสิบตำรวจ · สายอำนวยการ</div>
            <h1>{subject.title}</h1>
            <p>{subject.desc}</p>
          </div>
          <div className="course-subject-mascot" aria-hidden="true">
            <div className="course-subject-mascot-glow" />
            <img src={subject.mascot || '/pic/course-mascot/police-hero.png'} alt="" />
          </div>
        </div>
      </header>

      <div className="container course-subject-body">
        {hasStudySheet ? (
          <section style={{ marginBottom: 28 }}>
            <h2>ชีทสรุปสำหรับอ่านสอบ</h2>
            <p>
              เรียงเนื้อหาคอมพิวเตอร์เป็นหมวด พร้อมภาพประกอบและจุดสำคัญที่ควรจำ
              สำหรับอ่านทบทวนก่อนลงมือฝึก
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
              ฝึกทำเป็นชุดภายใต้เวลาจำกัด พร้อมดูเฉลยและย้อนทบทวนจุดที่ควรพัฒนาได้หลังทำ
            </p>
            <PoliceExamCatalogClient
              courseId={course.id}
              subjectId={subject.id}
              examSets={examSets}
              ownedExamSetIds={ownedExamSetIds}
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

const POLICE_SUBJECT_DETAILS: Record<string, {
  eyebrow: string;
  summary: string;
  highlight: string;
  hasSummary: boolean;
}> = {
  thai: {
    eyebrow: 'ภาษาและการสื่อสาร',
    summary: 'จับประเด็นให้แม่น ใช้ภาษาให้ถูก และวิเคราะห์ข้อความได้อย่างเป็นระบบ',
    highlight: 'อ่านจับใจความ · หลักภาษา · การใช้ภาษา',
    hasSummary: false
  },
  computer: {
    eyebrow: 'เทคโนโลยีสารสนเทศ',
    summary: 'ทบทวนพื้นฐานคอมพิวเตอร์ โปรแกรมสำนักงาน เครือข่าย และความปลอดภัยดิจิทัล',
    highlight: 'พื้นฐานคอมฯ · Microsoft Office · อินเทอร์เน็ต',
    hasSummary: true
  },
  saraban: {
    eyebrow: 'ระเบียบและงานอำนวยการ',
    summary: 'เข้าใจชนิดหนังสือ ขั้นตอนรับส่ง การเก็บรักษา และแนวปฏิบัติงานสารบรรณ',
    highlight: 'ชนิดหนังสือ · ขั้นตอนงาน · ระเบียบที่ใช้',
    hasSummary: true
  },
  law: {
    eyebrow: 'กฎหมายและระเบียบงานสารบรรณ',
    summary: 'ทบทวน 6 Clusters เข้มข้น: รัฐธรรมนูญ แพ่ง อาญา กฎหมายพิเศษ และระเบียบงานสารบรรณ 6 ชนิด',
    highlight: 'รัฐธรรมนูญ · แพ่งและพาณิชย์ · อาญา · ระเบียบสารบรรณ',
    hasSummary: true
  },
  english: {
    eyebrow: 'English for Examination',
    summary: 'ฝึกคำศัพท์ ไวยากรณ์ บทสนทนา และการอ่านเพื่อเลือกคำตอบอย่างมีเหตุผล',
    highlight: 'Vocabulary · Grammar · Reading',
    hasSummary: false
  }
};

function PoliceSubjectLandingPage({
  course,
  subject,
  practiceHref,
  examSets,
  ownedExamSetIds
}: {
  course: CourseConfig;
  subject: SubjectMeta;
  practiceHref: string;
  examSets: CatalogExamSet[];
  ownedExamSetIds: string[];
}) {
  const details = POLICE_SUBJECT_DETAILS[subject.id] ?? {
    eyebrow: 'เตรียมสอบนายสิบตำรวจ',
    summary: subject.desc,
    highlight: 'ทบทวน · ฝึกทำ · วิเคราะห์ผล',
    hasSummary: false
  };
  const totalQuestions = examSets.reduce((total, examSet) => total + examSet.total_questions, 0);
  const freeSets = examSets.filter((examSet) => examSet.access_type === 'free').length;
  const summaryHref = `/courses/${course.id}/${subject.id}/summary`;

  return (
    <div className={`police-subject-page police-subject-page--catalog subject-${subject.id}`}>
      <div className="container">
        <nav className="police-subject-breadcrumb" aria-label="breadcrumb">
          <Link href="/">หน้าแรก</Link>
          <span className="police-subject-breadcrumb-separator">&gt;</span>
          <Link href={`/courses/${course.id}`}>สนามสอบ</Link>
          <span className="police-subject-breadcrumb-separator">&gt;</span>
          <Link href={`/courses/${course.id}`}>นายสิบตำรวจ สายอำนวยการ</Link>
          <span className="police-subject-breadcrumb-separator">&gt;</span>
          <span className="police-subject-breadcrumb-current">{subject.title}</span>
        </nav>

        <section className="police-subject-hero police-subject-hero--catalog">
          <div className="police-subject-hero-left">
            <div className="police-subject-header-meta">
              <span className="police-subject-track-badge">นายสิบตำรวจ · สายอำนวยการ</span>
              <span className="police-subject-eyebrow">{details.eyebrow}</span>
            </div>
            <div className="police-subject-hero-title-row">
              <span className="police-subject-hero-icon" aria-hidden="true">
                <SubjectIcon subjectId={subject.id} size={26} />
              </span>
              <h1 className="police-subject-hero-title">{subject.title}</h1>
            </div>
            <p className="police-subject-hero-subtitle">{details.summary}</p>
            <div className="police-subject-hero-stats">
              <div className="police-subject-hero-stat-card">
                <span className="police-subject-hero-stat-icon"><SheetIcon /></span>
                <div className="police-subject-hero-stat-info">
                  <strong>คลังข้อสอบ</strong>
                  <span>{examSets.length} ชุด · {totalQuestions.toLocaleString('th-TH')} ข้อ</span>
                </div>
              </div>
              <div className="police-subject-hero-stat-card">
                <span className="police-subject-hero-stat-icon"><CheckIcon /></span>
                <div className="police-subject-hero-stat-info">
                  <strong>เริ่มฝึกได้ทันที</strong>
                  <span>{freeSets > 0 ? `${freeSets} ชุดทดลองฟรี` : 'เลือกชุดที่ต้องการ'}</span>
                </div>
              </div>
              <div className="police-subject-hero-stat-card">
                <span className="police-subject-hero-stat-icon"><BookOpenIcon /></span>
                <div className="police-subject-hero-stat-info">
                  <strong>หัวข้อสำคัญ</strong>
                  <span>{details.highlight}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="police-subject-hero-right police-subject-hero-visual" aria-hidden="true">
            <span className="police-subject-hero-watermark">SLOTHMOVE</span>
            <img className="police-subject-hero-mascot" src={subject.mascot || '/pic/course-mascot/police-hero.png'} alt="" />
            <img className="police-subject-hero-seal" src="/pic/logo_police.png" alt="" />
          </div>
        </section>

        <section className="police-subject-summary-panel">
          <div className="police-subject-summary-icon" aria-hidden="true"><BookOpenIcon /></div>
          <div className="police-subject-summary-copy">
            <span>{details.hasSummary ? 'ชีทสรุปพร้อมอ่าน' : 'พื้นที่ทบทวนเนื้อหา'}</span>
            <h2>{details.hasSummary ? `สรุป${subject.title}แบบอ่านง่าย` : `สรุป${subject.title}กำลังจัดทำ`}</h2>
            <p>
              {details.hasSummary
                ? 'เรียงประเด็นสำคัญเป็นลำดับ พร้อมตัวอย่างและจุดที่ควรจำก่อนลงสนามสอบ'
                : 'ทีมงานกำลังเรียบเรียงสรุปแบบ Visual ให้กระชับ สวยงาม และเหมาะกับการทบทวนบนทุกหน้าจอ'}
            </p>
          </div>
          {details.hasSummary ? (
            <Link className="police-subject-summary-action" href={summaryHref}>เปิดชีทสรุป <span>›</span></Link>
          ) : (
            <span className="police-subject-summary-status">เร็ว ๆ นี้</span>
          )}
        </section>

        <section className="police-subject-exam-section">
          <div className="police-subject-section-heading">
            <div>
              <span>ฝึกทำอย่างเป็นระบบ</span>
              <h2>ชุดข้อสอบ{subject.title}</h2>
            </div>
            <Link href={practiceHref}>เปิดลานฝึก <span>›</span></Link>
          </div>
          <PoliceExamCatalogClient
            courseId={course.id}
            subjectId={subject.id}
            examSets={examSets}
            ownedExamSetIds={ownedExamSetIds}
          />
        </section>

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

function PoliceMathSubjectPage({
  course,
  subject
}: {
  course: CourseConfig;
  subject: SubjectMeta;
}) {

  return (
    <div className="police-subject-page">
      <div className="container">
        <nav className="police-subject-breadcrumb" aria-label="breadcrumb">
          <Link href="/">หน้าแรก</Link>
          <span className="police-subject-breadcrumb-separator">&gt;</span>
          <Link href={`/courses/${course.id}`}>สนามสอบ</Link>
          <span className="police-subject-breadcrumb-separator">&gt;</span>
          <Link href={`/courses/${course.id}`}>นายสิบตำรวจ สายอำนวยการ</Link>
          <span className="police-subject-breadcrumb-separator">&gt;</span>
          <span className="police-subject-breadcrumb-current">{subject.title}</span>
        </nav>

        <section className="police-subject-hero">
          <div className="police-subject-hero-left">
            <span className="police-subject-track-badge">นายสิบตำรวจ · สายอำนวยการ</span>
            <div className="police-subject-hero-title-row">
              <span className="police-subject-hero-icon">
                <CalculatorIcon />
              </span>
              <h1 className="police-subject-hero-title">{subject.title}</h1>
            </div>
            <p className="police-subject-hero-subtitle">
              เลือกอ่านชีทสรุปความรู้ทั่วไป หรือทำชุดข้อสอบสำหรับนายสิบตำรวจ สายอำนวยการ
            </p>
            <div className="police-subject-hero-stats">
              <div className="police-subject-hero-stat-card">
                <span className="police-subject-hero-stat-icon"><SheetIcon /></span>
                <div className="police-subject-hero-stat-info">
                  <strong>ชีทสรุป</strong>
                  <span>ฟรีพร้อมอ่าน · อัปเดตเรื่อย ๆ</span>
                </div>
              </div>
              <div className="police-subject-hero-stat-card">
                <span className="police-subject-hero-stat-icon"><SheetIcon /></span>
                <div className="police-subject-hero-stat-info">
                  <strong>ชุดข้อสอบ</strong>
                  <span>Set 1 · 140 ข้อ · ฟรีทั้งหมด</span>
                </div>
              </div>
              <div className="police-subject-hero-stat-card">
                <span className="police-subject-hero-stat-icon"><CalendarIcon /></span>
                <div className="police-subject-hero-stat-info">
                  <strong>อัปเดตล่าสุด</strong>
                  <span>อัปเดตตามชุดที่เผยแพร่</span>
                </div>
              </div>
            </div>
          </div>
          <div className="police-subject-hero-right police-subject-hero-visual" aria-hidden="true">
            <span className="police-subject-hero-watermark">SLOTHMOVE</span>
            <img className="police-subject-hero-mascot" src={subject.mascot || '/pic/police-mascot/math.png'} alt="" />
            <img className="police-subject-hero-seal" src="/pic/logo_police.png" alt="" />
          </div>
        </section>

        <section className="police-subject-exam-section" aria-labelledby="math-exam-catalog-title">
          <div className="police-subject-section-heading">
            <div>
              <span>ฝึกทำอย่างเป็นระบบ</span>
              <h2 id="math-exam-catalog-title">ชุดข้อสอบ{subject.title}</h2>
            </div>
            <span style={{
              padding: '4px 12px',
              borderRadius: '999px',
              color: '#7a1822',
              border: '1px solid #edd5d8',
              background: '#fff5f5',
              fontSize: '12px',
              fontWeight: 800
            }}>
              5 ชุดข้อสอบ (เปิดแล้ว 1 ชุด)
            </span>
          </div>

          <div className="police-math-sets-list">
            {/* Set 1 - Active */}
            <div className="police-math-set-card is-active">
              <div className="police-math-set-badge is-active">
                <small>SET</small>
                <span>01</span>
              </div>
              <div className="police-math-set-info">
                <div className="police-math-set-title-row">
                  <h3 className="police-math-set-title">Set 1 : ข้อสอบแยกหมวด</h3>
                  <span style={{ padding: '2px 8px', borderRadius: '6px', color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', fontSize: '11px', fontWeight: 800 }}>
                    เปิดให้ทำแล้ว
                  </span>
                  <span style={{ padding: '2px 8px', borderRadius: '6px', color: '#7a1822', background: '#fde7ea', fontSize: '11px', fontWeight: 800 }}>
                    ฟรี
                  </span>
                  <span style={{ padding: '2px 8px', borderRadius: '6px', color: '#475569', background: '#f1f5f9', fontSize: '11px', fontWeight: 700 }}>
                    140 ข้อ
                  </span>
                  <span style={{ padding: '2px 8px', borderRadius: '6px', color: '#475569', background: '#f1f5f9', fontSize: '11px', fontWeight: 700 }}>
                    6 หมวดฝึก
                  </span>
                </div>
                <p className="police-math-set-desc">
                  อนุกรม · มิติสัมพันธ์ · โอเปอเรชัน · ตรรกศาสตร์ · เงื่อนไขสัญลักษณ์ · โจทย์ปัญหา
                </p>
                <small className="police-math-set-meta-note">
                  ✓ ทำฟรีทุกหมวด พร้อมเฉลยละเอียดและวิธีคิดทุกข้อ
                </small>
              </div>
              <div className="police-math-set-action">
                <Link href="/courses/police_admin/math/set-1" className="police-math-set-action-btn">
                  เข้าทำข้อสอบ Set 1 <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            {/* Sets 2-5 - Upcoming */}
            {[
              {
                num: '02',
                title: 'Set 2 : ข้อสอบแยกหมวด',
                desc: 'รวมข้อสอบแยกตาม 6 หมวดฝึก อนุกรม · มิติสัมพันธ์ · โอเปอเรชัน · ตรรกศาสตร์ · เงื่อนไขสัญลักษณ์ · โจทย์ปัญหา',
                tags: ['เร็ว ๆ นี้', '6 หมวดฝึก']
              },
              {
                num: '03',
                title: 'Set 3 : ข้อสอบแยกหมวด',
                desc: 'รวมข้อสอบแยกตาม 6 หมวดฝึก อนุกรม · มิติสัมพันธ์ · โอเปอเรชัน · ตรรกศาสตร์ · เงื่อนไขสัญลักษณ์ · โจทย์ปัญหา',
                tags: ['เร็ว ๆ นี้', '6 หมวดฝึก']
              },
              {
                num: '04',
                title: 'Set 4 : ข้อสอบแยกหมวด',
                desc: 'รวมข้อสอบแยกตาม 6 หมวดฝึก อนุกรม · มิติสัมพันธ์ · โอเปอเรชัน · ตรรกศาสตร์ · เงื่อนไขสัญลักษณ์ · โจทย์ปัญหา',
                tags: ['เร็ว ๆ นี้', '6 หมวดฝึก']
              },
              {
                num: '05',
                title: 'Set 5 : ข้อสอบแยกหมวด',
                desc: 'รวมข้อสอบแยกตาม 6 หมวดฝึก อนุกรม · มิติสัมพันธ์ · โอเปอเรชัน · ตรรกศาสตร์ · เงื่อนไขสัญลักษณ์ · โจทย์ปัญหา',
                tags: ['เร็ว ๆ นี้', '6 หมวดฝึก']
              }
            ].map((item) => (
              <div key={item.num} className="police-math-set-card is-upcoming">
                <div className="police-math-set-badge is-locked">
                  <small>SET</small>
                  <span>{item.num}</span>
                </div>
                <div className="police-math-set-info">
                  <div className="police-math-set-title-row">
                    <h3 className="police-math-set-title">{item.title}</h3>
                    <span style={{ padding: '2px 8px', borderRadius: '6px', color: '#64748b', background: '#f1f5f9', fontSize: '11px', fontWeight: 700 }}>
                      เร็ว ๆ นี้
                    </span>
                    {item.tags.slice(1).map((tag) => (
                      <span
                        key={tag}
                        style={{
                          padding: '2px 8px',
                          borderRadius: '6px',
                          color: '#94a3b8',
                          background: '#f8fafc',
                          border: '1px solid #e2e8f0',
                          fontSize: '11px',
                          fontWeight: 600
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="police-math-set-desc">{item.desc}</p>
                </div>
                <div className="police-math-set-action">
                  <span className="police-math-set-locked-btn">
                    <span>🔒</span> เร็ว ๆ นี้
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <details className="police-sheet-library">
          <summary>
            <span className="police-sheet-library-icon"><SheetIcon /></span>
            <span className="police-sheet-library-copy">
              <strong>ชีทสรุปอ่านฟรี</strong>
              <small>5 ไฟล์ PDF สำหรับทบทวนสูตรและวิธีคิด</small>
            </span>
            <span className="police-sheet-library-action">ดูชีท <b aria-hidden="true">⌄</b></span>
          </summary>
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
            marginBottom: '0'
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
              title: 'เซต (2)',
              desc: 'สรุปความหมายและการนับเซต 2 กลุ่ม พร้อมแผนภาพเวนน์-ออยเลอร์',
              meta: 'PDF · เปิดอ่านฟรี',
              file: '/files/police-general-ability-set-02-sheet.pdf'
            },
            {
              title: 'ความสัมพันธ์ระหว่าง คน งาน เวลา',
              desc: 'ชีทสรุปสูตรคน-งาน-เวลา พร้อมหลักคิดสำคัญ สูตรใช้บ่อย วิธีทำโจทย์ให้ไว และตัวอย่างออกสอบ',
              meta: 'PDF · เปิดอ่านฟรี',
              file: '/files/police-general-ability-work-rate-sheet.pdf'
            },
            {
              title: 'กำไร-ขาดทุน : สูตรลัดและวิธีคิดเร็ว',
              desc: 'สรุปการหาราคาขาย ทุน กำไร ขาดทุน และเปอร์เซ็นต์ พร้อมตัวอย่างทำโจทย์แบบเป็นขั้นตอน',
              meta: '3 หน้า · PDF · ดาวน์โหลดฟรี',
              file: '/files/police-general-ability-profit-loss-sheet.pdf'
            },
            {
              title: 'การสับเปลี่ยน : สรุปสูตรและวิธีทำโจทย์',
              desc: 'สรุปการสับเปลี่ยน 4 รูปแบบ: เรียงของต่างกัน เลือกมาเรียง เรียงของซ้ำ และเรียงเป็นวงกลม',
              meta: '4 หน้า · PDF · ดาวน์โหลดฟรี',
              file: '/files/police-general-ability-permutation-sheet.pdf'
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
                  <DownloadIcon /> เปิดชีท PDF
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
        </details>
      </div>
    </div>
  );
}
