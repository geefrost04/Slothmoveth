'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { CourseConfig } from '@/lib/course-types';
import { useTheme } from '@/components/ThemeProvider';

export function PoliceAdminNav({ course }: { course: CourseConfig }) {
  const { theme, toggle } = useTheme();
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

  const examLabel = isValidSubject ? 'ลานฝึก' : 'ลองทำข้อสอบ';
  const examIcon = '✦';

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
    ? 'ย้อนกลับไปหน้าเนื้อหา'
    : isSubjectGame
      ? 'ย้อนกลับไปลานฝึก'
      : isSubjectHub
        ? 'ย้อนกลับไปเลือกเนื้อหา'
        : isCourseHub
          ? 'กลับไป SlothMove หน้าหลัก'
          : 'ย้อนกลับ';

  const brandPartner = course.id === 'police_admin' ? 'Police' : course.id.toUpperCase();

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
    <nav className="course-nav">
      <div className="container course-nav-inner">
        <Link href={`/courses/${course.id}`} className="course-nav-brand">
          <img src="/pic/slothmove_mascot.png" alt="Sloth × Police" className="course-nav-brand-mascot" />
          <img src={course.theme.logo} alt={course.title} className="course-nav-brand-logo" />
          <span className="course-nav-brand-copy">
            <strong><span>Sloth</span><i>×</i>{brandPartner}</strong>
            <small>{course.title}</small>
          </span>
        </Link>

        <div className="course-nav-actions">
          <Link
            href={backHref}
            className="course-nav-action course-nav-home"
            aria-label={backLabel}
          >
            <span aria-hidden="true">←</span>
          </Link>

          <button type="button" className="course-nav-action course-nav-donate" onClick={openDonate}>
            <span aria-hidden="true">☕</span><span className="course-nav-label">เลี้ยงกาแฟ</span>
          </button>

          <Link href={examHref} className="course-nav-action course-nav-exam">
            {examIcon && <span aria-hidden="true">{examIcon}</span>}
            <span className="course-nav-label">{examLabel}</span>
          </Link>

          <button
            type="button"
            className={`course-nav-theme${theme === 'dark' ? ' is-dark' : ''}`}
            onClick={toggle}
            aria-label="สลับโหมดมืด/สว่าง"
            aria-pressed={theme === 'dark'}
          >
            <span className="course-theme-sun" aria-hidden="true">☀</span>
            <span className="course-theme-moon" aria-hidden="true">☾</span>
            <span className="course-theme-knob" aria-hidden="true" />
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
          <button type="button" onClick={toggle} aria-pressed={theme === 'dark'}>
            <span className="course-mobile-menu-icon">{theme === 'dark' ? '☀' : '☾'}</span>
            <span>
              <strong>โหมดการแสดงผล</strong>
              <small>{theme === 'dark' ? 'กำลังใช้โหมดมืด' : 'กำลังใช้โหมดสว่าง'}</small>
            </span>
            <span className={`course-mobile-theme-switch${theme === 'dark' ? ' is-dark' : ''}`} aria-hidden="true">
              <i />
            </span>
          </button>
          <button type="button" onClick={openDonate}>
            <span className="course-mobile-menu-icon">☕</span>
            <span><strong>เลี้ยงกาแฟ</strong><small>สนับสนุนให้เนื้อหาเปิดฟรีต่อไป</small></span>
            <i>→</i>
          </button>
          <Link href={examHref} className="is-primary" onClick={() => setMobileOpen(false)}>
            {examIcon && <span className="course-mobile-menu-icon">{examIcon}</span>}
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
