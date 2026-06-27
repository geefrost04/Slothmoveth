import Link from 'next/link';
import type { CourseConfig } from '@/lib/course-types';

export function CourseFooter({ course }: { course: CourseConfig }) {
  return (
    <footer className="course-footer">
      <div className="container course-footer-inner">
        <div className="course-footer-brand">
          <img src={course.theme.logo} alt="" aria-hidden="true" />
          <div>
            <strong>Sloth<span>Move</span></strong>
            <p>{course.title} · เรียนฟรีและทบทวนได้ทุกเวลา</p>
          </div>
        </div>
        <div className="course-footer-links">
          <Link href={`/courses/${course.id}`}>หน้าคอร์ส</Link>
          <Link href={`/courses/${course.id}#course-content`}>รายวิชา</Link>
          <a href="https://www.facebook.com/profile.php?id=61589670089745" target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
        </div>
      </div>
      <div className="container course-footer-bottom">
        <span>© 2026 SlothMove</span>
        <a href="#top">กลับด้านบน ↑</a>
      </div>
    </footer>
  );
}
