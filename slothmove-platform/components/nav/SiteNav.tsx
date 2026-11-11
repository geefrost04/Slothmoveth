'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import type { CourseConfig } from '@/lib/course-types';
import { getSupabase } from '@/lib/supabase';
import { NavControlIcon } from '@/components/nav/NavControlIcons';
import { SlothMoveLogo } from '@/components/brand/SlothMoveLogo';
import { triggerDonatePrompt } from '@/lib/donate-prompt';
import styles from './SiteNav.module.css';

// One top bar for the whole site. Inside a course it adds the course chip, a back link
// and the course's main action (police: Mock Test, ONWR: Mini Mock).

type CourseNavMeta = {
  chip: string;
  accent: string;
  soft: string;
  line: string;
  hubTitle: string;
  hubNote: string;
  topicWord: string;
  primary: { label: string; href: string; title: string; note: string };
};

const COURSE_NAV: Record<string, CourseNavMeta> = {
  police_admin: {
    chip: 'นายสิบตำรวจ (อก.)',
    accent: '#7a1822',
    soft: '#fff1f2',
    line: '#fed1d6',
    hubTitle: 'หน้ารวม 6 วิชาตำรวจ',
    hubNote: 'Mock Test · Mini Mock · ข้อสอบรายวิชา',
    topicWord: 'วิชา',
    primary: { label: 'Mock Test', href: '/courses/police_admin/mock-test', title: 'Mock Test 150 ข้อ', note: 'จำลองสนามสอบจริง จับเวลา 3 ชม.' }
  },
  onwr: {
    chip: 'สทนช.',
    accent: '#0b5f86',
    soft: '#e3f3fa',
    line: '#bfe0ee',
    hubTitle: 'หน้ารวม 9 หัวข้อ สทนช.',
    hubNote: 'Mini Mock · Mini Drill · โน้ตและข้อสอบรายหัวข้อ',
    topicWord: 'หัวข้อ',
    primary: { label: 'Mini Mock', href: '/courses/onwr/mini-mock/onwr-mini_mock-set-01', title: 'Mini Mock 30 ข้อ', note: 'คละครบ 9 หัวข้อ จับเวลา 36 นาที' }
  },
  nesdc: {
    chip: 'สศช.',
    accent: '#5b3fa6',
    soft: '#f1ecfb',
    line: '#dcd0f3',
    hubTitle: 'หน้ารวม 7 หัวข้อ สศช.',
    hubNote: 'Mini Mock · Mini Drill · โน้ตและข้อสอบรายหัวข้อ',
    topicWord: 'หัวข้อ',
    primary: { label: 'Mini Mock', href: '/courses/nesdc/mini-mock/nesdc-mini_mock-set-01', title: 'Mini Mock 30 ข้อ', note: 'คละครบ 7 หัวข้อ จับเวลา 36 นาที' }
  },
  pat: {
    chip: 'กทท.',
    accent: '#163e7a',
    soft: '#e8eef8',
    line: '#d2dcec',
    hubTitle: 'หน้ารวม 7 หัวข้อ กทท.',
    hubNote: 'Mini Mock · โน้ตและข้อสอบรายหัวข้อ · ภาคปฏิบัติการ · สัมภาษณ์',
    topicWord: 'หัวข้อ',
    primary: { label: 'Mini Mock', href: '/courses/pat/mini-mock/pat-mini_mock-set-01', title: 'Mini Mock 30 ข้อ', note: 'คละครบ 7 หัวข้อ จับเวลา 36 นาที' }
  }
};

const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61589670089745';
const COURSE_LEVEL_PAGES = new Set(['mini-mock', 'mini-drill', 'mock-test', 'leaderboard']);

function metaFor(course: CourseConfig): CourseNavMeta {
  return COURSE_NAV[course.id] ?? {
    chip: course.title,
    accent: course.theme.primary,
    soft: course.theme.accentSoft,
    line: course.theme.accentSoft,
    hubTitle: `หน้ารวม ${course.title}`,
    hubNote: 'เนื้อหาและชุดข้อสอบ',
    topicWord: 'วิชา',
    primary: { label: 'ทำข้อสอบ', href: `/courses/${course.id}`, title: 'เลือกชุดข้อสอบ', note: course.title }
  };
}

// Where "back" goes from the current course page.
function backTarget(course: CourseConfig, segments: string[], topicWord: string): { href: string; label: string } | null {
  if (segments[0] !== 'courses' || segments[1] !== course.id || segments.length <= 2) return null;
  const hub = { href: `/courses/${course.id}`, label: 'กลับหน้าคอร์ส' };
  const area = segments[2];
  if (segments.length === 3 || COURSE_LEVEL_PAGES.has(area)) return hub;
  const subjectHref = `/courses/${course.id}/${area}`;
  // Police special cases kept from the old police nav.
  if (course.id === 'police_admin' && area === 'math' && segments[3] === 'set-1') return { href: subjectHref, label: 'กลับหน้าวิชา' };
  if (course.id === 'police_admin' && area === 'math' && segments[4]?.startsWith('police-math-category-')) return { href: `${subjectHref}/set-1`, label: 'กลับไป Set 1' };
  if (['summary', 'exams', 'practices'].includes(segments[3])) return { href: subjectHref, label: `กลับหน้า${topicWord}` };
  return { href: `${subjectHref}/practices`, label: 'กลับไปลานฝึก' };
}

function useSessionUser() {
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState('');
  useEffect(() => {
    const client = getSupabase();
    if (!client) return;
    async function applySession(session: Session | null) {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      if (!sessionUser) {
        setDisplayName('');
        return;
      }
      setDisplayName(sessionUser.user_metadata?.full_name || sessionUser.user_metadata?.name || sessionUser.email?.split('@')[0] || 'สมาชิก');
      const { data: profile } = await client!.from('profiles').select('full_name').eq('id', sessionUser.id).maybeSingle();
      if (profile?.full_name) setDisplayName(profile.full_name);
    }
    client.auth.getSession().then(({ data: { session } }) => applySession(session));
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, session) => { void applySession(session); });
    return () => subscription.unsubscribe();
  }, []);
  return { user, displayName };
}

function ArrowIcon({ back = false }: { back?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {back ? <><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></> : <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>}
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function SiteNav({ course }: { course?: CourseConfig }) {
  const [open, setOpen] = useState(false);
  const { user, displayName } = useSessionUser();
  const pathname = usePathname() ?? '';
  const segments = pathname.split('/').filter(Boolean);
  const meta = course ? metaFor(course) : null;
  const back = course && meta ? backTarget(course, segments, meta.topicWord) : null;
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', onKey); };
  }, [open]);

  async function logout() {
    const client = getSupabase();
    try { await client?.auth.signOut(); } catch { /* ignore */ }
    window.location.href = '/';
  }

  const style = meta ? ({ '--nav-accent': meta.accent, '--nav-soft': meta.soft, '--nav-line': meta.line } as React.CSSProperties) : undefined;

  return (
    <>
    <header className={styles.nav} style={style} data-site-nav>
      <div className={`container ${styles.inner}`}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo} aria-label="หน้าแรก SlothMove"><SlothMoveLogo size={28} className={course ? styles.logoCompact : undefined} /></Link>
          {course && meta ? (
            <Link href={`/courses/${course.id}`} className={styles.chip} title={course.title}>
              {course.theme.logo?.startsWith('/pic/logo_') ? <img src={course.theme.logo} alt="" aria-hidden="true" /> : <i aria-hidden="true" />}{meta.chip}
            </Link>
          ) : null}
          {back ? (
            <Link href={back.href} className={styles.back}><ArrowIcon back />{back.label}</Link>
          ) : null}
        </div>

        <nav className={styles.actions} aria-label="เมนูหลัก">
          {meta ? (
            <Link href={meta.primary.href} className={`${styles.action} ${styles.primary}`} title={meta.primary.title}>
              <SparkIcon /><span>{meta.primary.label}</span>
            </Link>
          ) : null}
          <button type="button" className={`${styles.action} ${styles.coffee}`} onClick={() => triggerDonatePrompt('nav')} title="เลี้ยงกาแฟ SlothMove" aria-label="เลี้ยงกาแฟ SlothMove">
            <span aria-hidden="true">☕</span>
          </button>
          <Link href="/courses" className={`${styles.action} ${isActive('/courses') && !course ? styles.current : ''}`}>
            <NavControlIcon type="exam" /><span>สนามสอบ</span>
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className={`${styles.action} ${isActive('/dashboard') ? styles.current : ''}`} title={displayName || 'สมาชิก'}>
                <NavControlIcon type="dashboard" /><span>Dashboard</span>
              </Link>
              <button type="button" onClick={logout} className={`${styles.action} ${styles.quiet}`}>
                <NavControlIcon type="logout" /><span>ออกจากระบบ</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className={styles.action}><NavControlIcon type="account" /><span>เข้าสู่ระบบ</span></Link>
              <Link href="/register" className={`${styles.action} ${styles.register}`}><span>สมัครฟรี</span></Link>
            </>
          )}
        </nav>

        <div className={styles.mobile}>
          {back ? (
            <Link href={back.href} className={styles.iconButton} aria-label={back.label}><ArrowIcon back /></Link>
          ) : null}
          <button
            type="button"
            className={`${styles.iconButton} ${styles.burger} ${open ? styles.burgerOpen : ''}`}
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'ปิดเมนู' : 'เปิดเมนู'}
            aria-expanded={open}
            aria-controls="site-nav-menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>

      {/* Outside the header: its backdrop-filter would otherwise trap these fixed layers. */}
      <button type="button" className={`${styles.backdrop} ${open ? styles.backdropOpen : ''}`} onClick={() => setOpen(false)} aria-label="ปิดเมนู" tabIndex={open ? 0 : -1} />
      <div id="site-nav-menu" className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`} style={style} aria-hidden={!open}>
        <div className={styles.drawerHead}>
          <div>
            <small>SLOTHMOVE</small>
            <strong>เมนู</strong>
            {user ? <span>{displayName || 'สมาชิก'}</span> : <span>ฝึกฟรีทุกชุด ไม่ต้องสมัครก็เริ่มได้</span>}
          </div>
          <button type="button" className={styles.iconButton} onClick={() => setOpen(false)} aria-label="ปิดเมนู">×</button>
        </div>
        <div className={styles.drawerList}>
          {meta ? (
            <Link href={meta.primary.href} className={styles.drawerPrimary}>
              <span className={styles.drawerIcon}><SparkIcon /></span>
              <span><strong>{meta.primary.title}</strong><small>{meta.primary.note}</small></span>
              <ArrowIcon />
            </Link>
          ) : null}
          {course && meta ? (
            <Link href={`/courses/${course.id}`}>
              <span className={styles.drawerIcon}><NavControlIcon type="exam" /></span>
              <span><strong>{meta.hubTitle}</strong><small>{meta.hubNote}</small></span>
              <ArrowIcon />
            </Link>
          ) : null}
          {back && back.href !== `/courses/${course?.id}` ? (
            <Link href={back.href}>
              <span className={styles.drawerIcon}><ArrowIcon back /></span>
              <span><strong>{back.label}</strong><small>ย้อนกลับหนึ่งขั้น</small></span>
              <ArrowIcon />
            </Link>
          ) : null}
          <Link href="/courses">
            <span className={styles.drawerIcon}><NavControlIcon type="exam" /></span>
            <span><strong>สนามสอบทั้งหมด</strong><small>นายสิบตำรวจ · สทนช. · สนามอื่น</small></span>
            <ArrowIcon />
          </Link>
          <Link href="/dashboard">
            <span className={styles.drawerIcon}><NavControlIcon type="dashboard" /></span>
            <span><strong>Dashboard ของฉัน</strong><small>ประวัติสอบ · สมุดข้อผิด · จุดที่ควรฝึก</small></span>
            <ArrowIcon />
          </Link>
          {user ? null : (
            <Link href="/register">
              <span className={styles.drawerIcon}><NavControlIcon type="account" /></span>
              <span><strong>เข้าสู่ระบบ / สมัครฟรี</strong><small>บันทึกผลสอบข้ามเครื่อง</small></span>
              <ArrowIcon />
            </Link>
          )}
          <Link href="/">
            <span className={styles.drawerIcon}><HomeIcon /></span>
            <span><strong>หน้าแรก</strong><small>SlothMove</small></span>
            <ArrowIcon />
          </Link>
          <button type="button" onClick={() => { setOpen(false); triggerDonatePrompt('nav_menu'); }} className={styles.drawerCoffee}>
            <span className={styles.drawerIcon}>☕</span>
            <span><strong>เลี้ยงกาแฟ SlothMove</strong><small>ช่วยให้ข้อสอบและโน้ตฟรีต่อไป</small></span>
            <ArrowIcon />
          </button>
          <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer">
            <span className={styles.drawerIcon}>f</span>
            <span><strong>Facebook Page</strong><small>ข่าวสารและอัปเดตจากทีมงาน</small></span>
            <ArrowIcon />
          </a>
          {user ? (
            <button type="button" onClick={logout} className={styles.drawerQuiet}>
              <span className={styles.drawerIcon}><NavControlIcon type="logout" /></span>
              <span><strong>ออกจากระบบ</strong><small>{displayName || 'สมาชิก'}</small></span>
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}
