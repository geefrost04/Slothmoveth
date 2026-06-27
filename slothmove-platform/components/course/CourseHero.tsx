import type { CourseConfig } from '@/lib/course-types';

export function CourseHero({ course }: { course: CourseConfig }) {
  const metaItems = [`อัปเดตล่าสุด: ${course.meta.updated}`, `${course.meta.totalSubjects} วิชา`];
  if (!course.meta.hideQuestionCounts) {
    metaItems.push(`${course.meta.totalQuestions}+ ข้อสอบ`);
  }

  return (
    <section
      className="course-hero"
      style={course.theme.mascot ? ({ '--hero-image-url': `url(${course.theme.mascot})` } as React.CSSProperties) : undefined}
    >
      <div className="container course-hero-grid">
        <div className="course-hero-copy">
          <span className="course-hero-badge">{course.category}</span>
          <h1 className="course-hero-title">{course.title}</h1>
          <p className="course-hero-tagline">{course.subtitle}</p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 15, marginBottom: 24 }}>
            {metaItems.join(' · ')}
          </p>
          <a href="#subjects" className="btn btn-primary">เริ่มเรียนเลย →</a>
        </div>
      </div>
    </section>
  );
}
