import { CoffeeSuccessRedirect } from '@/components/analytics/CoffeeSuccessRedirect';
import { headers } from 'next/headers';
import { assertLiveStripeOnPublicSite, getStripe } from '@/lib/stripe';

export default async function CoffeeSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  let paidAmount = 0;
  let pdfPath = '/files/สรุปเรื่องเซต.pdf';
  let isPaid = false;

  if (sessionId?.startsWith('cs_')) {
    try {
      const requestHeaders = await headers();
      const host = requestHeaders.get('host') || 'localhost';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      assertLiveStripeOnPublicSite(`${protocol}://${host}`);
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      isPaid = session.status === 'complete' && session.payment_status === 'paid' && session.metadata?.kind === 'coffee';
      if (isPaid) {
        paidAmount = (session.amount_total || 0) / 100;
        pdfPath = session.metadata?.pdf_path || pdfPath;
      }
    } catch (error) {
      console.error('Unable to verify coffee payment', error);
    }
  }

  if (!isPaid) {
    return (
      <main className="checkout-result">
        <section>
          <span aria-hidden="true">…</span>
          <p>กำลังตรวจสอบรายการ</p>
          <h1>ยังยืนยันการสนับสนุนไม่ได้</h1>
          <p>กรุณากลับไปหน้าชีทและลองใหม่อีกครั้ง หากถูกหักเงินแล้วให้ติดต่อผู้ดูแล</p>
        </section>
      </main>
    );
  }

  return (
    <CoffeeSuccessRedirect
      eventKey={`coffee_purchase:${sessionId}`}
      amount={paidAmount}
      pdfPath={pdfPath}
      redirectTo="/courses/police_admin/math?coffee=thanks"
    />
  );
}
