import { Fragment } from 'react';
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
  const [focusLine, ...topicLines] = subject.desc.split(' · ');
  const topicsSummary = topicLines.join(' · ');
  const isPoliceAdmin = courseId === 'police_admin';

  return (
    <Link
      href={`/courses/${courseId}/${subject.id}`}
      className={`pab-subject-card${hasData ? '' : ' is-empty'}`}
    >
      <div className="pab-subject-card-body">
        {isPoliceAdmin ? (
          <>
            <div className="pab-subject-card-header-police">
              <span aria-hidden="true" className="pab-subject-card-icon-police">{subject.icon ?? '📘'}</span>
              <div className="pab-subject-card-header-info-police">
                <h3 className="pab-subject-card-title-police">{subject.title}</h3>
                <span className="pab-subject-card-cat-police">{categoryLabel}</span>
              </div>
            </div>
            <p className="pab-subject-card-focus-police">{focusLine}</p>
            <p className="pab-subject-card-desc-police">{topicsSummary}</p>
            <div className="pab-subject-card-stats-police">
              <span className="pab-subject-card-cta-police">เข้าเรียน →</span>
            </div>
          </>
        ) : (
          <>
            <div className="pab-subject-card-header">
              <span className="pab-subject-card-num">{String(number).padStart(2, '0')}</span>
              <span className="pab-subject-card-cat">{categoryLabel}</span>
            </div>
            <h3 className="pab-subject-card-title">
              <span aria-hidden="true">{subject.icon ?? '📘'}</span> {subject.title}
            </h3>
            {topicsSummary ? (
              <>
                {focusLine && <p className="pab-subject-card-focus">{focusLine}</p>}
                <p className="pab-subject-card-desc">{topicsSummary}</p>
              </>
            ) : (
              <p className="pab-subject-card-desc">{subject.desc}</p>
            )}
            <div className="pab-subject-card-stats">
              {hideCount ? null : (
                <span className={`pab-subject-card-count${hasData ? '' : ' is-empty'}`}>
                  {hasData ? `${subject.count} ข้อ` : 'กำลังย้ายข้อมูล'}
                </span>
              )}
              <span className="pab-subject-card-cta">{hasData ? 'เข้าเรียน' : 'ดูสถานะ'}</span>
            </div>
          </>
        )}
      </div>
    </Link>
  );
}

function PoliceAdminV3Landing({ course }: { course: CourseConfig }) {
  const landing = course.meta.landing;
  if (!landing) return null;
  const isOcsc = course.id === 'ocsc';

  let subjectOffset = 0;
  const sectionEntries = landing.sections.map((section) => {
    const subjects = findSubjects(course, section.subjectIds);
    const entry = { section, subjects, startNumber: subjectOffset + 1 };
    subjectOffset += subjects.length;
    return entry;
  });

  const totalReadyQuestions = course.subjects.reduce((sum, subject) => sum + Math.max(subject.count, 0), 0);
  const heroImage = course.theme.mascot || '/pic/slothmove_hero_study.png';
  const mockTitle = isOcsc ? landing.feature?.title ?? 'จำลองสอบภาค ก.' : 'เริ่มจำลองสอบ 150 ข้อ';
  const mockDesc = isOcsc
    ? landing.feature?.desc ?? 'จำลองสอบตามโครงสร้างจริงของภาค ก. พร้อมสรุปคะแนนและเฉลยหลังส่งคำตอบ'
    : 'สุ่มข้อสอบตามโครงสร้างจริง จับเวลา 180 นาที พร้อมสรุปคะแนนและเฉลยหลังส่งคำตอบ';
  const mockMeta = isOcsc
    ? landing.feature?.meta ?? ['100 ข้อ', '200 คะแนน', 'ภาค ก']
    : ['150 ข้อ', '180 นาที', '150 คะแนน', 'ภาค ก + ข'];
  const mockReady = isOcsc ? 'พร้อมซ้อมภาค ก?' : 'พร้อมเริ่มสอบ?';
  const mockDuration = isOcsc ? '100 ข้อ' : '180 นาที';
  const mockButtonLabel = isOcsc
    ? landing.feature?.primaryCtaLabel ?? 'เริ่มทำข้อสอบจำลอง'
    : 'เริ่มทำข้อสอบจำลอง';
  const outlineTitle = isOcsc ? 'โครงสร้างภาค ก ที่ต้องอ่านจริง' : 'วิชาที่สอบทั้งหมด';
  const outlineText = isOcsc
    ? 'มีเฉพาะ <strong>ภาค ก</strong> โดยแบ่งเป็น 3 หมวดหลัก: ความสามารถในการคิดวิเคราะห์ · ภาษาอังกฤษ · ความรู้และลักษณะการเป็นข้าราชการที่ดี'
    : '<strong>ภาค ก (40 คะแนน)</strong> ความรู้ความสามารถทั่วไป · <strong>ภาค ข (110 คะแนน)</strong> ความรู้เฉพาะตำแหน่ง';

  return (
    <div className="police-v3-page">
      {isOcsc ? (
        <section className="ocsc-v3-hero" aria-labelledby="course-hero-title">
          <div className="container">
            <div className="ocsc-v3-hero-inner">
              <div className="ocsc-v3-hero-copy">
                <div className="ocsc-v3-hero-badge">
                  เปิดให้เรียนฟรี · คลังข้อสอบ {totalReadyQuestions.toLocaleString()} ข้อ
                </div>
                <div className="ocsc-v3-hero-kicker">{course.category}</div>
                <h1 className="ocsc-v3-hero-title" id="course-hero-title">
                  <span>{landing.heroTitleLines[0]}</span>
                  <span>{landing.heroTitleLines[1] ?? course.title}</span>
                </h1>
                {landing.heroTitleAccent ? (
                  <p className="ocsc-v3-hero-subtitle">{landing.heroTitleAccent}</p>
                ) : null}
                <p className="ocsc-v3-hero-desc">{landing.heroDescription}</p>
                <div className="ocsc-v3-hero-actions">
                  <a href={landing.primaryCtaHref || '#course-content'} className="ocsc-v3-btn ocsc-v3-btn-primary">
                    {landing.primaryCtaLabel || 'เริ่มเรียนเลย'} <span aria-hidden="true">→</span>
                  </a>
                  {landing.secondaryCtaLabel ? (
                    <Link href={landing.secondaryCtaHref || '/courses'} className="ocsc-v3-btn ocsc-v3-btn-secondary">
                      {landing.secondaryCtaLabel}
                    </Link>
                  ) : null}
                </div>
              </div>

              <div className="ocsc-v3-hero-visual" aria-hidden="true">
                <div className="ocsc-v3-hero-frame">
                  <div className="ocsc-v3-hero-glow" />
                  <img src={heroImage} alt="" />
                  <div className="ocsc-v3-hero-frame-copy">
                    <strong>ภาค ก เท่านั้น</strong>
                    <span>3 วิชาหลัก · พร้อมเริ่มฝึก</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="ph-hero" aria-labelledby="course-hero-title">
          <div className="ph-hero-inner">
            <div className="ph-hero-copy">
              <div className="ph-hero-eyebrow">
                <span className="ph-hero-eyebrow-dot" aria-hidden="true" />
                {landing.heroBadge ?? course.category}
              </div>
              <h1 className="ph-hero-title" id="course-hero-title">
                {landing.heroTitleLines.map((line, index) => (
                  <span key={`${line}-${index}`}>{line}</span>
                ))}
                {landing.heroTitleAccent ? <small className="ph-hero-accent">{landing.heroTitleAccent}</small> : null}
              </h1>
              <p className="ph-hero-sub">{landing.heroDescription}</p>

              <div className="ph-hero-stats" aria-label="สถิติคอร์ส">
                {landing.stats.slice(0, 3).map((stat, index) => (
                  <Fragment key={`${stat.label}-${index}`}>
                    {index > 0 ? <span className="ph-hero-stat-divider" aria-hidden="true" /> : null}
                    <div className="ph-hero-stat">
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                    </div>
                  </Fragment>
                ))}
              </div>

              <div className="ph-hero-actions">
                <a href={landing.primaryCtaHref || '#course-content'} className="ph-btn ph-btn-primary">
                  {landing.primaryCtaLabel || 'เริ่มเรียนเลย'}
                  <span aria-hidden="true">→</span>
                </a>
                {landing.secondaryCtaLabel ? (
                  <Link href={landing.secondaryCtaHref || '/courses'} className="ph-btn ph-btn-ghost">
                    {landing.secondaryCtaLabel}
                  </Link>
                ) : null}
              </div>
            </div>

            <div className="ph-hero-visual" aria-hidden="true">
              <div className="ph-hero-glow" />
              <div className="ph-hero-ring" />
              <img src={heroImage} alt="" className="ph-hero-mascot-img" />
              <div className="ph-hero-logo-wrap">
                <img src={course.theme.logo} alt="" className="ph-hero-logo" />
              </div>
            </div>
          </div>
        </section>
      )}

      <div id="course-content" className="police-v3-content-anchor" />

      <div className="container police-v3-content">
        <section className="police-v3-mock">
          <div className="police-v3-mock-icon">{landing.feature?.icon ?? '📝'}</div>
          <div className="police-v3-mock-copy">
            <div className="police-v3-mock-badge">{landing.feature?.chip ?? 'จำลองสอบเสมือนจริง'}</div>
            <h3>{mockTitle}</h3>
            <p>{mockDesc}</p>
            <div className="police-v3-mock-meta">
              {mockMeta.map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
          <div className="police-v3-mock-actions">
            <span className="police-v3-mock-ready">{mockReady}</span>
            <strong>{mockDuration}</strong>
            <Link href={`/courses/${course.id}/mock-test`} className="police-v3-btn police-v3-btn-primary">
              {mockButtonLabel} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>

        <section className="police-v3-outline">
          <h2>{outlineTitle}</h2>
          <p dangerouslySetInnerHTML={{ __html: outlineText }} />
        </section>

        <div className="police-v3-sections">
          {sectionEntries.map(({ section, subjects, startNumber }) => (
            <section key={section.id} className={`police-v3-section is-${section.id}`} id={`section-${section.id}`}>
              <div className="police-v3-section-head">
                <div>
                  <div className="police-v3-section-badge">{section.partLabel} · {section.chip}</div>
                  <h3>{section.title}</h3>
                  <p>{section.subtitle}</p>
                </div>
                <span className="police-v3-section-count">{subjects.length} วิชา</span>
              </div>

              <div className="police-v3-subject-grid">
                {subjects.map((subject, index) => {
                  const available = subject.count > 0;
                  const subjectNumber = startNumber + index;
                  return available ? (
                    <Link
                      key={subject.id}
                      href={`/courses/${course.id}/${subject.id}`}
                      className={`police-v3-subject-card is-${subject.id}`}
                    >
                      <div className="police-v3-subject-header">
                        <div className="police-v3-subject-icon">{subject.icon ?? '📘'}</div>
                        <div className="police-v3-subject-header-info">
                          <h4>{subject.title}</h4>
                          <span className="police-v3-subject-chip">{section.categoryLabel}</span>
                        </div>
                      </div>
                      <p>{subject.desc}</p>
                      <div className="police-v3-subject-bottom">
                        <strong>เข้าเรียน →</strong>
                      </div>
                    </Link>
                  ) : (
                    <div key={subject.id} className={`police-v3-subject-card is-disabled is-${subject.id}`}>
                      <div className="police-v3-subject-header">
                        <div className="police-v3-subject-icon">{subject.icon ?? '📘'}</div>
                        <div className="police-v3-subject-header-info">
                          <h4>{subject.title}</h4>
                          <span className="police-v3-subject-chip">{section.categoryLabel}</span>
                        </div>
                      </div>
                      <p>{subject.desc}</p>
                      <div className="police-v3-subject-bottom">
                        <strong>🔒</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

export function CourseLanding({ course }: { course: CourseConfig }) {
  const landing = course.meta.landing;
  if (!landing) return null;
  const isPoliceAdmin = course.id === 'police_admin';
  const isOcsc = course.id === 'ocsc';
  const useEditorialLanding = isPoliceAdmin || isOcsc;
  const hideQuestionCounts = course.meta.hideQuestionCounts === true;
  const useMockSection = isPoliceAdmin || course.id === 'ocsc';
  const firstReadySubject = course.subjects.find((subject) => subject.count > 0);
  const contentAnchorId = 'course-content';
  const firstSectionId = landing.sections[0] ? `section-${landing.sections[0].id}` : contentAnchorId;
  const examHref = firstReadySubject
    ? `/courses/${course.id}/${firstReadySubject.id}/quiz`
    : landing.feature?.primaryCtaHref ?? `#${contentAnchorId}`;
  const firstSectionHref = `#${firstSectionId}`;

  if (useEditorialLanding) {
    return <PoliceAdminV3Landing course={course} />;
  }

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

      <div id={contentAnchorId} className="pab-course-content">
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

        {isPoliceAdmin && (
          <section className="pab-mock-section">
            <div className="container">
              <div className="pab-mock-card">
                <div className="pab-mock-card-top"></div>
                <div className="pab-mock-card-inner pab-mock-card-inner-compact">
                  <div className="pab-mock-main">
                    <div className="pab-mock-copy">
                      <div className="pab-mock-badge">
                        <span>📝</span> จำลองสอบเสมือนจริง
                      </div>
                      <h2 className="pab-mock-title">จำลองสอบสนามจริง 150 ข้อ</h2>
                      <p className="pab-mock-desc">
                        สุ่มข้อสอบตามโครงสร้างจริง จับเวลา 180 นาที พร้อมสรุปคะแนนและเฉลยหลังส่งคำตอบ
                      </p>
                      <div className="pab-mock-meta">
                        <span>150 ข้อ</span>
                        <span>180 นาที</span>
                        <span>150 คะแนน</span>
                        <span>ภาค ก + ข</span>
                      </div>
                    </div>

                    <div className="pab-mock-side">
                      <div className="pab-mock-side-card">
                        <strong>พร้อมเริ่มสอบ?</strong>
                        <span>180 นาที</span>
                        <div className="pab-mock-actions">
                          <Link href={`/courses/${course.id}/mock-test`} className="pab-btn pab-btn-primary">
                            เริ่มทำข้อสอบจำลอง →
                          </Link>
                        </div>
                      </div>
                    </div>
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
                  {section.subtitle && <p className="pab-section-subtitle">{section.subtitle}</p>}
                </div>
                {course.id !== 'police_admin' && (
                  <div className="pab-section-count">{subjects.length} วิชา</div>
                )}
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
