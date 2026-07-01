'use client';

import { useEffect, useState } from 'react';
import { getCurrentPagePath, trackEvent } from '@/lib/gtag';

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function MenuOpenIcon() {
  return (
    <svg className="icon-open" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function MenuCloseIcon() {
  return (
    <svg className="icon-close" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6L18 18" />
    </svg>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showFirstVisitHint, setShowFirstVisitHint] = useState(false);
  const [rippleActive, setRippleActive] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
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

  useEffect(() => {
    try {
      if (localStorage.getItem('slothmove_nav_hint_seen')) return;
      setShowFirstVisitHint(true);
      const timer = window.setTimeout(() => {
        setShowFirstVisitHint(false);
        localStorage.setItem('slothmove_nav_hint_seen', '1');
      }, 4400);
      return () => window.clearTimeout(timer);
    } catch {
      return undefined;
    }
  }, []);

  function openDonate() {
    setRippleActive(false);
    window.requestAnimationFrame(() => setRippleActive(true));
    window.setTimeout(() => setRippleActive(false), 650);
    trackEvent('click_donate_cta', {
      page_path: getCurrentPagePath(),
      section: mobileOpen ? 'mobile_menu' : 'navbar',
      label: mobileOpen ? 'mobile_donate' : 'navbar_donate'
    });
    window.dispatchEvent(new CustomEvent('slothmove:donate'));
  }

  const closeMenu = () => setMobileOpen(false);

  return (
    <>
      <div className={`nav-wrapper${scrolled ? ' scrolled' : ''}`} id="navbar">
        <div className="container">
          <div className="nav-inner">
            <a
              href="/"
              className="nav-logo"
              aria-label="SlothMove"
              data-analytics-event="click_logo"
              data-analytics-label="navbar_logo"
              data-analytics-section-name="navbar"
              data-analytics-destination="/"
            >
              <img src="/pic/slothmove_mascot.png" alt="SlothMove" width={40} height={40} />
              <span>Sloth<span className="logo-accent">Move</span></span>
            </a>

            <div className="nav-links" aria-label="เมนูหลัก">
              <a
                href="#courses"
                className="nav-link"
                data-analytics-event="click_nav"
                data-analytics-label="nav_courses"
                data-analytics-section-name="navbar"
                data-analytics-destination="#courses"
              >
                คอร์สทั้งหมด
              </a>
              <a
                href="#articles"
                className="nav-link"
                data-analytics-event="click_nav"
                data-analytics-label="nav_articles"
                data-analytics-section-name="navbar"
                data-analytics-destination="#articles"
              >
                บทความ
              </a>
              <a
                href="#faq"
                className="nav-link"
                data-analytics-event="click_nav"
                data-analytics-label="nav_faq"
                data-analytics-section-name="navbar"
                data-analytics-destination="#faq"
              >
                คำถามที่พบบ่อย
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61589670089745"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-facebook"
                aria-label="Facebook"
                data-analytics-event="click_social"
                data-analytics-label="navbar_facebook"
                data-analytics-section-name="navbar"
                data-analytics-destination="facebook"
              >
                <FacebookIcon />
              </a>
            </div>

            <button
              className={`nav-hamburger${mobileOpen ? ' active' : ''}`}
              type="button"
              aria-label={mobileOpen ? 'ปิดเมนู' : 'เปิดเมนู'}
              aria-expanded={mobileOpen}
              aria-controls="mobileMenu"
              onClick={() => {
                const nextOpen = !mobileOpen;
                trackEvent(nextOpen ? 'open_mobile_menu' : 'close_mobile_menu', {
                  page_path: getCurrentPagePath(),
                  section: 'navbar'
                });
                setMobileOpen(nextOpen);
              }}
            >
              <MenuOpenIcon />
              <MenuCloseIcon />
            </button>

            <button
              type="button"
              className={`nav-cta${showFirstVisitHint ? ' first-visit' : ''}`}
              onClick={openDonate}
              aria-label="เลี้ยงกาแฟ"
            >
              <span className="coffee-icon">☕</span>
              <span>เลี้ยงกาแฟ</span>
              <span className="shine" />
              <span className={`ripple${rippleActive ? ' fire' : ''}`} />
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
            <a
              href="#courses"
              onClick={closeMenu}
              data-analytics-event="click_nav"
              data-analytics-label="mobile_nav_courses"
              data-analytics-section-name="mobile_menu"
              data-analytics-destination="#courses"
            >
              คอร์สทั้งหมด
            </a>
            <a
              href="#articles"
              onClick={closeMenu}
              data-analytics-event="click_nav"
              data-analytics-label="mobile_nav_articles"
              data-analytics-section-name="mobile_menu"
              data-analytics-destination="#articles"
            >
              บทความ
            </a>
            <a
              href="#faq"
              onClick={closeMenu}
              data-analytics-event="click_nav"
              data-analytics-label="mobile_nav_faq"
              data-analytics-section-name="mobile_menu"
              data-analytics-destination="#faq"
            >
              คำถามที่พบบ่อย
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61589670089745"
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenu}
              data-analytics-event="click_social"
              data-analytics-label="mobile_menu_facebook"
              data-analytics-section-name="mobile_menu"
              data-analytics-destination="facebook"
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
