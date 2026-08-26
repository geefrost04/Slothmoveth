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

  const { error: entitlementError } = await admin.from('entitlements').upsert(
    { user_id: userId, product_id: productId, source_order_id: order.id },
    { onConflict: 'user_id,product_id', ignoreDuplicates: true }
  );
  if (entitlementError) throw entitlementError;

  const { error: orderUpdateError } = await admin
    .from('orders')
    .update({ status: 'completed' })
    .eq('id', order.id);
  if (orderUpdateError) throw orderUpdateError;

  return { orderId: order.id, userId, productId };
}
