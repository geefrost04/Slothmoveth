import { NextResponse } from 'next/server';
import { assertLiveStripeOnPublicSite, getStripe } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { getSupabaseServer } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    assertLiveStripeOnPublicSite(request.url);
    const body = await request.json() as { productId?: string };
    if (!body.productId) return NextResponse.json({ error: 'ไม่พบสินค้า' }, { status: 400 });

    const supabase = await getSupabaseServer();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'กรุณาเข้าสู่ระบบก่อนซื้อ', loginRequired: true }, { status: 401 });
    }

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id,title,description,price,stripe_price_id,is_published')
      .eq('id', body.productId)
      .eq('is_published', true)
      .maybeSingle();

    if (productError || !product || product.price <= 0) {
      return NextResponse.json({ error: 'สินค้านี้ยังไม่พร้อมจำหน่าย' }, { status: 400 });
    }

    const admin = getSupabaseAdmin();
    const { data: owned } = await admin
      .from('entitlements')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', product.id)
      .maybeSingle();
    if (owned) return NextResponse.json({ error: 'บัญชีนี้ปลดล็อกเนื้อหาแล้ว' }, { status: 409 });

    const { data: order, error: orderError } = await admin
      .from('orders')
      .insert({ user_id: user.id, product_id: product.id, amount: product.price, status: 'pending' })
      .select('id')
      .single();
    if (orderError || !order) throw new Error(orderError?.message || 'Unable to create order');

    const stripe = getStripe();
    const requestOrigin = new URL(request.url).origin;
    const siteUrl = requestOrigin.includes('localhost')
      ? requestOrigin
      : process.env.NEXT_PUBLIC_SITE_URL || requestOrigin;
    const lineItem = product.stripe_price_id
      ? { price: product.stripe_price_id, quantity: 1 }
      : {
          price_data: {
            currency: 'thb',
            unit_amount: product.price,
            product_data: { name: product.title, description: product.description || undefined }
          },
          quantity: 1
        };

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [lineItem],
      customer_email: user.email,
      client_reference_id: user.id,
      metadata: { order_id: order.id, user_id: user.id, product_id: product.id },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancelled?product_id=${encodeURIComponent(product.id)}`
    });

    await admin.from('orders').update({ stripe_session_id: session.id }).eq('id', order.id);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error', error);
    return NextResponse.json({ error: 'ระบบชำระเงินยังไม่พร้อม กรุณาลองใหม่อีกครั้ง' }, { status: 500 });
  }
}
