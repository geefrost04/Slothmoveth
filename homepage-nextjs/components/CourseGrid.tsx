import { VISIBLE_COURSES, PLATFORM_HOME_URL, Course } from '@/lib/courses';

const ID_THEME: Record<string, string> = {
  pab: 'pab',
  industry: 'industry',
  opsd: 'opsd',
  police_admin: 'police',
  kpi: 'kpi'
};

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4M16 2v4M3 10h18M5 6h14a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5a3 3 0 0 1 6 0M9 5a3 3 0 0 0 6 0M9 5h6" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
    </svg>
  );
}

function CourseCard({ course }: { course: Course }) {
  const themeClass = ID_THEME[course.id] || 'opsd';
  const isComingSoon = course.status === 'coming-soon';
  const isPartial = course.status === 'partial';
  const isPlaceholder = course.fullLink === '#';
  // Only fully unavailable courses stay disabled. Partially migrated
  // courses should still open so users can access the live subjects.
  const canOpen = !isComingSoon && !isPlaceholder;
  const href = canOpen ? course.fullLink : undefined;
  const badgeLabel = isComingSoon ? 'เร็วๆ นี้' : isPartial ? 'เปิดบางวิชา' : null;
  const note = isComingSoon
    ? 'คอร์สนี้ยังไม่เปิดบนแพลตฟอร์ม Next.js'
    : isPartial
      ? 'ย้ายข้อมูลแล้วบางส่วน — เปิดให้เรียนเฉพาะวิชาที่พร้อมใช้งาน'
      : null;

  const cardInner = (
    <>
      <div className={`card-bar ${themeClass}`} />
      {badgeLabel && (
        <span className="coming-soon-tag" aria-label={badgeLabel}>
          {badgeLabel}
        </span>
      )}
      <div className="card-image">
        <div className={`card-badge ${themeClass}`}>{course.category}</div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={course.image} alt={course.title} loading="lazy" width={96} height={96} />
        <div className="card-date">
          <CalendarIcon />
          <span>{course.updated}</span>
        </div>
      </div>
      <div className="card-body">
        <div className={`card-type ${themeClass}${isComingSoon ? ' is-coming-soon' : ''}`}>
          {course.type}
          {!isComingSoon && <span className="free-tag">เรียนฟรี</span>}
        </div>
        <h3 className="card-title">{course.title}</h3>
        <div className="card-subtitle">{course.subtitle}</div>
        <div className="card-meta">
          {typeof course.subjects === 'number' && (
            <span className="card-meta-item">
              <BookIcon />
              <span><strong>{course.subjects}</strong> วิชา</span>
            </span>
          )}
        </div>
        <p className="card-desc">{course.desc}</p>
        {course.tags.length > 0 && (
          <div className="card-tags">
            {course.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="card-tag">
                {tag}
              </span>
            ))}
            {course.moreTags && <span className="card-tag">{course.moreTags}</span>}
          </div>
        )}
        {note && (
          <p className="card-coming-soon-note">{note}</p>
        )}
        <div className="card-footer">
          <div className="card-free">{isComingSoon ? 'เตรียมเปิดคอร์ส' : 'เข้าเรียนได้ทันที'}</div>
          <span className={`card-btn ${themeClass}`}>
            {isComingSoon ? 'รออัปเดต' : 'เริ่มเรียน'}
            <ArrowIcon />
          </span>
        </div>
      </div>
    </>
  );

  if (!href) {
    return (
      <div
        className="course-card is-coming-soon coming-soon"
        data-theme={themeClass}
        aria-disabled="true"
        data-analytics-event="click_locked_course"
        data-analytics-label={`course_${course.id}`}
        data-analytics-section-name="courses"
      >
        {cardInner}
      </div>
    );
  }

  return (
    <a
      href={href}
      className="course-card"
      data-theme={themeClass}
      data-analytics-event="click_course"
      data-analytics-label={`course_${course.id}`}
      data-analytics-section-name="courses"
      data-analytics-destination={href}
      // External link → opens in same tab so the user lands on the platform
      // and can use the back button to return to the marketing homepage.
      target={href.startsWith('http') ? '_self' : undefined}
      rel={href.startsWith('http') ? 'noopener' : undefined}
    >
      {cardInner}
    </a>
  );
}

export function CourseGrid() {
  const previewCourses = VISIBLE_COURSES.slice(0, 4);

  return (
    <section id="courses" className="courses-section" data-analytics-section="courses">
      <div className="container">
        <div className="courses-header">
          <div>
            <div className="section-label">คอร์สเรียน</div>
            <h2 className="section-title">เลือกเนื้อหาที่คุณสนใจ</h2>
            <p className="section-subtitle">
              เนื้อหาสรุปตรงประเด็น ข้อสอบพร้อมเฉลย ไม่เสียเวลากับสิ่งที่ไม่ออกสอบ
            </p>
          </div>
          {/* "ดูทั้งหมด" goes to the platform home, not a homepage route —
              the homepage has no /courses route (this site is marketing only,
              the actual learning content lives on slothmove-platform). */}
          <a
            href={PLATFORM_HOME_URL}
            className="section-link"
            data-analytics-event="click_view_all_courses"
            data-analytics-label="courses_view_all"
            data-analytics-section-name="courses"
            data-analytics-destination={PLATFORM_HOME_URL}
          >
            ดูทั้งหมด
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className="carousel">
          <div className="courses-grid" id="dynamic-courses-grid">
            {previewCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
