import type Stripe from 'stripe';
import { getSupabaseAdmin } from './supabase-admin';

export async function completePaidCheckoutSession(session: Stripe.Checkout.Session) {
  if (session.payment_status !== 'paid') throw new Error('Checkout Session is not paid.');

  const orderId = session.metadata?.order_id;
  const userId = session.metadata?.user_id;
  const productId = session.metadata?.product_id;
  if (!orderId || !userId || !productId) throw new Error('Checkout session metadata is incomplete.');

  const admin = getSupabaseAdmin();
  const { data: order, error: orderError } = await admin
    .from('orders')
    .select('id,user_id,product_id,amount,status')
    .eq('id', orderId)
    .eq('stripe_session_id', session.id)
    .single();
  if (orderError || !order) throw new Error('Order does not match this Checkout Session.');
  if (order.user_id !== userId || order.product_id !== productId || order.amount !== session.amount_total) {
    throw new Error('Paid order values do not match the stored order.');
  }

  const { data: product, error: productError } = await admin
    .from('products')
    .select('metadata')
    .eq('id', productId)
    .single();
  if (productError || !product) throw new Error('Purchased product is missing.');

  const accessDurationDays = Number(
    (product.metadata as { access_duration_days?: unknown } | null)?.access_duration_days ?? 0
  );
  const expiresAt = Number.isInteger(accessDurationDays) && accessDurationDays > 0
    ? new Date(Date.now() + accessDurationDays * 24 * 60 * 60 * 1000).toISOString()
    : null;

  const { data: existingEntitlement, error: existingEntitlementError } = await admin
    .from('entitlements')
    .select('id,source_order_id,expires_at')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle();
  if (existingEntitlementError) throw existingEntitlementError;

  // Webhook deliveries are retried. Do not extend access a second time for
  // the same order, but let a fresh purchase renew an expired entitlement.
  if (!existingEntitlement) {
    const { error: entitlementError } = await admin.from('entitlements').insert({
      user_id: userId,
      product_id: productId,
      source_order_id: order.id,
      expires_at: expiresAt
    });
    if (entitlementError) throw entitlementError;
  } else if (existingEntitlement.source_order_id !== order.id) {
    const { error: entitlementError } = await admin
      .from('entitlements')
      .update({ source_order_id: order.id, expires_at: expiresAt })
      .eq('id', existingEntitlement.id);
    if (entitlementError) throw entitlementError;
  }

  const { error: orderUpdateError } = await admin
    .from('orders')
    .update({ status: 'completed' })
    .eq('id', order.id);
  if (orderUpdateError) throw orderUpdateError;

  return { orderId: order.id, userId, productId };
}
