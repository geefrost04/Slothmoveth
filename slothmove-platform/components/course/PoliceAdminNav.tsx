'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { CourseConfig } from '@/lib/course-types';
import { getSupabase } from '@/lib/supabase';
import { NavControlIcon } from '@/components/nav/NavControlIcons';

export function PoliceAdminNav({ course }: { course: CourseConfig }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState('');
  const pathname = usePathname() ?? '';
  const firstReadySubject = course.subjects.find((subject) => subject.count > 0);
  const segments = pathname.split('/').filter(Boolean); // ['courses', 'police_admin', ...]

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;
    const client = supabase;

    async function applySession(session: Session | null) {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      if (!sessionUser) {
        setDisplayName('');
        return;
      }

      const sessionName =
        sessionUser.user_metadata?.full_name ||
        sessionUser.user_metadata?.name ||
        sessionUser.email?.split('@')[0] ||
        'สมาชิก';
      setDisplayName(sessionName);

      const { data: profile } = await client
        .from('profiles')
        .select('full_name')
        .eq('id', sessionUser.id)
        .maybeSingle();
      if (profile?.full_name) setDisplayName(profile.full_name);
    }

    client.auth.getSession().then(({ data: { session } }) => applySession(session));

    // Listen for auth changes
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      void applySession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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

  async function handleLogout(e: React.MouseEvent) {
    e.preventDefault();
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        // ignore
      }
    }
    setUser(null);
    window.location.href = '/';
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
        <Link href={`/courses/${course.id}`} className="course-nav-brand" style={{ textDecoration: 'none' }}>
          <span className="course-nav-wordmark" style={{ display: 'inline-flex', alignItems: 'center', fontSize: '20px', fontWeight: 900, letterSpacing: '-0.02em' }}>
            SLOTH<span style={{ color: '#7a1822' }}>MOVE</span>
          </span>
        </Link>

        {/* Desktop Back Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexGrow: 1, marginLeft: '24px' }} className="course-nav-desktop-back-container">
          <Link
            href={backHref}
            className="course-nav-back-btn-desktop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              background: '#fde7ea',
              color: '#7a1822',
              fontSize: '13px',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 1px 2px rgba(122, 24, 34, 0.05)',
              transition: 'all 0.2s'
            }}
          >
            <span style={{ fontSize: '15px', fontWeight: 900 }}>←</span>
            <span>{backLabel}</span>
          </Link>
        </div>

        <div className="course-nav-actions">
          <Link href={user ? '/dashboard' : '/login'} className="course-nav-action course-nav-profile" aria-label="บัญชีผู้ใช้">
            <NavControlIcon type="account" />
            <span className="course-nav-label">
              {user ? displayName || 'สมาชิก' : 'เข้าสู่ระบบ'}
            </span>
          </Link>

          {user && (
            <button
              onClick={handleLogout}
              className="course-nav-action course-nav-logout"
              type="button"
              aria-label="ออกจากระบบ"
            >
              <NavControlIcon type="logout" />
              <span className="course-nav-label">ออกจากระบบ</span>
            </button>
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
          <span className="course-mobile-menu-badge">เริ่มเรียนฟรี</span>
        </div>
        <div className="course-mobile-menu-list">
          <Link href="/" onClick={() => setMobileOpen(false)}>
            <span className="course-mobile-menu-icon">🏠</span>
            <span><strong>หน้าแรก SlothMove</strong><small>กลับสู่หน้าหลักของเว็บไซต์</small></span>
            <i>→</i>
          </Link>
          {!isCourseHub && (
            <Link href={backHref} onClick={() => setMobileOpen(false)}>
              <span className="course-mobile-menu-icon">←</span>
              <span><strong>{backLabel}</strong><small>ย้อนกลับการนำทาง</small></span>
              <i>→</i>
            </Link>
          )}
          <Link href={user ? '/dashboard' : '/login'} onClick={() => setMobileOpen(false)}>
            <span className="course-mobile-menu-icon">👤</span>
            <span>
              <strong>{user ? displayName || 'สมาชิก' : 'เข้าสู่ระบบ'}</strong>
              <small>{user ? 'ดูประวัติผลการสอบและชุดข้อสอบ' : 'เข้าสู่ระบบเพื่อบันทึกประวัติการสอบ'}</small>
            </span>
            <i>→</i>
          </Link>
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
