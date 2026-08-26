import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getStripe } from '@/lib/stripe';

export const dynamic = 'force-dynamic';

const PDF_PATHS = new Set(['/files/สรุปเรื่องเซต.pdf']);

export default async function CoffeeSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  if (sessionId?.startsWith('cs_')) {
    try {
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      const pdfPath = session.metadata?.pdf_path;
      if (
        session.status === 'complete' &&
        session.payment_status === 'paid' &&
        session.metadata?.kind === 'coffee' &&
        pdfPath &&
        PDF_PATHS.has(pdfPath)
      ) {
        redirect(pdfPath);
      }
    } catch (error) {
      if (error && typeof error === 'object' && 'digest' in error) throw error;
      console.error('Unable to verify coffee checkout', error);
    }
  }

  return (
    <main className="checkout-result">
      <section>
        <span aria-hidden="true">…</span>
        <p>กำลังตรวจสอบรายการ</p>
        <h1>ยังเปิด PDF ไม่สำเร็จ</h1>
        <p>หากชำระแล้ว กรุณารอสักครู่แล้วรีเฟรชหน้านี้</p>
        <Link href="/courses/police_admin/math">กลับไปหน้าความรู้ทั่วไป</Link>
      </section>
    </main>
  );
}
