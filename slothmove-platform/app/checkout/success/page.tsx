import Link from 'next/link';
import { headers } from 'next/headers';
import { assertLiveStripeOnPublicSite, getStripe } from '@/lib/stripe';
import { completePaidCheckoutSession } from '@/lib/stripe-orders';

export const dynamic = 'force-dynamic';

export default async function CheckoutSuccessPage({
  searchParams
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;
  let completed = false;
  let returnHref = '/courses/police_admin/math';
  let returnLabel = 'กลับไปเลือกชุดข้อสอบ';

  if (sessionId?.startsWith('cs_')) {
    try {
      const requestHeaders = await headers();
      const host = requestHeaders.get('host') || 'localhost';
      const protocol = host.includes('localhost') ? 'http' : 'https';
      assertLiveStripeOnPublicSite(`${protocol}://${host}`);
      const session = await getStripe().checkout.sessions.retrieve(sessionId);
      if (session.metadata?.product_id?.startsWith('police_mock_test_set_')) {
        returnHref = '/courses/police_admin/mock-test';
        returnLabel = 'เริ่มทำ Mock Test';
      }
      if (session.status === 'complete' && session.payment_status === 'paid') {
        await completePaidCheckoutSession(session);
        completed = true;
      }
    } catch (error) {
      console.error('Unable to finalize Checkout Session', error);
    }
  }

  return (
    <main className="checkout-result">
      <section>
        <span aria-hidden="true">{completed ? '✓' : '…'}</span>
        <p>{completed ? 'ชำระเงินสำเร็จ' : 'กำลังตรวจสอบรายการ'}</p>
        <h1>{completed ? 'ปลดล็อกเนื้อหาแล้ว' : 'ยังยืนยันสิทธิ์ไม่สำเร็จ'}</h1>
        <p>
          {completed
            ? 'สิทธิ์ถูกบันทึกเข้าบัญชีแล้ว คุณสามารถเริ่มทำข้อสอบได้ทันที'
            : 'กรุณารอสักครู่แล้วรีเฟรชหน้านี้ หากยังไม่สำเร็จให้ติดต่อผู้ดูแลพร้อมเลขรายการชำระเงิน'}
        </p>
        <Link href={returnHref}>{returnLabel}</Link>
      </section>
    </main>
  );
}
