'use client';

import Link from 'next/link';
import styles from './Footer.module.css';
import { SlothMoveLogo } from '@/components/brand/SlothMoveLogo';

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.04-.1z" />
    </svg>
  );
}

function ArrowUpIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

export function Footer() {
  function scrollToTop() {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <footer className={styles.masterFooter} id="footer">
      <div className={styles.footerContainer}>
        {/* Top Branding & Social Bar */}
        <div className={styles.footerTopBar}>
          <div className={styles.brandCol}>
            <Link href="/" className={styles.brandLogo} aria-label="กลับหน้าแรก SlothMove">
              <SlothMoveLogo size={32} />
            </Link>
            <p className={styles.brandTagline}>
              แพลตฟอร์มเตรียมสอบราชการและนายสิบตำรวจยุคใหม่ ฝึกตรงจุด วัดผลจริง รู้จุดอ่อนทันที
            </p>
          </div>

          <div className={styles.socialBox}>
            <a
              href="https://www.facebook.com/profile.php?id=61589670089745"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.socialBtn} ${styles.socialBtnFacebook}`}
              aria-label="ติดตามข่าวสารบน Facebook"
            >
              <FacebookIcon />
              <span>Facebook</span>
            </a>
            <a
              href="https://www.tiktok.com/@geefrostt"
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.socialBtn} ${styles.socialBtnTiktok}`}
              aria-label="ติดตามบน TikTok @geefrostt"
            >
              <TikTokIcon />
              <span>TikTok</span>
            </a>
          </div>
        </div>

        {/* 4-Column Navigation Grid */}
        <div className={styles.footerGrid}>
          {/* Column 1: Exams */}
          <div className={styles.navGroup}>
            <h3 className={styles.groupTitle}>สนามสอบราชการ</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/courses/police_admin">
                  นายสิบตำรวจ (สายอำนวยการ)
                </Link>
              </li>
              <li>
                <Link href="/courses">
                  ภาค ก ก.พ. <span className={styles.badgeComingSoon}>เร็ว ๆ นี้</span>
                </Link>
              </li>
              <li>
                <Link href="/courses">
                  ครูผู้ช่วย <span className={styles.badgeComingSoon}>เร็ว ๆ นี้</span>
                </Link>
              </li>
              <li>
                <Link href="/courses">
                  ดูสนามสอบทั้งหมด →
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Practice & Features */}
          <div className={styles.navGroup}>
            <h3 className={styles.groupTitle}>ระบบฝึก &amp; ข้อสอบ</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/courses/police_admin/mock-test">
                  Mock Test 150 ข้อ <span className={styles.badgeNew}>สนามจริง</span>
                </Link>
              </li>
              <li>
                <Link href="/daily-practice/math">
                  ควิซฟรี 10 ข้อประจำวัน
                </Link>
              </li>
              <li>
                <Link href="/courses/police_admin">
                  คลังข้อสอบแยก 6 หมวด
                </Link>
              </li>
              <li>
                <Link href="/courses/police_admin/computer/summary">
                  ชีทสรุป &amp; เทคนิคจำ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Dashboard & Stats */}
          <div className={styles.navGroup}>
            <h3 className={styles.groupTitle}>แดชบอร์ด &amp; ผลสอบ</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/dashboard">
                  ภาพรวมสถิติของฉัน
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  ประวัติการฝึก &amp; คะแนน
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  สมุดทบทวนข้อผิด
                </Link>
              </li>
              <li>
                <Link href="/dashboard">
                  จำลองเกณฑ์ตัดผ่าน 60%
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Help & Trust */}
          <div className={styles.navGroup}>
            <h3 className={styles.groupTitle}>ช่วยเหลือ &amp; นโยบาย</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/#faq">
                  คำถามที่พบบ่อย (FAQ)
                </Link>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/profile.php?id=61589670089745"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook Page
                </a>
              </li>
              <li>
                <a
                  href="https://www.tiktok.com/@geefrostt"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  TikTok: @geefrostt
                </a>
              </li>
              <li>
                <Link href="/login">
                  ระบบความปลอดภัยบัญชี
                </Link>
              </li>
              <li>
                <Link href="/#exam-selection">
                  เลือกสนามสอบเริ่มต้น
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Utility Bar */}
        <div className={styles.footerBottomBar}>
          <p className={styles.copyright}>
            © 2026 SlothMove. All rights reserved. มุ่งมั่นสร้างแพลตฟอร์มเตรียมสอบราชการที่ดีที่สุด
          </p>
          <button
            type="button"
            className={styles.backToTopBtn}
            onClick={scrollToTop}
            aria-label="เลื่อนกลับด้านบนของหน้าเว็บ"
          >
            <span>กลับด้านบน</span>
            <ArrowUpIcon />
          </button>
        </div>
      </div>
    </footer>
  );
}
