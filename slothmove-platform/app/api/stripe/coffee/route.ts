import { NextResponse } from 'next/server';
import { assertLiveStripeOnPublicSite, getStripe } from '@/lib/stripe';

const COFFEE_AMOUNTS = new Set([10, 20, 50]);
const PDF_PATHS = new Set([
  '/files/สรุปเรื่องเซต.pdf',
  '/files/police-general-ability-work-rate-sheet.png',
  '/files/police-general-ability-profit-loss-sheet.pdf',
  '/files/police-general-ability-permutation-sheet.pdf'
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
      success_url: `${siteUrl}/coffee/success?session_id={CHECKOUT_SESSION_ID}&amount=${body.amount}&pdf=${encodeURIComponent(body.pdfPath)}`,
      cancel_url: `${siteUrl}/courses/police_admin/math`
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Coffee checkout error', error);
    return NextResponse.json({ error: 'ระบบ PromptPay ยังไม่พร้อม กรุณาลองใหม่อีกครั้ง' }, { status: 500 });
  }
}
