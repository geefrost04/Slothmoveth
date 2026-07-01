'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import type { CourseConfig } from '@/lib/course-types';

export function CourseNav({ course }: { course: CourseConfig }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [practiceOpen, setPracticeOpen] = useState(false);
  const practiceRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname() ?? '';
  const firstReadySubject = course.subjects.find((subject) => subject.count > 0);
  const segments = pathname.split('/').filter(Boolean); // ['courses', 'pab', ...]
  const isValidSubject = segments.length >= 3 && segments[0] === 'courses' && segments[1] === course.id && course.subjects.some((s) => s.id === segments[2]);
  const currentSubjectId =
    isValidSubject
      ? segments[2]
      : firstReadySubject?.id;
  const isDropdown = false;
  const isCourseLanding = segments.length === 2 && segments[0] === 'courses' && segments[1] === course.id;
  const examHref = (course.id === 'police_admin')
    ? (isValidSubject
      ? `/courses/${course.id}/${segments[2]}/${isDropdown ? 'practices' : 'quiz'}`
      : `/courses/${course.id}/mock-test`)
    : currentSubjectId
      ? `/courses/${course.id}/${currentSubjectId}/${isDropdown ? 'practices' : 'quiz'}`
      : `/courses/${course.id}#course-content`;

  const isMinimalNav = true;
  const examLabel = isDropdown ? 'ลานฝึก' : 'ทำข้อสอบ';
  const examIcon = '✦';

  // Back-link context:
  //   /courses/pab                  → "/"  (SlothMove home) — for minimal nav
  //   /courses/pab/<subject>        → "/courses/pab" (course hub)
  //   /courses/police_admin/<subject>/practices → "/courses/police_admin/<subject>" (subject page)
  //   /courses/police_admin/<subject>/<game>    → "/courses/police_admin/<subject>/practices" (practice hub)
  //   /courses/pab/<subject>/<game>             → "/courses/pab/<subject>" (subject page)
  //   /courses/<id>/leaderboard                  → "/courses/<id>" (course hub)
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

  // police_admin has a dedicated practice hub — back from a game should land there;
  // from the practice hub itself, back goes to the subject page.
  // other courses fall back to the subject page.
  const backHref = isPractices
    ? `/courses/${course.id}/${segments[2]}`
    : isSubjectGame
      ? course.id === 'police_admin'
        ? `/courses/${course.id}/${segments[2]}/practices`
        : `/courses/${course.id}/${segments[2]}`
      : isSubjectHub
        ? `/courses/${course.id}`
        : isCourseHub
          ? '/'
          : `/courses/${course.id}`;
  const backLabel = isPractices
    ? 'ย้อนกลับไปหน้าเนื้อหา'
    : isSubjectGame
      ? course.id === 'police_admin'
        ? 'ย้อนกลับไปลานฝึก'
        : 'ย้อนกลับไปหน้าเนื้อหา'
      : isSubjectHub
        ? 'ย้อนกลับไปเลือกเนื้อหา'
        : isCourseHub
          ? 'กลับไป SlothMove หน้าหลัก'
          : 'ย้อนกลับ';

  // Build game map for dropdown: lookup labelTh by gameId
  const gameMeta = new Map<string, { labelTh: string; desc: string }>();
  for (const game of course.games) {
    gameMeta.set(game.id, { labelTh: game.labelTh, desc: game.desc });
  }

  // Brand "X" partner name — readable per course
  const brandPartner = course.id === 'pab' ? 'PAB' : course.id === 'police_admin' ? 'Police' : course.id.toUpperCase();

  function openDonate() {
    setMobileOpen(false);
    window.dispatchEvent(new CustomEvent('slothmove:donate'));
  }

  function closePracticeDropdown() {
    setPracticeOpen(false);
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        setPracticeOpen(false);
      }
    }
    function onResize() {
      if (window.innerWidth > 700) setMobileOpen(false);
    }
    function onClickOutside(event: MouseEvent) {
      if (practiceRef.current && !practiceRef.current.contains(event.target as Node)) {
        setPracticeOpen(false);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, []);

  // Close dropdown when route changes
  useEffect(() => {
    setPracticeOpen(false);
  }, [pathname]);

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
            {!isMinimalNav && <span className="course-nav-label">{backLabel}</span>}
          </Link>
          {!isMinimalNav && (
            <Link href={`/courses/${course.id}/leaderboard`} className="course-nav-action course-nav-leaderboard">
              <span aria-hidden="true">🏅</span><span className="course-nav-label">กระดานคะแนน</span>
            </Link>
          )}
          <button type="button" className="course-nav-action course-nav-donate" onClick={openDonate}>
            <span aria-hidden="true">☕</span><span className="course-nav-label">เลี้ยงกาแฟ</span>
          </button>

          {/* ทำข้อสอบ — Dropdown for police_admin, link for other courses */}
          {isDropdown ? (
            <div className="course-nav-dropdown" ref={practiceRef}>
              <button
                type="button"
                className={`course-nav-action course-nav-exam course-nav-dropdown-trigger${practiceOpen ? ' is-open' : ''}`}
                onClick={() => setPracticeOpen((open) => !open)}
                aria-haspopup="true"
                aria-expanded={practiceOpen}
                aria-controls="course-practice-panel"
              >
                <span className="course-nav-label">{examLabel}</span>
                <span aria-hidden="true" className="course-nav-caret">▾</span>
              </button>
              {practiceOpen ? (() => {
                // Show games only for the current subject (or first ready subject at hub)
                const currentSubject = course.subjects.find((s) => s.id === currentSubjectId)
                  ?? firstReadySubject;
                if (!currentSubject) return null;
                const subjectGameIds = currentSubject.games ?? course.games.filter((g) => g.status === 'full').map((g) => g.id);
                const currentGames = subjectGameIds
                  .map((gameId) => gameMeta.get(gameId))
                  .filter((meta): meta is { labelTh: string; desc: string } => Boolean(meta));
                // Hide "ดูหน้า Practices" link when already on a practices page (avoid self-link)
                const isOnPractices = pathname.includes(`/${currentSubject.id}/practices`);
                return (
                  <div id="course-practice-panel" className="course-nav-dropdown-panel" role="menu">
                    <div className="course-nav-dropdown-head">
                      <strong>{currentSubject.title}</strong>
                      {!isOnPractices ? (
                        <Link
                          href={`/courses/${course.id}/${currentSubject.id}/practices`}
                          className="course-nav-dropdown-head-link"
                          onClick={closePracticeDropdown}
                        >
                          เข้าสู่ลานฝึก <span aria-hidden="true">→</span>
                        </Link>
                      ) : null}
                    </div>
                    <div className="course-nav-dropdown-list course-nav-dropdown-list-single">
                      {currentGames.map((meta, index) => {
                        const gameId = subjectGameIds[index];
                        const href = `/courses/${course.id}/${currentSubject.id}/${gameId}`;
                        const isCurrent =
                          segments[2] === currentSubject.id && segments[3] === gameId;
                        return (
                          <Link
                            key={gameId}
                            href={href}
                            className={`course-nav-dropdown-item${isCurrent ? ' is-current' : ''}`}
                            role="menuitem"
                            onClick={closePracticeDropdown}
                          >
                            <span className="course-nav-dropdown-item-name">{meta.labelTh}</span>
                            <span className="course-nav-dropdown-item-desc">{meta.desc}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                );
              })() : null}
            </div>
          ) : (
            <Link href={examHref} className="course-nav-action course-nav-exam">
              {examIcon && <span aria-hidden="true">{examIcon}</span>}<span className="course-nav-label">{examLabel}</span>
            </Link>
          )}

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
              <span><strong>{backLabel}</strong><small>กลับไปเลือกวิชาอื่น</small></span>
              <i>→</i>
            </Link>
          )}
          {!isMinimalNav && (
            <Link href={`/courses/${course.id}/leaderboard`} onClick={() => setMobileOpen(false)}>
              <span className="course-mobile-menu-icon">🏅</span>
              <span><strong>กระดานคะแนน</strong><small>ดูอันดับคะแนนผู้เข้าสอบ {course.id.toUpperCase()}</small></span>
              <i>→</i>
            </Link>
          )}
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
                {isDropdown ? 'เปิดสารบัญเกมฝึกของวิชานี้' : 'เริ่มทำข้อสอบของวิชานี้'}
              </small>
            </span>
            <i>→</i>
          </Link>
        </div>
      </div>
    </nav>
  );
}
