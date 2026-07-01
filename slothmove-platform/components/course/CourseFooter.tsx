import Link from 'next/link';
import type { CourseConfig } from '@/lib/course-types';

export function CourseFooter({ course }: { course: CourseConfig }) {
  if (course.id === 'police_admin') {
    return (
      <footer className="course-footer police-footer">
        <div className="container police-footer-inner">
          <div className="police-footer-brand">
            <div className="police-footer-mark" aria-hidden="true">
              <img src="/pic/slothmove_mascot.png" alt="" />
            </div>
            <div>
              <strong>Sloth <span>× Police</span></strong>
              <p>คลังเนื้อหาและข้อสอบนายสิบตำรวจสายอำนวยการ</p>
            </div>
          </div>

          <div className="police-footer-links" aria-label="ลิงก์ท้ายหน้าแบบย่อ">
            <a href="https://www.facebook.com/profile.php?id=61589670089745" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            <a href="#top">กลับด้านบน ↑</a>
          </div>
        </div>

        <div className="container police-footer-bottom">
          <span>© 2026 SlothMove</span>
          <span>เรียนฟรี · ทบทวนได้ทุกเวลา</span>
        </div>
      </footer>
    );
  }

  if (course.id === 'ocsc') {
    return (
      <footer className="course-footer police-footer ocsc-footer">
        <div className="container police-footer-inner">
          <div className="police-footer-brand">
            <div className="police-footer-mark" aria-hidden="true">
              <img src="/pic/slothmove_mascot.png" alt="" />
            </div>
            <div>
              <strong>Sloth <span>× OCSC</span></strong>
              <p>คอร์สเตรียมสอบภาค ก. สำหรับสายข้าราชการพลเรือน</p>
            </div>
          </div>

          <div className="police-footer-links" aria-label="ลิงก์ท้ายหน้าแบบย่อ">
            <a href="https://www.facebook.com/profile.php?id=61589670089745" target="_blank" rel="noopener noreferrer">
              Facebook
            </a>
            <a href="#top">กลับด้านบน ↑</a>
          </div>
        </div>

        <div className="container police-footer-bottom">
          <span>© 2026 SlothMove</span>
          <span>ภาค ก · 3 วิชาหลัก · เรียนฟรี</span>
        </div>
      </footer>
    );
  }

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
