'use client';

import { useEffect, useState } from 'react';

export function DonatePopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onDonate() {
      setOpen(true);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    window.addEventListener('slothmove:donate', onDonate);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('slothmove:donate', onDonate);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  function close() {
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className="donate-popup-overlay active"
      role="dialog"
      aria-modal="true"
      aria-labelledby="donate-popup-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div className="donate-popup">
        <button
          className="donate-popup-close"
          type="button"
          aria-label="ปิด"
          onClick={close}
        >
          ×
        </button>
        <div className="donate-popup-icon" aria-hidden>☕</div>
        <div id="donate-popup-title" className="donate-popup-title">
          เลี้ยงกาแฟผมหน่อยครับ
        </div>
        <p className="donate-popup-desc">
          SlothMove ตั้งใจทำให้ทุกคนเรียนฟรี
          <br />
          ร่วมสนับสนุนได้ตามกำลังครับ
        </p>
        <div className="qr-card">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/pic/qr.jpg" alt="QR พร้อมเพย์" loading="lazy" decoding="async" />
          <div className="promptpay">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay-logo.png"
              alt="PromptPay"
            />
          </div>
          <p className="qr-note">*สแกนจ่ายได้ทุกแอปธนาคาร</p>
        </div>
        <a
          href="https://www.facebook.com/profile.php?id=61589670089745"
          target="_blank"
          rel="noopener noreferrer"
          className="donate-fb-btn"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          ติดตาม SlothMove
        </a>
        <button type="button" className="donate-popup-close-btn" onClick={close}>
          ปิด
        </button>
      </div>
    </div>
  );
}