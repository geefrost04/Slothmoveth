'use client';

import { useState, useEffect } from 'react';
import styles from './StudySheetReader.module.css';

export function BackToTopButton() {
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!showScroll) return null;

  return (
    <button
      className={styles.backToTop}
      onClick={scrollToTop}
      aria-label="กลับสู่ด้านบน"
    >
      ▲
    </button>
  );
}
