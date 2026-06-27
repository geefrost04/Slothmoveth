import Link from 'next/link';
import { VISIBLE_COURSES, Course } from '@/lib/courses';

function CourseCard({ course }: { course: Course }) {
  const isComingSoon = course.status === 'coming-soon';
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
        <img src={course.image} alt="" aria-hidden="true" />
      </div>
      <h3>{course.title}</h3>
      <p className="home-course-subtitle">{course.subtitle}</p>
      <p className="home-course-desc">{course.desc}</p>
      <div className="home-course-meta">
        {course.subjects ? <span><strong>{course.subjects}</strong> วิชา</span> : null}
        {course.questions ? <span><strong>{course.questions}+</strong> ข้อสอบ</span> : null}
        <span>{isComingSoon ? 'กำลังเตรียมเนื้อหา' : 'เรียนฟรี'}</span>
      </div>
      <div className="home-course-card-footer">
        <span>{course.type}</span>
        <strong>{isComingSoon ? 'เร็วๆ นี้' : 'เข้าคอร์ส →'}</strong>
      </div>
    </div>
  );

  const className = `home-course-card${isComingSoon ? ' is-coming-soon' : ''}`;
  return isDisabled ? (
    <div className={className} aria-disabled="true">{content}</div>
  ) : (
    <Link href={course.fullLink} className={className}>{content}</Link>
  );
}

export function CourseGrid() {
  return (
    <section id="courses" className="home-courses-section">
      <div className="container">
        <div className="home-section-header">
          <div>
            <div className="section-label">คอร์สเรียน</div>
            <h2 className="section-title">เลือกเนื้อหาที่คุณสนใจ</h2>
            <p className="section-subtitle">เนื้อหาสรุปตรงประเด็น ข้อสอบพร้อมเฉลย และเข้าเรียนได้ฟรี</p>
          </div>
          <span>{VISIBLE_COURSES.length} คอร์ส</span>
        </div>
      </div>
      <div className="container home-courses-grid">
        {VISIBLE_COURSES.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}
