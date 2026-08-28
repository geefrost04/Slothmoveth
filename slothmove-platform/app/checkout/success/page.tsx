import Link from 'next/link';
import { headers } from 'next/headers';
import { assertLiveStripeOnPublicSite, getStripe } from '@/lib/stripe';
import { completePaidCheckoutSession } from '@/lib/stripe-orders';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { TrackEventOnMount } from '@/components/analytics/TrackEventOnMount';

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
  let purchaseAnalytics: {
    eventKey: string;
    parameters: {
      transaction_id: string;
      currency: string;
      value: number;
      items: Array<{
        item_id: string;
        item_name: string;
        price: number;
        quantity: number;
      }>;
    };
  } | null = null;

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
        const productId = session.metadata?.product_id;
        const amountTotal = session.amount_total ?? 0;
        let productTitle = productId || 'SlothMove product';

        if (productId) {
          const { data: product } = await getSupabaseAdmin()
            .from('products')
            .select('title')
            .eq('id', productId)
            .maybeSingle();
          if (product?.title) productTitle = product.title;
        }

        purchaseAnalytics = {
          eventKey: `purchase:${session.id}`,
          parameters: {
            transaction_id: session.id,
            currency: (session.currency || 'thb').toUpperCase(),
            value: amountTotal / 100,
            items: [
              {
                item_id: productId || 'unknown_product',
                item_name: productTitle,
                price: amountTotal / 100,
                quantity: 1
              }
            ]
          }
        };
      }
    } catch (error) {
      console.error('Unable to finalize Checkout Session', error);
    }
  }

  return (
    <main className="checkout-result">
      {purchaseAnalytics ? (
        <TrackEventOnMount
          eventName="purchase"
          eventKey={purchaseAnalytics.eventKey}
          parameters={purchaseAnalytics.parameters}
        />
      ) : null}
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
