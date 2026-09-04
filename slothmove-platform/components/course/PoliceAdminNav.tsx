'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import type { CourseConfig } from '@/lib/course-types';
import { getSupabase } from '@/lib/supabase';
import { NavControlIcon } from '@/components/nav/NavControlIcons';
import { SlothMoveLogo } from '@/components/brand/SlothMoveLogo';

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function ArrowBackIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function SparkleExamIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function PoliceAdminNav({ course }: { course: CourseConfig }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState('');
  const pathname = usePathname() ?? '';
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

    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => {
      void applySession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const isValidSubject =
    segments.length >= 3 &&
    segments[0] === 'courses' &&
    segments[1] === course.id &&
    course.subjects.some((s) => s.id === segments[2]);

  const examHref = isValidSubject
    ? `/courses/${course.id}/${segments[2]}/practices`
    : `/courses/${course.id}/mock-test`;

  const examLabel = isValidSubject ? 'เข้าลานฝึก' : 'จำลองสอบ 150 ข้อ';

  const isSubjectGame =
    segments.length >= 4 && segments[0] === 'courses' && segments[1] === course.id;
  const isPractices =
    segments.length === 4 &&
    segments[0] === 'courses' &&
    segments[1] === course.id &&
    segments[3] === 'practices';
  const isMathSetOne =
    segments.length === 4 &&
    segments[0] === 'courses' &&
    segments[1] === course.id &&
    segments[2] === 'math' &&
    segments[3] === 'set-1';
  const isMathSetOneExam =
    segments.length === 5 &&
    segments[0] === 'courses' &&
    segments[1] === course.id &&
    segments[2] === 'math' &&
    segments[3] === 'exams' &&
    segments[4].startsWith('police-math-category-');
  const isSubjectHub =
    segments.length === 3 && segments[0] === 'courses' && segments[1] === course.id;
  const isCourseHub =
    segments.length === 2 && segments[0] === 'courses' && segments[1] === course.id;

  const backHref = isMathSetOne
    ? `/courses/${course.id}/math`
    : isMathSetOneExam
      ? `/courses/${course.id}/math/set-1`
      : isPractices
    ? `/courses/${course.id}/${segments[2]}`
    : isSubjectGame
      ? `/courses/${course.id}/${segments[2]}/practices`
      : isSubjectHub
        ? `/courses/${course.id}`
        : isCourseHub
          ? '/'
          : `/courses/${course.id}`;

  const backLabel = isMathSetOne
    ? 'กลับหน้าวิชา'
    : isMathSetOneExam
      ? 'กลับไป Set 1'
      : isPractices
    ? 'กลับไปหน้าเนื้อหา'
    : isSubjectGame
      ? 'กลับไปลานฝึก'
      : isSubjectHub
        ? 'กลับไปเลือกเนื้อหา'
        : isCourseHub
          ? 'กลับหน้าแรก'
          : 'ย้อนกลับ';

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
      if (window.innerWidth > 900) setMobileOpen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <nav className={`course-nav is-police-admin is-v3-nav${mobileOpen ? ' is-mobile-open' : ''}`}>
      <div className="container course-nav-inner">
        {/* Unified Master Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" className="course-nav-brand" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }} aria-label="กลับหน้าแรก SlothMove">
            <SlothMoveLogo size={28} />
          </Link>

          {/* Elegant Course Context Badge */}
          <Link
            href={`/courses/${course.id}`}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: '999px',
              background: '#fff1f2',
              border: '1px solid #fed1d6',
              color: '#881337',
              fontSize: '11.5px',
              fontWeight: 800,
              textDecoration: 'none',
              letterSpacing: '0.01em'
            }}
            title="สนามสอบนายสิบตำรวจ สายอำนวยการ"
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#7a1822', display: 'inline-block' }} />
            <span>นายสิบตำรวจ (อก.)</span>
          </Link>
        </div>

        {/* Desktop Context Navigation / Back Link */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexGrow: 1, marginLeft: '16px' }} className="course-nav-desktop-back-container">
          {!isCourseHub && (
            <Link
              href={backHref}
              className="course-nav-back-btn-desktop"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                color: '#475569',
                fontSize: '12.5px',
                fontWeight: 700,
                textDecoration: 'none',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 900 }}>←</span>
              <span>{backLabel}</span>
            </Link>
          )}
        </div>

        {/* Unified Desktop Actions */}
        <div className="course-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link
            href="/courses"
            className="course-nav-action"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0 12px',
              height: '40px',
              borderRadius: '10px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#334155',
              fontSize: '12.5px',
              fontWeight: 700,
              textDecoration: 'none'
            }}
            title="ดูสนามสอบทั้งหมด"
          >
            <NavControlIcon type="exam" />
            <span className="course-nav-label">สนามสอบ</span>
          </Link>

          <Link
            href={`/courses/${course.id}/mock-test`}
            className="course-nav-action"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0 12px',
              height: '40px',
              borderRadius: '10px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#7a1822',
              fontSize: '12.5px',
              fontWeight: 750,
              textDecoration: 'none'
            }}
            title="Mock Test จำลองสนามจริง 150 ข้อ"
          >
            <SparkleExamIcon />
            <span className="course-nav-label">Mock Test</span>
          </Link>

          <Link
            href="/dashboard"
            className="course-nav-action"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0 12px',
              height: '40px',
              borderRadius: '10px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#334155',
              fontSize: '12.5px',
              fontWeight: 700,
              textDecoration: 'none'
            }}
            title="แดชบอร์ดสถิติและการวิเคราะห์ผล"
          >
            <NavControlIcon type="dashboard" />
            <span className="course-nav-label">Dashboard</span>
          </Link>

          <Link
            href={user ? '/dashboard' : '/login'}
            className="course-nav-action course-nav-profile"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0 12px',
              height: '40px',
              borderRadius: '10px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#334155',
              fontSize: '12.5px',
              fontWeight: 700,
              textDecoration: 'none'
            }}
            aria-label="บัญชีผู้ใช้"
          >
            <NavControlIcon type="account" />
            <span className="course-nav-label">
              {user ? displayName || 'สมาชิก' : 'เข้าสู่ระบบ'}
            </span>
          </Link>

          {user ? (
            <button
              onClick={handleLogout}
              className="course-nav-action course-nav-logout"
              type="button"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0 12px',
                height: '40px',
                borderRadius: '10px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#64748b',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              aria-label="ออกจากระบบ"
            >
              <NavControlIcon type="logout" />
              <span className="course-nav-label">ออกจากระบบ</span>
            </button>
          ) : (
            <Link
              href="/register"
              className="course-nav-action"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0 14px',
                height: '40px',
                borderRadius: '10px',
                background: '#16a34a',
                border: '1px solid #16a34a',
                color: '#ffffff',
                fontSize: '12.5px',
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(22, 163, 74, 0.2)'
              }}
            >
              <span className="course-nav-label">สมัครฟรี</span>
            </Link>
          )}
        </div>

        {/* Mobile Controls */}
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

      <button
        type="button"
        className={`course-mobile-menu-backdrop${mobileOpen ? ' is-open' : ''}`}
        onClick={() => setMobileOpen(false)}
        aria-label="ปิดเมนู"
        tabIndex={mobileOpen ? 0 : -1}
      />

      {/* Modern Mobile Drawer */}
      <div
        id="course-mobile-menu"
        className={`course-mobile-menu${mobileOpen ? ' is-open' : ''}`}
        aria-hidden={!mobileOpen}
      >
        <div className="course-mobile-menu-head">
          <div>
            <span className="course-mobile-menu-kicker">SLOTHMOVE PLATFORM</span>
            <strong>เมนูนำทาง</strong>
            <span>นายสิบตำรวจ (สายอำนวยการ)</span>
          </div>
          <button
            type="button"
            className="course-mobile-menu-close"
            onClick={() => setMobileOpen(false)}
            aria-label="ปิดเมนู"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <div className="course-mobile-menu-list">
          <Link href="/" onClick={() => setMobileOpen(false)}>
            <span className="course-mobile-menu-icon" aria-hidden="true"><HomeIcon /></span>
            <span><strong>หน้าแรก SlothMove</strong><small>กลับสู่หน้าหลักของเว็บไซต์</small></span>
            <i>→</i>
          </Link>

          {!isCourseHub && (
            <Link href={backHref} onClick={() => setMobileOpen(false)}>
              <span className="course-mobile-menu-icon"><ArrowBackIcon /></span>
              <span><strong>{backLabel}</strong><small>ย้อนกลับไปยังหน้าที่แล้ว</small></span>
              <i>→</i>
            </Link>
          )}

          <Link href={`/courses/${course.id}`} onClick={() => setMobileOpen(false)}>
            <span className="course-mobile-menu-icon" aria-hidden="true"><SparkleExamIcon /></span>
            <span><strong>หน้ารวม 6 วิชาตำรวจ</strong><small>เข้าดูเนื้อหาและสถิติรายหมวด</small></span>
            <i>→</i>
          </Link>

          <Link href={`/courses/${course.id}/mock-test`} className="is-primary" onClick={() => setMobileOpen(false)}>
            <span className="course-mobile-menu-icon">✦</span>
            <span><strong>Mock Test 150 ข้อ</strong><small>จำลองสนามสอบจริง จับเวลา 3 ชม.</small></span>
            <i>→</i>
          </Link>

          <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
            <span className="course-mobile-menu-icon" aria-hidden="true"><NavControlIcon type="dashboard" /></span>
            <span><strong>Dashboard ของฉัน</strong><small>ดูสถิติ, ประวัติสอบ, และวิเคราะห์จุดอ่อน</small></span>
            <i>→</i>
          </Link>

          <Link href={user ? '/dashboard' : '/login'} onClick={() => setMobileOpen(false)}>
            <span className="course-mobile-menu-icon" aria-hidden="true"><NavControlIcon type="account" /></span>
            <span>
              <strong>{user ? displayName || 'สมาชิก' : 'เข้าสู่ระบบ / สมัครฟรี'}</strong>
              <small>{user ? 'จัดการบัญชีและข้อมูลส่วนตัว' : 'เข้าสู่ระบบเพื่อบันทึกประวัติข้ามอุปกรณ์'}</small>
            </span>
            <i>→</i>
          </Link>

          <a
            href="https://www.facebook.com/profile.php?id=61589670089745"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
          >
            <span className="course-mobile-menu-icon"><FacebookIcon /></span>
            <span><strong>Facebook Page</strong><small>ติดตามข่าวสารและอัปเดตจากทีมงาน</small></span>
            <i>→</i>
          </a>
        </div>
      </div>
    </nav>
  );
}
