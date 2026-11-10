import { NextResponse } from 'next/server';
import { assertLiveStripeOnPublicSite, getStripe } from '@/lib/stripe';

// One-tap coffee donation from the site-wide popup: Stripe Checkout with PromptPay, amount preset.
// The payment itself is the record: Stripe keeps it with metadata kind=donation, source and page.
const AMOUNTS = new Set([20, 50, 100]);

function safeSource(value: unknown) {
  return typeof value === 'string' && /^[a-z0-9_]{1,40}$/.test(value) ? value : 'manual';
}

function safePath(value: unknown) {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') && value.length <= 200 ? value : '/';
}

export async function POST(request: Request) {
  try {
    assertLiveStripeOnPublicSite(request.url);
    const body = await request.json() as { amount?: number; source?: string; returnPath?: string };
    if (!body.amount || !AMOUNTS.has(body.amount)) {
      return NextResponse.json({ error: 'จำนวนเงินไม่ถูกต้อง' }, { status: 400 });
    }
    const source = safeSource(body.source);
    const returnPath = safePath(body.returnPath);
    const requestOrigin = new URL(request.url).origin;
    const siteUrl = requestOrigin.includes('localhost') ? requestOrigin : process.env.NEXT_PUBLIC_SITE_URL || requestOrigin;

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
            name: 'เลี้ยงกาแฟ SlothMove',
            description: 'สนับสนุนให้ข้อสอบและโน้ตสรุปบน SlothMove ฟรีต่อไป'
          }
        }
      }],
      metadata: { kind: 'donation', amount_thb: String(body.amount), source, return_path: returnPath },
      success_url: `${siteUrl}/coffee/thanks?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}${returnPath}`
    });
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Donation checkout error', error);
    return NextResponse.json({ error: 'ระบบชำระเงินยังไม่พร้อม ลองสแกน QR ด้านล่างแทนได้' }, { status: 500 });
  }
}
