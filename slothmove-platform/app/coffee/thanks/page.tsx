import type { Metadata } from 'next';
import Link from 'next/link';
import { headers } from 'next/headers';
import { assertLiveStripeOnPublicSite, getStripe } from '@/lib/stripe';
import { TrackEventOnMount } from '@/components/analytics/TrackEventOnMount';
import styles from './page.module.css';

export const metadata: Metadata = { title: 'ขอบคุณที่เลี้ยงกาแฟ', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

// Landing after a popup donation (app/api/stripe/donate). Verifies the Stripe session, then thanks the donor.
export default async function DonationThanksPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id: sessionId } = await searchParams;
  let amount = 0;
  let returnPath = '/';
  let source = 'manual';
  let paid = false;
  let pending = false;

  if (sessionId?.startsWith('cs_')) {
    try {
      const host = (await headers()).get('host') || 'localhost';
      assertLiveStripeOnPublicSite(`${host.includes('localhost') ? 'http' : 'https'}://${host}`);
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      if (session.metadata?.kind === 'donation') {
        returnPath = session.metadata.return_path?.startsWith('/') && !session.metadata.return_path.startsWith('//') ? session.metadata.return_path : '/';
        source = session.metadata.source || 'manual';
        paid = session.status === 'complete' && session.payment_status === 'paid';
        pending = session.status === 'complete' && session.payment_status !== 'paid';
        amount = (session.amount_total || 0) / 100;
      }
    } catch (error) {
      console.error('Unable to verify donation', error);
    }
  }

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        {paid ? (
          <>
            <TrackEventOnMount
              eventName="purchase"
              eventKey={`donation:${sessionId}`}
              parameters={{
                transaction_id: sessionId ?? '',
                currency: 'THB',
                value: amount,
                item_category: 'donation',
                source,
                items: [{ item_id: `donation_${amount}`, item_name: 'เลี้ยงกาแฟ SlothMove', item_category: 'donation', price: amount, quantity: 1 }]
              }}
            />
            <span className={styles.cup} aria-hidden="true">☕</span>
            <p className={styles.kicker}>ได้รับค่ากาแฟ ฿{amount.toLocaleString('th-TH')} แล้ว</p>
            <h1>ขอบคุณมากครับ</h1>
            <p>ค่ากาแฟของคุณช่วยให้ข้อสอบและโน้ตสรุปบน SlothMove เปิดฟรีต่อไป และมีชุดใหม่ออกมาเรื่อย ๆ</p>
            <p className={styles.wish}>ขอให้สอบผ่านนะครับ 🙏</p>
          </>
        ) : pending ? (
          <>
            <span className={styles.cup} aria-hidden="true">⏳</span>
            <p className={styles.kicker}>กำลังรอยืนยันจากธนาคาร</p>
            <h1>ได้รับรายการแล้ว</h1>
            <p>ธนาคารยังยืนยันยอดไม่เสร็จ โดยปกติใช้เวลาไม่กี่นาที ไม่ต้องจ่ายซ้ำครับ ขอบคุณที่สนับสนุน</p>
          </>
        ) : (
          <>
            <span className={styles.cup} aria-hidden="true">☕</span>
            <p className={styles.kicker}>ยังไม่พบรายการ</p>
            <h1>ยังยืนยันการเลี้ยงกาแฟไม่ได้</h1>
            <p>ถ้ายังไม่ได้จ่าย กลับไปเลือกยอดใหม่ได้เลย ถ้าถูกหักเงินแล้ว ติดต่อเราทาง Facebook SlothMove ได้ครับ</p>
          </>
        )}
        <Link href={returnPath} className={styles.back}>กลับไปฝึกต่อ →</Link>
      </section>
    </main>
  );
}
