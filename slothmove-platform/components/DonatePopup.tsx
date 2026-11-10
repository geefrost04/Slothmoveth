'use client';

import { useEffect, useState } from 'react';
import { snoozeDonatePrompt } from '@/lib/donate-prompt';
import { trackAnalyticsEvent } from '@/lib/analytics';
import styles from './DonatePopup.module.css';

const QR_SRC = '/pic/qr.jpg';
const AMOUNTS = [20, 50, 100] as const;

// Site-wide coffee popup. Main path: pick an amount → Stripe Checkout with PromptPay (amount preset). Fallback: the owner's own PromptPay QR. Opened by triggerDonatePrompt(source).
export function DonatePopup() {
  const [source, setSource] = useState<string | null>(null);
  const [paying, setPaying] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [showQr, setShowQr] = useState(false);
  const open = source !== null;

  useEffect(() => {
    function onDonate(event: Event) {
      const next = (event as CustomEvent<{ source?: string }>).detail?.source ?? 'manual';
      setSource(next);
      setPaying(null);
      setError('');
      setShowQr(false);
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

  async function donate(amount: number) {
    const from = source ?? 'manual';
    setPaying(amount);
    setError('');
    trackAnalyticsEvent('begin_checkout', { currency: 'THB', value: amount, item_category: 'donation', source: from });
    try {
      const response = await fetch('/api/stripe/donate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, source: from, returnPath: `${window.location.pathname}${window.location.search}` })
      });
      const data = await response.json() as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || 'เปิดหน้าชำระเงินไม่สำเร็จ');
      window.location.assign(data.url);
    } catch (donateError) {
      setPaying(null);
      setShowQr(true);
      setError(donateError instanceof Error ? donateError.message : 'เปิดหน้าชำระเงินไม่สำเร็จ');
    }
  }

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

        <div className={styles.amounts} role="group" aria-label="เลือกจำนวนเงิน">
          {AMOUNTS.map((amount) => (
            <button
              type="button"
              key={amount}
              className={`${styles.amount}${amount === 50 ? ` ${styles.amountPick}` : ''}`}
              onClick={() => donate(amount)}
              disabled={paying !== null}
            >
              {amount === 50 ? <small>ยอดนิยม</small> : null}
              <strong>฿{amount}</strong>
              <span>{paying === amount ? 'กำลังเปิด…' : amount === 20 ? 'กาแฟเย็น' : amount === 50 ? 'กาแฟ + ขนม' : 'มื้อกลางวัน'}</span>
            </button>
          ))}
        </div>
        <p className={styles.payNote}>ได้ QR พร้อมเพย์ที่ใส่ยอดไว้แล้ว ผ่านหน้าชำระเงินปลอดภัยของ Stripe</p>
        {error ? <p className={styles.error} role="alert">{error}</p> : null}

        {showQr ? (
          <div className={styles.qr}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={QR_SRC} alt="QR พร้อมเพย์สำหรับเลี้ยงกาแฟ SlothMove" width={220} height={220} />
            <span className={styles.qrNote}>สแกนจ่ายได้ทุกแอปธนาคาร · ตามกำลัง</span>
            <a
              href={QR_SRC}
              download="slothmove-promptpay.jpg"
              className={styles.qrSave}
              onClick={() => trackAnalyticsEvent('donate_qr_save', { source: source ?? 'manual' })}
            >
              บันทึกรูป QR
            </a>
          </div>
        ) : (
          <button type="button" className={styles.qrToggle} onClick={() => { setShowQr(true); trackAnalyticsEvent('donate_qr_show', { source: source ?? 'manual' }); }}>
            หรือสแกน QR พร้อมเพย์ ใส่ยอดเอง
          </button>
        )}

        <button type="button" className={styles.later} onClick={close}>ไว้คราวหน้า</button>
      </div>
    </div>
  );
}
