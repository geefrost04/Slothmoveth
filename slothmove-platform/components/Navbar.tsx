'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useTheme } from './ThemeProvider';

type NavbarProps = {
  backHref?: string;
  backLabel?: string;
};

export function Navbar({ backHref, backLabel = 'กลับหน้าหลัก' }: NavbarProps = {}) {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close on resize to desktop
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 769px)');
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) setMobileOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  function openDonate() {
    window.dispatchEvent(new CustomEvent('slothmove:donate'));
  }

  const closeMenu = () => setMobileOpen(false);

  return (
    <>
      <div className={`nav-wrapper${scrolled ? ' scrolled' : ''}`} id="navbar">
        <div className="container">
          <div className="nav-inner">
            <Link href="/" className="nav-logo" aria-label="SlothMove">
              <img src="/pic/slothmove_mascot.png" alt="SlothMove" width={36} height={36} style={{ objectFit: 'contain' }} />
              Sloth<span className="logo-accent">Move</span>
            </Link>

            <div className="nav-links">
              {backHref ? (
                <Link href={backHref} className="nav-link">
                  <span aria-hidden="true">←</span>
                  {backLabel}
                </Link>
              ) : null}
              <a href="#courses" className="nav-link">คอร์สทั้งหมด</a>
              <a href="#articles" className="nav-link">บทความ</a>
              <a href="#faq" className="nav-link">คำถามที่พบบ่อย</a>
              <a
                href="https://www.facebook.com/profile.php?id=61589670089745"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-facebook"
                aria-label="Facebook"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>

            <button
              className={`nav-hamburger${mobileOpen ? ' active' : ''}`}
              id="mobileMenuBtn"
              type="button"
              aria-label={mobileOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
              aria-expanded={mobileOpen}
              aria-controls="mobileMenu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              <svg className="icon-open" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className="icon-close" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6L18 18" />
              </svg>
            </button>

            <button
              type="button"
              className="nav-cta"
              id="navDonateBtn"
              onClick={openDonate}
            >
              <span className="coffee-icon">☕</span> เลี้ยงกาแฟ
              <span className="shine" />
              <span className="ripple" />
            </button>
            <button
              type="button"
              className={`nav-theme-toggle${theme === 'dark' ? ' is-dark' : ''}`}
              onClick={toggle}
              aria-label="สลับโหมดมืด/สว่าง"
              aria-pressed={theme === 'dark'}
            >
              <span className="nav-theme-sun" aria-hidden="true">☀</span>
              <span className="nav-theme-moon" aria-hidden="true">☾</span>
              <span className="nav-theme-knob" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          id="mobileMenu"
          className={`mobile-menu${mobileOpen ? ' active' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label="เมนูมือถือ"
        >
          <div className="mobile-menu-inner">
            {backHref ? (
              <Link href={backHref} onClick={closeMenu}>
                ← {backLabel}
              </Link>
            ) : null}
            <a href="#courses" onClick={closeMenu}>คอร์สทั้งหมด</a>
            <a href="#articles" onClick={closeMenu}>บทความ</a>
            <a href="#faq" onClick={closeMenu}>คำถามที่พบบ่อย</a>
            <a
              href="https://www.facebook.com/profile.php?id=61589670089745"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
            >
              Facebook
            </a>
            <button
              type="button"
              className="mobile-cta"
              onClick={() => {
                closeMenu();
                openDonate();
              }}
            >
              ☕ เลี้ยงกาแฟ
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
