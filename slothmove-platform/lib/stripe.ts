import Stripe from 'stripe';

let stripe: Stripe | null = null;

export function getStripeMode() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error('Stripe secret key is not configured.');
  return secretKey.startsWith('sk_live_') ? 'live' : 'test';
}

export function assertLiveStripeOnPublicSite(requestUrl: string) {
  const hostname = new URL(requestUrl).hostname;
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
  if (!isLocal && getStripeMode() !== 'live') {
    throw new Error('Live Stripe credentials are required on the public site.');
  }
}

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) throw new Error('Stripe secret key is not configured.');
  stripe ??= new Stripe(secretKey);
  return stripe;
}
