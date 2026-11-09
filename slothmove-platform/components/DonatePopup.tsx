'use client';

import { useEffect, useState } from 'react';
import { snoozeDonatePrompt } from '@/lib/donate-prompt';
import { trackAnalyticsEvent } from '@/lib/analytics';
import styles from './DonatePopup.module.css';

const QR_SRC = '/pic/qr.jpg';

// Site-wide coffee popup (PromptPay QR). Opened by triggerDonatePrompt(source) from lib/donate-prompt.
export function DonatePopup() {
  const [source, setSource] = useState<string | null>(null);
  const open = source !== null;

  useEffect(() => {
    function onDonate(event: Event) {
      const next = (event as CustomEvent<{ source?: string }>).detail?.source ?? 'manual';
      setSource(next);
      trackAnalyticsEvent('donate_open', { source: next });
    }
    window.addEventListener('slothmove:donate', onDonate);
    return () => window.removeEventListener('slothmove:donate', onDonate);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') close(); };
    document.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = previous; document.removeEventListener('keydown', onKey); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function close() {
    if (source === 'auto_after_exam') snoozeDonatePrompt();
    trackAnalyticsEvent('donate_close', { source: source ?? 'manual' });
    setSource(null);
  }

  if (!open) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="donate-title" onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div className={styles.card}>
        <button type="button" className={styles.x} aria-label="ปิด" onClick={close}>×</button>
        <div className={styles.head}>
          <span className={styles.cup} aria-hidden="true">☕</span>
          <h2 id="donate-title">เลี้ยงกาแฟ SlothMove สักแก้ว</h2>
          <p>ข้อสอบ โน้ต และเฉลยทั้งหมด<b>เปิดให้ใช้ฟรี</b><br />ค่ากาแฟของคุณช่วยให้มีชุดใหม่ออกมาเรื่อย ๆ</p>
        </div>

        <div className={styles.qr}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={QR_SRC} alt="QR พร้อมเพย์สำหรับเลี้ยงกาแฟ SlothMove" width={220} height={220} />
          <span className={styles.qrNote}>สแกนจ่ายได้ทุกแอปธนาคาร · ตามกำลัง</span>
        </div>

        <div className={styles.actions}>
          <a
            href={QR_SRC}
            download="slothmove-promptpay.jpg"
            className={styles.save}
            onClick={() => trackAnalyticsEvent('donate_qr_save', { source: source ?? 'manual' })}
          >
            บันทึกรูป QR
          </a>
          <button type="button" className={styles.later} onClick={close}>ไว้คราวหน้า</button>
        </div>
        <p className={styles.hint}>บนมือถือ: บันทึกรูป QR แล้วเปิดแอปธนาคาร เลือกสแกนจากรูปภาพ<br />ขอบคุณที่ช่วยให้ SlothMove ฟรีต่อไปครับ</p>
      </div>
    </div>
  );
}
