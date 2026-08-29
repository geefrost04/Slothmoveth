'use client';

import { useEffect, useState } from 'react';
import styles from './CoffeePdfButton.module.css';
import { getDownloadAnalyticsData, trackAnalyticsEvent } from '@/lib/analytics';

const AMOUNTS = [10, 20, 50] as const;

export function CoffeePdfButton({
  pdfPath,
  className,
  style,
  children
}: {
  pdfPath: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [loadingAmount, setLoadingAmount] = useState<number | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && loadingAmount === null) setOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', closeOnEscape);
    };
  }, [open, loadingAmount]);

  function openPdf() {
    trackAnalyticsEvent('file_download', {
      ...getDownloadAnalyticsData(pdfPath),
      download_method: 'free_skip',
      file_type: 'study_sheet'
    });
    const pdfWindow = window.open(pdfPath, '_blank', 'noopener,noreferrer');
    if (!pdfWindow) window.location.assign(pdfPath);
    setOpen(false);
  }

  async function payCoffee(amount: number) {
    trackAnalyticsEvent('begin_checkout', {
      currency: 'THB',
      value: amount,
      item_category: 'coffee_support',
      items: [
        {
          item_id: pdfPath,
          item_name: 'Pay me a coffee',
          item_category: 'coffee_support',
          price: amount,
          quantity: 1
        }
      ]
    });
    trackAnalyticsEvent('coffee_checkout_start', {
      ...getDownloadAnalyticsData(pdfPath),
      value: amount,
      currency: 'THB'
    });
    setLoadingAmount(amount);
    setError('');
    try {
      const response = await fetch('/api/stripe/coffee', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, pdfPath })
      });
      const result = await response.json() as { url?: string; error?: string };
      if (!response.ok || !result.url) throw new Error(result.error || 'เปิดหน้าชำระเงินไม่สำเร็จ');
      window.location.assign(result.url);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : 'เปิดหน้าชำระเงินไม่สำเร็จ');
      setLoadingAmount(null);
    }
  }

  return (
    <>
      <button
        type="button"
        className={className}
        style={style}
        onClick={() => {
          // This is the prompt interaction, not a completed download.
          trackAnalyticsEvent('pdf_support_prompt_open', getDownloadAnalyticsData(pdfPath));
          setOpen(true);
        }}
      >
        {children}
      </button>

      {open ? (
        <div
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-labelledby="coffee-dialog-title"
          onClick={(event) => {
            if (event.target === event.currentTarget && loadingAmount === null) setOpen(false);
          }}
        >
          <section className={styles.dialog}>
            <button
              type="button"
              className={styles.close}
              aria-label="ปิดหน้าต่าง"
              disabled={loadingAmount !== null}
              onClick={() => setOpen(false)}
            >
              ×
            </button>
            <div className={styles.cup} aria-hidden="true">☕</div>
            <p className={styles.eyebrow}>SUPPORT SLOTHMOVE</p>
            <h2 id="coffee-dialog-title">Pay me a coffee</h2>
            <p className={styles.description}>
              ถ้าชีทนี้ช่วยให้คุณอ่านสอบง่ายขึ้น<br />สนับสนุนค่ากาแฟผู้จัดทำได้ตามสะดวกครับ
            </p>

            <div className={styles.amounts} aria-label="เลือกจำนวนเงินสนับสนุน">
              {AMOUNTS.map((amount) => (
                <button
                  type="button"
                  key={amount}
                  disabled={loadingAmount !== null}
                  onClick={() => payCoffee(amount)}
                >
                  <span>฿</span>{amount}
                  <small>{loadingAmount === amount ? 'กำลังเปิด PromptPay...' : 'เลี้ยงกาแฟ'}</small>
                </button>
              ))}
            </div>

            {error ? <p className={styles.error} role="alert">{error}</p> : null}

            <button
              type="button"
              className={styles.skip}
              disabled={loadingAmount !== null}
              onClick={openPdf}
            >
              ไว้คราวหน้า <span>0 บาท</span>
            </button>
            <p className={styles.note}>PDF เปิดอ่านได้ฟรี การสนับสนุนเป็นทางเลือกเสมอ</p>
          </section>
        </div>
      ) : null}
    </>
  );
}
