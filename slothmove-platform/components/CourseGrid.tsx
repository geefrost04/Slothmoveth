import Link from 'next/link';
import { VISIBLE_COURSES, Course } from '@/lib/courses';
import { isCourseOpen } from '@/courses/registry';

function CourseCard({ course }: { course: Course }) {
  const isComingSoon = course.status === 'coming-soon' || !isCourseOpen(course.id);
  const isDisabled = isComingSoon || !course.fullLink || course.fullLink === '#';
  const updatedLabel = new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(new Date(`${course.updatedAt}T00:00:00`));

  const content = (
    <div className="home-course-card-body">
      <div className="home-course-card-header">
        <span className="home-course-updated">อัปเดต {updatedLabel}</span>
        <span className="home-course-category">{course.category}</span>
      </div>
      <div className="home-course-logo">
        <img src={course.image} alt={course.title} loading="lazy" decoding="async" />
      </div>
      <h3>
        {course.title}
        <span className="sr-only"> {course.subtitle}</span>
      </h3>
      <p className="home-course-subtitle">{course.subtitle}</p>
      <p className="home-course-desc">{course.desc}</p>
      <div className="home-course-meta">
        {course.subjects ? <span><strong>{course.subjects}</strong> วิชา</span> : null}
        <span>{isComingSoon ? 'Under maintenance' : 'เรียนฟรี'}</span>
      </div>
      <div className="home-course-card-footer">
        <span>{course.type}</span>
        <strong className="home-course-card-cta">{isComingSoon ? 'ปิดปรับปรุงชั่วคราว' : 'เข้าคอร์ส →'}</strong>
      </div>
    </div>
  );

  const className = `home-course-card${isComingSoon ? ' is-coming-soon' : ''}`;
  const cardLabel = `${course.title} ${course.subtitle}`;
  return isDisabled ? (
    <div className={className} aria-disabled="true" aria-label={cardLabel}>{content}</div>
  ) : (
    <Link href={course.fullLink} className={className} aria-label={cardLabel}>{content}</Link>
  );
}

export function CourseGrid({ previewOnly = false }: { previewOnly?: boolean }) {
  const coursesToRender = previewOnly ? VISIBLE_COURSES.slice(0, 3) : VISIBLE_COURSES;

  return (
    <section id="courses" className="home-courses-section">
      <div className="container">
        <div className="home-section-header">
          <div>
            <div className="section-label">คอร์สเรียน</div>
            <h2 className="section-title">{previewOnly ? 'คอร์สแนะนำ' : 'คอร์สเรียนทั้งหมด'}</h2>
            <p className="section-subtitle">เนื้อหาสรุปตรงประเด็น ข้อสอบพร้อมเฉลย และเข้าเรียนได้ฟรี</p>
          </div>
          {previewOnly ? (
            <Link
              href="/courses"
              className="inline-flex items-center gap-1 text-sm font-bold text-[#3d8c6c] hover:text-[#2d6f54] transition font-display"
            >
              ดูทั้งหมด ({VISIBLE_COURSES.length})
              <span aria-hidden="true" className="text-base">→</span>
            </Link>
          ) : (
            <span className="text-sm font-bold text-slate-400 font-display">
              {VISIBLE_COURSES.length} คอร์ส
            </span>
          )}
        </div>
      </div>
      <div className="container home-courses-grid">
        {coursesToRender.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
