import Link from 'next/link';
import type { CourseConfig, CourseLandingSection, SubjectMeta } from '@/lib/course-types';

function findSubjects(course: CourseConfig, ids: string[]) {
  return ids
    .map((id) => course.subjects.find((subject) => subject.id === id))
    .filter(Boolean) as SubjectMeta[];
}

function SubjectPanel({
  courseId,
  subject,
  hideCount = false,
  categoryLabel,
  number
}: {
  courseId: string;
  subject: SubjectMeta;
  hideCount?: boolean;
  categoryLabel: CourseLandingSection['categoryLabel'];
  number: number;
}) {
  const hasData = subject.count > 0;

  return (
    <Link
      href={`/courses/${courseId}/${subject.id}`}
      className={`pab-subject-card${hasData ? '' : ' is-empty'}`}
    >
      <div className="pab-subject-card-body">
        <div className="pab-subject-card-header">
          <span className="pab-subject-card-num">{String(number).padStart(2, '0')}</span>
          <span className="pab-subject-card-cat">{categoryLabel}</span>
        </div>
        <h3 className="pab-subject-card-title">
          <span aria-hidden="true">{subject.icon ?? '📘'}</span> {subject.title}
        </h3>
        <p className="pab-subject-card-desc">{subject.desc}</p>
        <div className="pab-subject-card-stats">
          {hideCount ? null : (
            <span className={`pab-subject-card-count${hasData ? '' : ' is-empty'}`}>
              {hasData ? `${subject.count} ข้อ` : 'กำลังย้ายข้อมูล'}
            </span>
          )}
          <span className="pab-subject-card-cta">{hasData ? 'เข้าเรียน' : 'ดูสถานะ'}</span>
        </div>
      </div>
    </Link>
  );
}

export function CourseLanding({ course }: { course: CourseConfig }) {
  const landing = course.meta.landing;
  if (!landing) return null;
  const hideQuestionCounts = course.meta.hideQuestionCounts === true;
  const useMockSection = course.id === 'police_admin' || course.id === 'ocsc';
  const firstReadySubject = course.subjects.find((subject) => subject.count > 0);
  const examHref = firstReadySubject
    ? `/courses/${course.id}/${firstReadySubject.id}/quiz`
    : landing.feature?.primaryCtaHref ?? '#course-content';
  const firstSectionHref = landing.sections[0] ? `#section-${landing.sections[0].id}` : '#course-content';

  return (
    <>
      <section
        className="pab-hero"
        style={course.theme.mascot ? ({ '--hero-image-url': `url(${course.theme.mascot})` } as React.CSSProperties) : undefined}
      >
        <div className="container">
          <div className="pab-hero-inner">
            <div className="pab-hero-content">
              <div className="pab-hero-badge">{landing.heroBadge}</div>
              <div className="pab-hero-kicker">{landing.heroTitleLead}</div>
              <h1 className="pab-hero-title">
                {landing.heroTitleLines.map((line) => <span key={line}>{line}</span>)}
                {landing.heroTitleAccent ? (
                  <small className="pab-hero-title-accent">{landing.heroTitleAccent}</small>
                ) : null}
              </h1>
              <p className="pab-hero-desc">{landing.heroDescription}</p>
              <div className="pab-hero-actions">
                <a href="#course-content" className="pab-btn pab-btn-primary">
                  {landing.primaryCtaLabel} <span aria-hidden="true">→</span>
                </a>
                {landing.secondaryCtaLabel ? (
                  <Link href={landing.secondaryCtaHref || firstSectionHref} className="pab-btn pab-btn-secondary">
                    {landing.secondaryCtaLabel}
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="pab-hero-mascot">
              <img src={course.theme.mascot ?? course.theme.logo} alt={course.tagline} />
              {landing.mascotLabel ? <div className="pab-hero-mascot-label">{landing.mascotLabel}</div> : null}
            </div>
          </div>
        </div>
      </section>

      <div id="course-content" className="pab-course-content">
        {landing.feature && useMockSection ? (
          <section className="pab-mock-section">
            <div className="container">
              <div className="pab-mock-card">
                <div className="pab-mock-card-top"></div>
                <div className="pab-mock-card-inner">
                  <div className="pab-mock-badge">
                    <span>{landing.feature.icon}</span> {landing.feature.chip}
                  </div>
                  <h2 className="pab-mock-title">{landing.feature.title}</h2>
                  <p className="pab-mock-desc">{landing.feature.desc}</p>
                  <div className="pab-mock-meta">
                    {landing.feature.meta.map((item) => <span key={item}>{item}</span>)}
                  </div>
                  <div className="pab-mock-actions">
                    <Link href={landing.feature.primaryCtaHref || `/courses/${course.id}/mock-test`} className="pab-btn pab-btn-primary">
                      {landing.feature.primaryCtaLabel} →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : landing.feature ? (
          <section className="course-exam-section" id="exam">
            <div className="container course-exam-inner">
              <div className="course-exam-icon" aria-hidden="true">{landing.feature.icon}</div>
              <div className="course-exam-copy">
                <div className="course-exam-chip">{landing.feature.chip}</div>
                <h2>{landing.feature.title}</h2>
                <p>{landing.feature.desc}</p>
                <div className="course-exam-meta">
                  {landing.feature.meta.map((item) => <span key={item}>{item}</span>)}
                </div>
              </div>
              <div className="course-exam-actions">
                <Link href={examHref} className="course-exam-primary">
                  ลานฝึก <span aria-hidden="true">→</span>
                </Link>
                {landing.feature.secondaryCtaLabel ? (
                  <a href={landing.feature.secondaryCtaHref} className="course-exam-secondary">
                    {landing.feature.secondaryCtaLabel}
                  </a>
                ) : null}
              </div>
            </div>
          </section>
        ) : null}

        {course.id === 'police_admin' && (
          <section className="pab-mock-section">
            <div className="container">
              <div className="pab-mock-card">
                <div className="pab-mock-card-top"></div>
                <div className="pab-mock-card-inner">
                  <div className="pab-mock-badge">
                    <span>📝</span> จำลองสอบเสมือนจริง
                  </div>
                  <h2 className="pab-mock-title">จำลองสอบสนามจริง 150 ข้อ</h2>
                  <p className="pab-mock-desc">
                    ทดสอบความพร้อมด้วยข้อสอบเสมือนจริงรวมทุกหัวข้อวิชาตามโครงสร้างข้อสอบจริง 
                    ระบบจะทำการสุ่มข้อสอบ 150 ข้อ จับเวลา 180 นาที เพื่อวัดคะแนนและผลประเมินของคุณแบบละเอียดหลังส่งกระดาษคำตอบ
                  </p>
                  <div className="pab-mock-meta">
                    <span>⏱️ เวลาสอบ 180 นาที</span>
                    <span>💯 รวม 150 คะแนน</span>
                    <span>🔢 ภาค ก (40 ข้อ) + ภาค ข (110 ข้อ)</span>
                  </div>
                  <div className="pab-mock-actions">
                    <Link href={`/courses/${course.id}/mock-test`} className="pab-btn pab-btn-primary">
                      เริ่มทำข้อสอบจำลอง →
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {landing.sections.map((section, sectionIndex) => {
          const subjects = findSubjects(course, section.subjectIds);
          const numberOffset = landing.sections
            .slice(0, sectionIndex)
            .reduce((total, item) => total + item.subjectIds.length, 0);

          return (
            <section key={section.id} className="pab-section" id={`section-${section.id}`}>
              <div className="pab-section-header">
                <div className={`pab-section-part pab-${section.partClass}`}>{section.partLabel}</div>
                <div className="pab-section-header-info">
                  <div className="pab-section-chip">{section.chip}</div>
                  <h2 className="pab-section-title">{section.title}</h2>
                  <p className="pab-section-subtitle">{section.subtitle}</p>
                </div>
                <div className="pab-section-count">{subjects.length} วิชา</div>
              </div>

              <div className="pab-subject-grid-wrap">
                <div className="pab-subject-grid">
                  {subjects.map((subject, subjectIndex) => (
                    <SubjectPanel
                      key={subject.id}
                      courseId={course.id}
                      subject={subject}
                      hideCount={hideQuestionCounts}
                      categoryLabel={section.categoryLabel}
                      number={numberOffset + subjectIndex + 1}
                    />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
