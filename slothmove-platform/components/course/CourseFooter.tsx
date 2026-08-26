import type { CourseConfig } from '@/lib/course-types';
import Link from 'next/link';

export function CourseFooter({ course }: { course: CourseConfig }) {
  if (course.id === 'police_admin') {
    return (
      <footer className="police-v3-footer" id="footer">
        <div className="container">
          <div className="police-v3-footer-inner">
            <div className="police-v3-footer-brand-section">
              <Link href={`/courses/${course.id}`} className="police-v3-footer-mark">
                <img
                  src="/pic/slothmove_mascot.png"
                  alt="SlothMove"
                  width={28}
                  height={28}
                  style={{ objectFit: 'contain' }}
                />
              </Link>
              <strong>SLOTH<span>MOVE</span></strong>
              <span className="police-v3-footer-tagline">เริ่มฝึกฟรี · เลือกชุดฝึกเมื่อพร้อม</span>
            </div>

            <div className="police-v3-footer-navigation">
              <Link href="/">หน้าแรก</Link>
              <span className="separator">·</span>
              <Link href={`/courses/${course.id}`}>สนามสอบ</Link>
              <span className="separator">·</span>
              <a
                href="https://www.facebook.com/profile.php?id=61589670089745"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
              <span className="separator">·</span>
              <a href="#top">กลับด้านบน ↑</a>
            </div>

            <div className="police-v3-footer-copyright">
              <span>© 2026 SlothMove. All rights reserved.</span>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  // Fallback to default global footer styling
  return (
    <footer className="footer" id="footer">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-brand-section">
            <Link href="/" className="footer-brand-logo">
              <img
                src="/pic/slothmove_mascot.png"
                alt="SlothMove"
                width={28}
                height={28}
                style={{ objectFit: 'contain' }}
              />
              <strong>Sloth<span>Move</span></strong>
            </Link>
            <span className="footer-brand-tagline">เริ่มฝึกฟรี · เลือกชุดฝึกเมื่อพร้อม</span>
          </div>

          <div className="footer-navigation">
            <Link href="/">หน้าแรก</Link>
            <span className="separator">·</span>
            <Link href="/#exam-selection">สนามสอบ</Link>
            <span className="separator">·</span>
            <a
              href="https://www.facebook.com/profile.php?id=61589670089745"
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>
            <span className="separator">·</span>
            <a href="#top">กลับด้านบน ↑</a>
          </div>

          <div className="footer-copyright">
            <span>© 2026 SlothMove. All rights reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
