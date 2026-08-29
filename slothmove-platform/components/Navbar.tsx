'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Session } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/supabase';
import { NavControlIcon } from '@/components/nav/NavControlIcons';
import { TrackedLink } from '@/components/analytics/TrackedLink';

type NavbarProps = {
  backHref?: string;
  backLabel?: string;
};

export function Navbar({ backHref, backLabel = 'กลับหน้าหลัก' }: NavbarProps = {}) {
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [displayName, setDisplayName] = useState('');
  const router = useRouter();
  const supabase = getSupabase();

  useEffect(() => {
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
  }, [supabase]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  async function handleLogout(e: React.MouseEvent) {
    e.preventDefault();

    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        // ignore
      }
    }

    setUser(null);
    router.push('/');
    router.refresh();
  }

  return (
    <header className={`nav-wrapper${scrolled ? ' scrolled' : ''}`} id="navbar">
      <div className="container">
        <nav className="nav-inner" aria-label="เมนูหลัก">
          <Link href="/" className="nav-logo" aria-label="SlothMove">
            <span>Sloth<span className="logo-accent">Move</span></span>
          </Link>

          <div className="nav-actions" aria-label="เครื่องมือ">
            {user ? (
              <>
                <Link href="/courses/police_admin" className="nav-exams-btn" aria-label="ไปทำข้อสอบ">
                  <NavControlIcon type="exam" />
                  <span className="nav-control-label">ทำข้อสอบ</span>
                </Link>
                <Link href="/dashboard" className="nav-dashboard-btn" aria-label="Dashboard">
                  <NavControlIcon type="dashboard" />
                  <span className="nav-control-label">Dashboard</span>
                </Link>
                <Link href="/dashboard" className="nav-account-btn" aria-label={`บัญชี ${displayName || 'สมาชิก'}`}>
                  <NavControlIcon type="account" />
                  <span className="nav-control-label">{displayName || 'สมาชิก'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="nav-logout-btn"
                  type="button"
                  aria-label="ออกจากระบบ"
                >
                  <NavControlIcon type="logout" />
                  <span className="nav-control-label">ออกจากระบบ</span>
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="nav-login-btn">
                  <NavControlIcon type="account" />
                  <span className="nav-control-label">เข้าสู่ระบบ</span>
                </Link>
                <TrackedLink
                  href="/register"
                  className="nav-register-btn"
                  eventName="register_cta_click"
                  parameters={{ location: 'home_nav' }}
                >
                  <span className="nav-control-label">สมัครฟรี</span>
                </TrackedLink>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
