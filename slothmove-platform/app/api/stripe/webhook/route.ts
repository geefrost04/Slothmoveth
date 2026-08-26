import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripe } from '@/lib/stripe';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { completePaidCheckoutSession } from '@/lib/stripe-orders';

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!signature || !webhookSecret) return new NextResponse('Webhook is not configured.', { status: 400 });

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(await request.text(), signature, webhookSecret);
  } catch (error) {
    console.error('Stripe webhook signature error', error);
    return new NextResponse('Invalid signature.', { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object;
      if (session.payment_status === 'paid' && session.metadata?.order_id) {
        await completePaidCheckoutSession(session);
      }
    }
    if (event.type === 'checkout.session.async_payment_failed' || event.type === 'checkout.session.expired') {
      const session = event.data.object;
      if (session.metadata?.order_id) {
        await getSupabaseAdmin().from('orders').update({ status: 'failed' }).eq('id', session.metadata.order_id);
      }
    }
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook processing error', error);
    return new NextResponse('Webhook processing failed.', { status: 500 });
  }
}
