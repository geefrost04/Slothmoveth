'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { CourseConfig } from '@/lib/course-types';

export function PoliceAdminNav({ course }: { course: CourseConfig }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname() ?? '';
  const firstReadySubject = course.subjects.find((subject) => subject.count > 0);
  const segments = pathname.split('/').filter(Boolean); // ['courses', 'police_admin', ...]

  const isValidSubject =
    segments.length >= 3 &&
    segments[0] === 'courses' &&
    segments[1] === course.id &&
    course.subjects.some((s) => s.id === segments[2]);

  const examHref = isValidSubject
    ? `/courses/${course.id}/${segments[2]}/practices`
    : `/courses/${course.id}/mock-test`;

  const examLabel = isValidSubject ? 'เข้าลานฝึก' : 'จำลองสอบ';

  // Back-link context:
  //   /courses/police_admin                  → "/"  (SlothMove home)
  //   /courses/police_admin/<subject>        → "/courses/police_admin" (course hub)
  //   /courses/police_admin/<subject>/practices → "/courses/police_admin/<subject>" (subject page)
  //   /courses/police_admin/<subject>/<game>    → "/courses/police_admin/<subject>/practices" (practice hub)
  //   /courses/police_admin/leaderboard        → "/courses/police_admin" (course hub)
  const isSubjectGame =
    segments.length >= 4 && segments[0] === 'courses' && segments[1] === course.id;
  const isPractices =
    segments.length === 4 &&
    segments[0] === 'courses' &&
    segments[1] === course.id &&
    segments[3] === 'practices';
  const isSubjectHub =
    segments.length === 3 && segments[0] === 'courses' && segments[1] === course.id;
  const isCourseHub =
    segments.length === 2 && segments[0] === 'courses' && segments[1] === course.id;

  const backHref = isPractices
    ? `/courses/${course.id}/${segments[2]}`
    : isSubjectGame
      ? `/courses/${course.id}/${segments[2]}/practices`
      : isSubjectHub
        ? `/courses/${course.id}`
        : isCourseHub
          ? '/'
          : `/courses/${course.id}`;

  const backLabel = isPractices
    ? 'กลับไปหน้าเนื้อหา'
    : isSubjectGame
      ? 'กลับไปลานฝึก'
      : isSubjectHub
        ? 'กลับไปเลือกเนื้อหา'
        : isCourseHub
          ? 'กลับหน้าแรก'
          : 'ย้อนกลับ';

  function openDonate() {
    setMobileOpen(false);
    window.dispatchEvent(new CustomEvent('slothmove:donate'));
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMobileOpen(false);
      }
    }
    function onResize() {
      if (window.innerWidth > 700) setMobileOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <nav className="course-nav is-police-admin is-v3-nav">
      <div className="container course-nav-inner">
        <Link href={`/courses/${course.id}`} className="course-nav-brand">
          <img src="/pic/slothmove_mascot.png" alt="Sloth × Police" className="course-nav-brand-mascot" />
          <img src={course.theme.logo} alt={course.title} className="course-nav-brand-logo" />
          <span className="course-nav-brand-copy">
            <strong>Sloth <span className="course-nav-brand-x">×</span> <span className="course-nav-brand-accent">Police</span></strong>
          </span>
        </Link>

        <div className="course-nav-actions">
          <Link
            href={backHref}
            className="course-nav-action course-nav-home"
          >
            <span className="course-nav-label">{backLabel}</span>
          </Link>

          <Link href={examHref} className="course-nav-action course-nav-exam">
            <span className="course-nav-label">{examLabel}</span>
          </Link>

          <a
            href="https://www.facebook.com/profile.php?id=61589670089745"
            target="_blank"
            rel="noopener noreferrer"
            className="course-nav-action course-nav-facebook"
            aria-label="Facebook"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          </a>

          <button type="button" className="course-nav-action course-nav-donate" onClick={openDonate}>
            <span aria-hidden="true">☕</span><span className="course-nav-label">เลี้ยงกาแฟ</span>
          </button>
        </div>

        <div className="course-nav-mobile-controls">
          {!isCourseHub && (
            <Link href={backHref} className="course-nav-mobile-home" aria-label={backLabel}>
              <span aria-hidden="true">←</span>
            </Link>
          )}
          <button
            type="button"
            className={`course-nav-hamburger${mobileOpen ? ' is-open' : ''}`}
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
            aria-expanded={mobileOpen}
            aria-controls="course-mobile-menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        id="course-mobile-menu"
        className={`course-mobile-menu${mobileOpen ? ' is-open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        <div className="course-mobile-menu-head">
          <div>
            <strong>เมนูคอร์ส</strong>
            <span>{course.id.toUpperCase()} · {course.title}</span>
          </div>
          <span className="course-mobile-menu-badge">เรียนฟรี</span>
        </div>
        <div className="course-mobile-menu-list">
          {!isCourseHub && (
            <Link href={backHref} onClick={() => setMobileOpen(false)}>
              <span className="course-mobile-menu-icon">←</span>
              <span><strong>{backLabel}</strong><small>ย้อนกลับการนำทาง</small></span>
              <i>→</i>
            </Link>
          )}
          <button type="button" onClick={openDonate}>
            <span className="course-mobile-menu-icon">☕</span>
            <span><strong>เลี้ยงกาแฟ</strong><small>สนับสนุนให้เนื้อหาเปิดฟรีต่อไป</small></span>
            <i>→</i>
          </button>
          <a
            href="https://www.facebook.com/profile.php?id=61589670089745"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
          >
            <span className="course-mobile-menu-icon">f</span>
            <span><strong>Facebook</strong><small>ติดตามข่าวสารและอัปเดตจากเพจ</small></span>
            <i>→</i>
          </a>
          <Link href={examHref} className="is-primary" onClick={() => setMobileOpen(false)}>
            <span className="course-mobile-menu-icon">✦</span>
            <span>
              <strong>{examLabel}</strong>
              <small>
                {isValidSubject ? 'เข้าสู่ลานฝึกซ้อมทำข้อสอบวิชานี้' : 'เริ่มทำข้อสอบจำลองสนามจริง'}
              </small>
            </span>
            <i>→</i>
          </Link>
        </div>
      </div>
    </nav>
  );
}
