import { NextResponse } from 'next/server';
import { assertLiveStripeOnPublicSite, getStripe } from '@/lib/stripe';

const COFFEE_AMOUNTS = new Set([10, 20, 50]);
const PDF_PATHS = new Set([
  '/files/สรุปเรื่องเซต.pdf',
  '/files/police-general-ability-work-rate-sheet.png'
]);

export async function POST(request: Request) {
  try {
    assertLiveStripeOnPublicSite(request.url);
    const body = await request.json() as { amount?: number; pdfPath?: string };
    if (!body.amount || !COFFEE_AMOUNTS.has(body.amount) || !body.pdfPath || !PDF_PATHS.has(body.pdfPath)) {
      return NextResponse.json({ error: 'ตัวเลือกการสนับสนุนไม่ถูกต้อง' }, { status: 400 });
    }

    const requestOrigin = new URL(request.url).origin;
    const siteUrl = requestOrigin.includes('localhost')
      ? requestOrigin
      : process.env.NEXT_PUBLIC_SITE_URL || requestOrigin;
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      submit_type: 'donate',
      payment_method_types: ['promptpay'],
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'thb',
          unit_amount: body.amount * 100,
          product_data: {
            name: 'Pay me a coffee · SlothMove',
            description: 'สนับสนุนผู้จัดทำชีทสรุป SlothMove'
          }
        }
      }],
      metadata: {
        kind: 'coffee',
        amount_thb: String(body.amount),
        pdf_path: body.pdfPath
      },
      // Coffee support does not gate the PDF, so return directly to the sheet page.
      // This avoids a second synchronous Stripe lookup that can time out after payment.
      success_url: `${siteUrl}/courses/police_admin/math?coffee=thanks`,
      cancel_url: `${siteUrl}/courses/police_admin/math`
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Coffee checkout error', error);
    return NextResponse.json({ error: 'ระบบ PromptPay ยังไม่พร้อม กรุณาลองใหม่อีกครั้ง' }, { status: 500 });
  }
}
